
'use strict'

/**
 * catogory
 */
const
_ = require('lodash')
,local = require('../app/local')
,setting = require('../app/setting')
,tools = require('./tools')
,log = tools.log
,err = tools.err
,db = require('./db').db
,validater = require('s-validater').validatePromise
,types = require('s-validater').types
,docs = require('../doc/db').cat
,newId = require('./meta').createDigitId
,cid = require('shortid').generate
,escRegStr = require('escape-string-regexp')
,publics = {}
,plugins = require('../lib/plugins').plugins

/**
	* getCats
	* params {object} option
	* params.page {number} default=1
	* params.pageSize {number} default=100
	* params.name {string} default=undefined
	*/
publics.tools = tools
publics.afterChangeActions = []
publics.getCats = async function (_option) {


	let option = _.isPlainObject(_option)?_option:{}
	let sortOption = {
		createTime: -1
	}

	let sea1 = _.pick(option, ['_id', 'id', 'slug'])
	sea1.parentId = '__root_cat'

	if(sea1._id || sea1.id || sea1.slug) {
		return db.collection('cat').findOne(sea1)
	}


	let pageSize = (_.isNumber(option.pageSize) && option.pageSize >=1)?option.pageSize:100
	pageSize = Math.floor(pageSize, 10)
	let page = _.isNumber(option.page) && option.page >=1?option.page:1
	page = Math.floor(page, 10)

	if(_.isString(option.name)) sea1.name = new RegExp(escRegStr(option.name))

	var cats = await db.collection('cat').find(sea1, {
		fields: {
			name: 1
			,desc: 1
			,slug: 1
			,id: 1
		}
	})
	.sort(sortOption)
	.limit(pageSize)
	.skip((page - 1) * pageSize)
	.toArray()

	var total = await db.collection('cat').count(sea1)

	return Promise.resolve({
		total: total
		,cats: cats
	})

}

exports.afterChangeActions = publics.afterChangeActions
exports.publicExports = publics
exports.publics = publics

async function afterChangeActions (option) {

	for(let i = 0, len = exports.afterChangeActions.length;i < len;i ++) {
		await exports.afterChangeActions[i](option)
	}
	return Promise.resolve()

}

exports.add = async (ctx, next) => {

	try {
		
		let body = ctx.request.body
		let user = ctx.session.user || {}
		user = _.pick(user, ['_id', 'name', 'email'])

		//todo:meta,visit
		body = _.pick(body, [
			'name'
			,'slug'
			,'desc'
		])

		body._id = cid()
		body.createBy = user

		let validateResult = await validater(body, docs)

		if(validateResult.errCount) {
			return ctx.body = {
				code: 1
				,errFields: validateResult.errFields
				,errs: validateResult.errs
			}
		}

		if(body.slug === validateResult.result.slug) {

			let indb = await db.collection('cat').findOne({
				slug: body.slug
			})

			if(indb) {
				return ctx.body = {
					code: 1
					,errorMsg: 'slug already used'
					,errorField: 'slug'
				}
			}
		}

		body = validateResult.result
		let insd = await db.collection('cat').insertOne(body)

		await afterChangeActions({
			_id: body._id
			,action: 'add'
			,local: ctx.local
		})

		ctx.body = {
			code: 0
			,result: body
			,res: insd
		}


	} catch(e) {

		err(e, 'add cat failed')

		return ctx.body = {
			code: 1
			,errorMsg: 'add cat failed:' + e
		}

	}

}

exports.del = async (ctx, next) => {

	try {
		
		let body = ctx.request.body
		let _id = body._id
		let opt = {
			_id: _id
			,type: 'user-created'
		}

		let indb = db.collection('cat').count(opt)

		if(!indb) {
			return ctx.body = {
				code: 1
				,errorMsg: 'cat not exists'
			}
		}

		let res = await db.collection('cat').deleteOne(opt)
		let res1 = await exports.removeCatFromPost(body)

		await afterChangeActions({
			_id: body._id
			,action: 'del'
		})

		ctx.body = {
			code: 0
			,result: res
			,res: res1
		}

	} catch(e) {

		err(e, 'del cat failed')

		return ctx.body = {
			code: 1
			,errorMsg: 'del cat failed:' + e
		}

	}
}

exports.get = async (ctx, next) => {

	try {

		let sess = ctx.session
		let user = sess.user || {}

		let body = ctx.request.body
		let id = body.id
		let name = body.name
		let pid = body.parentId
		let fields = body.fields
		let page = parseInt(body.page, 10) || 1
		let pageSize = parseInt(body.pageSize, 10) || 500
		let opt = {}
		let opt2 = {
			skip: (page - 1) * pageSize
			,limit: pageSize
		}

		if(fields) opt2.fields = fields

		if(id) opt.id = id
		if(pid) opt.parentId = pid
		if(name) opt.name = new RegExp(escRegStr(name))

		let sort = {
			createTime: -1
		}
		let total = await db.collection('cat').count(opt)
		let res = await db.collection('cat').find(opt, opt2)
		.sort(sort)
		.toArray()

		ctx.body = {
			code: 0
			,result: res
			,total: total
		}

	} catch(e) {

		err(e, 'get cat failed')

		return ctx.body = {
			code: 1
			,errorMsg: 'get cat failed:' + e
		}

	}

}

exports.update = async (ctx, next) => {
	
	try {
		
		let body = ctx.request.body

		let _id = body._id

		let ind = await db.collection('cat').findOne({
			_id: _id
		})

		if(!ind) {
			return ctx.body = {
				code: 0
				,errorMsg: 'cat not exists'
			}
		}

		let keys = [
			'name'
			,'slug'
			,'desc'
			,'group'
		]
		body = _.pick(body, keys)

		let cdoc = _.pick(docs, Object.keys(body))

		let validateResult = await validater(body, cdoc)

		if(validateResult.errCount) {
			ctx.body = {
				code: 1
				,errFields: validateResult.errFields
				,errs: validateResult.errs
			}
		}

		let res = validateResult.result

		if(res.slug && res.slug !== ind.slug) {

			let indb = await db.collection('cat').findOne({
				slug: res.slug
			})

			if(indb) {
				return ctx.body = {
					code: 1
					,errorMsg: 'slug already used'
					,errorField: 'slug'
				}
			}
		}

		res.updateTime = new Date()
		var insd = await db.collection('cat').updateOne({
			_id: _id
		}, { $set: res })

		await exports.updateCatFromPost(_id, res)

		await afterChangeActions({
			_id: body._id
			,action: 'update'
			,local: ctx.local
		})

		ctx.body = {
			code: 0
			,result: insd
		}




	} catch(e) {

		err(e, 'update cat failed')

		return ctx.body = {
			code: 1
			,errorMsg: 'update cat failed:' + e
		}

	}
}

exports.removeCatFromPost = async function (body) {

	let sea = {
		'cats._id': body._id
	}

	let rm = {
		$pull: {
			cats: {
				_id: body._id
			}
		}
	}

	return db.collection('post').updateMany(sea, rm)

}


exports.updateCatFromPost = async function (id, body) {

	let sea = {
		'cats._id': id
	}

	let toset = {}

	_.each(body, function(value, key) {
		toset['cats.$.' + key] = value
	})
	
	let rm = {
		$set: toset
	}

	return db.collection('post').updateMany(sea, rm)

}


tools.extendLib(__filename, exports, plugins)