
'use strict'

/**
 * catogory
 */
const
_ = require('lodash')
,local = require('../app/local')
,setting = require('../app/setting')
,tools = require('./tools')
,time = require('../lib/time').date
,log = tools.log
,err = tools.err
,db = require('./db').db
,validater = require('s-validater').validatePromise
,docs = require('../doc/db').post
,styleParser = tools.parseStylus
,jadeParser = tools.parseJade
,newId = require('./meta').createDigitId
,escRegStr = require('escape-string-regexp')
,insane = require('insane')
,publics = {}
,plugins = require('../lib/plugins').plugins

publics.afterChangeActions = []
publics.tools = tools
publics.getPosts = async function (_option) {

	let option = _.isPlainObject(_option)? _option : {}
	let sortOption = {
		createTime: -1
	}
	let sea1 = _.pick(option, ['_id', 'id', 'slug'])
	sea1.published = true
	let sea2 = {}
	if(option.fields) sea2.fields = option.fields

	if(sea1._id || sea1.id || sea1.slug) {
		sea2.returnOriginal = false
		let res = await db.collection('post').findOneAndUpdate(sea1, {
			$inc: {
				visit: 1
			}
		}, sea2)
		return Promise.resolve(res.value)
	}

	let pageSize = _.isNumber(option.pageSize) && option.pageSize >=1?option.pageSize:local.pageSize
	pageSize = Math.floor(pageSize, 10)
	let page = _.isNumber(option.page) && option.page >=1?option.page:1
	page = Math.floor(page, 10)

	if(_.isString(option.title)) sea1.title = new RegExp(escRegStr(option.title))
	if(option.cat_id) sea1['cats._id'] = option.cat_id
	if(option.catslug) sea1['cats.slug'] = option.catslug
	if(option.catid) sea1['cats.id'] = option.catid

	let posts = await db.collection('post').find(sea1, sea2)
	.sort(sortOption)
	.limit(pageSize)
	.skip((page - 1) * pageSize)
	.toArray()
	let total = await db.collection('post').count(sea1)

	return Promise.resolve({
		posts: posts
		,total: total
	})

}

exports.afterChangeActions = publics.afterChangeActions
exports.publicExports = publics
exports.publics = publics
exports.htmlFilterOption = {}

function htmlFilter(html) {
	return insane(html, exports.htmlFilterOption)
}

async function afterChangeActions (option) {

	for(let i = 0, len = exports.afterChangeActions.length;i < len;i ++) {
		await exports.afterChangeActions[i](option)
	}
	return Promise.resolve()

}

