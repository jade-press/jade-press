
'use strict'

/**
 * catogory
 */
var _ = require('lodash')
,local = require('../app/local')
,setting = require('../app/setting')
,tools = require('./tools')
,log = tools.log
,err = tools.err
,db = require('./db').db
,validater = require('s-validater').validate
,docs = require('../doc/db').group
,accessPool = require('../doc/api').accesses
,escRegStr = require('escape-string-regexp')

exports.add = async (ctx, next) => {

	try {
		
		let body = ctx.request.body
		body = _.pick(body, [
			'name'
			,'access'
			,'desc'
		])
		let user = ctx.session.user || {}
		user = _.pick(user, ['_id', 'name', 'email'])

		body.createBy = user

		let validateResult = validater(body, docs)

		if(!validateResult.errCount) {
			body = validateResult.result
			var insd = await db.collection('group').insertOne(body)
			ctx.body = {
				code: 0
				,result: body
				,res: insd
			}
		} else {
			ctx.body = {
				code: 1
				,errFields: validateResult.errFields
				,errs: validateResult.errs
			}
		}


	} catch(e) {

		err(e, 'add group failed')

		return ctx.body = {
			code: 1
			,errorMsg: 'add group failed:' + e
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

		let res = await db.collection('group').deleteOne(opt)

		ctx.body = {
			code: 0
			,result: res
		}

	} catch(e) {

		err(e, 'del group failed')

		return ctx.body = {
			code: 1
			,errorMsg: 'del group failed:' + e
		}

	}
}

exports.get = async (ctx, next) => {

	try {

		let sess = ctx.session
		let user = sess.user || {}

		let body = ctx.request.body
		let _id = body._id
		let name = body.name
		let type = body.type
		let fields = body.fields

		let opt = {}
		let opt2 = {}

		if(_id) opt._id = _id
		if(type) opt.type = type
		if(name) opt.name = new RegExp(escRegStr(name))
		if(fields) opt2.fields = fields
		let sort = {
			createTime: -1
		}

		let total = await db.collection('group').count(opt)
		let res = await db.collection('group').find(opt, opt2)
		.sort(sort)
		.toArray()

		ctx.body = {
			code: 0
			,result: res
			,total: total
		}

	} catch(e) {

		err(e, 'get group failed')

		return ctx.body = {
			code: 1
			,errorMsg: 'get group failed:' + e
		}

	}

}

exports.update = async (ctx, next) => {
	
	try {
		
		let body = ctx.request.body

		let _id = body._id

		let ind = await db.collection('group').findOne({
			_id: _id
		})

		if(!ind) {
			return ctx.body = {
				code: 0
				,errorMsg: 'group not exists'
			}
		}

		let keys = [
			'name'
			,'desc'
			,'access'
		]
		body = _.pick(body, keys)

		let cdoc = _.pick(docs, Object.keys(body))

		let validateResult = validater(body, cdoc)

		if(validateResult.errCount) {
			return ctx.body = {
				code: 1
				,errFields: validateResult.errFields
				,errs: validateResult.errs
			}
		}

		let res = validateResult.result
		res.updateTime = new Date()
		var insd = await db.collection('group').updateOne({
			_id: _id
		}, { $set: res })

		await exports.updateGroupFromUser(_id, res)

		ctx.body = {
			code: 0
			,result: insd
		}



	} catch(e) {

		err(e, 'update group failed')

		return ctx.body = {
			code: 1
			,errorMsg: 'update group failed:' + e
		}

	}
}

exports.getAccesses = async (ctx, next) => {
	
	try {
		
		ctx.body = {
			code: 0
			,result: accessPool
		}


	} catch(e) {

		err(e, 'getAccesses failed')

		return ctx.body = {
			code: 1
			,errorMsg: 'getAccesses failed:' + e
		}

	}

}

exports.updateGroupFromUser = async function (id, body) {

	let sea = {
		'group._id': id
	}

	let toset = {}

	_.each(body, function(value, key) {
		toset['group.' + key] = value
	})

	let rm = {
		$set: toset
	}

	return db.collection('user').updateMany(sea, rm)

}