exports.add = async (ctx, next) => {

	try {
		
		let body = ctx.request.body

		//todo:meta,visit
		body = _.pick(body, [
			'title'
			,'slug'
			,'tags'
			,'desc'
			,'content'
			,'style'
			,'script'
			,'featuredFile'
			,'files'
			,'published'
		])

		if(body.published === 'true') body.published = true
		else if(body.published === 'false') body.published = false

		let user = ctx.session.user || {}
		user = _.pick(user, ['_id', 'name', 'email'])
		body.createBy = user

		if(body.cats === []) delete body.cats

		let validateResult = await validater(body, docs)

		if(validateResult.errCount) {
			return ctx.body = {
				code: 1
				,errFields: validateResult.errFields
				,errs: validateResult.errs
			}
		}

		if(body.slug === validateResult.result.slug) {

			let indb = await db.collection('post').findOne({
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

		//parse css
		var css = await styleParser(body.style)
		body.css = css

		//parse jade
		var local = Object.assign({}, ctx.local, {
			post: body
		})

		var html = await jadeParser(body.content, local)
		body.html = htmlFilter(html)

		//todo:check cat
		//skip, do not check
		var insd = await db.collection('post').insertOne(body)

		await afterChangeActions({
			_id: body._id
			,action: 'add'
			,local: ctx.local
		})

		var obj = _.pick(body, [
			'_id'
			,'id'
			,'cats'
			,'slug'
			,'title'
			,'desc'
			,'tags'
			,'featuredFile'
			,'files'
			,'published'
		])

		ctx.body = {
			code: 0
			,result: obj
			,res: insd
		}

	} catch(e) {

		err(e, 'add post failed')

		return ctx.body = {
			code: 1
			,errorMsg: 'add post failed:' + e
		}

	}

}

exports.del = async (ctx, next) => {

	try {

		let path = ctx.path
		let isSelf = ctx.path.indexOf('self') > -1
		let user = ctx.session.user || {}
		
		let body = ctx.request.body
		let _id = body._id
		let opt = {
			_id: _id
		}

		if(isSelf) opt['createBy._id'] = user._id

		let indb = db.collection('post').findOne(opt)

		if(!indb) {
			return ctx.body = {
				code: 1
				,errorMsg: 'post not exists'
			}
		}

		let res = await db.collection('post').deleteOne(opt)

		await afterChangeActions({
			_id: opt._id
			,action: 'del'
		})

		ctx.body = {
			code: 0
			,result: res
		}

	} catch(e) {

		err(e, 'del post failed')

		return ctx.body = {
			code: 1
			,errorMsg: 'del post failed:' + e
		}

	}
}

exports.get = async (ctx, next) => {

	try {

		let sess = ctx.session
		let user = sess.user || {}

		let body = ctx.request.body
		let _id = body._id
		let title = body.title
		let page = parseInt(body.page, 10) || 1
		let pageSize = parseInt(body.pageSize, 10) || local.pageSize
		let order = body.order === 'DESC'?-1:1
		let orderBy = body.orderBy
		let fields = body.fields
		let catId = body.catId
		let published = body.published
		if(published === 'true') published = true
		else if(published === 'false') published = false

		let opt1 = {}

		if(_id) opt1._id = _id
		if(title) opt1.title = new RegExp(escRegStr(title))
		if(catId) opt1['cats._id'] = catId
		if(_.isBoolean(published)) opt1.published = published

		let opt2 = {
			skip: (page - 1) * pageSize
			,limit: pageSize
		}

		if(fields) opt2.fields = fields

		let sort = {
			createTime: -1
		}
		if(orderBy) sort[orderBy] = order

		let total = await db.collection('post').count(opt1)
		let res = await db.collection('post').find(opt1, opt2)
		.sort(sort)
		.toArray()

		ctx.body = {
			code: 0
			,result: res
			,total: total
		}

	} catch(e) {

		err(e, 'get post failed')

		return ctx.body = {
			code: 1
			,errorMsg: 'get post failed:' + e
		}

	}

}

exports.update = async (ctx, next) => {
	
	try {

		let path = ctx.path
		let isSelf = ctx.path.indexOf('self') > -1
		let user = ctx.session.user || {}
		let body = ctx.request.body
		let _id = body._id
		let opt = {
			_id: _id
		}

		if(body.published === 'true') body.published = true
		else if(body.published === 'false') body.published = false

		if(isSelf) opt['createBy._id'] = user._id
			
		let ind = await db.collection('post').findOne(opt)

		if(!ind) {
			return ctx.body = {
				code: 0
				,errorMsg: 'post not exists'
			}
		}

		let keys = [
			'title'
			,'desc'
			,'tags'
			,'slug'
			,'content'
			,'style'
			,'script'
			,'cats'
			,'meta'
			,'featuredFile'
			,'files'
			,'published'
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

		body = validateResult.result

		//parse css
		if(_.isString(body.style) && body.style !== ind.style) {
			var css = await styleParser(body.style)
			body.css = css
		}

		//parse html

		if(_.isString(body.content) && body.content !== ind.content) {
			var local = Object.assign({}, ctx.local, {
				post: Object.assign(ind, body)
			})
			var html = await jadeParser(body.content)
			body.html = htmlFilter(html)
		}

		if(body.slug && body.slug !== ind.slug) {

			let indb = await db.collection('post').findOne({
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

		body.updateTime = new Date()

		var insd = await db.collection('post').updateOne({
			_id: _id
		}, { $set: body })

		await afterChangeActions({
			_id: _id
			,action: 'update'
			,local: ctx.local
		})

		ctx.body = {
			code: 0
			,result: insd
		}

	} catch(e) {

		err(e, 'update post failed')

		return ctx.body = {
			code: 1
			,errorMsg: 'update post failed:' + e
		}

	}
}

exports.validateStyle = async (ctx, next) => {
	
	try {

		let style = ctx.request.body.style
		var css = await styleParser(style)

		ctx.body = {
			result: true
			,code: 0
		}

	} catch(e) {

		err(e, 'validate stylus failed')

		return ctx.body = {
			code: 1
			,errorMsg: 'validate stylus failed:' + e.stack || e
		}

	}
}

exports.previewHtml = async (ctx, next) => {
	
	try {

		let body = ctx.request.body

		//parse jade
		var local = Object.assign({}, ctx.local, {
			post: body
		})

		var html = await jadeParser(body.content, local)
		html = htmlFilter(html)

		ctx.body = {
			result: html
			,code: 0
		}

	} catch(e) {

		err(e, 'previewHtml failed')

		return ctx.body = {
			code: 1
			,errorMsg: 'preview failed:' + e.stack || e
		}

	}
}

exports.validateScript = async (ctx, next) => {
	
	try {

		ctx.body = {
			result: 'validateScript service not ready'
			,code: 0
		}

	} catch(e) {

		err(e, 'validateScript failed')

		return ctx.body = {
			code: 1
			,errorMsg: 'validateScript failed:' + e.stack || e
		}

	}
}

tools.extendLib(__filename, exports, plugins)