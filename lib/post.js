
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

publics.getPosts = function* (_option) {

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
		let res = yield db.collection('post').findOneAndUpdate(sea1, {
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

	let posts = yield db.collection('post').find(sea1, sea2)
	.sort(sortOption)
	.limit(pageSize)
	.skip((page - 1) * pageSize)
	.toArray()
	let total = yield db.collection('post').count(sea1)

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

function* afterChangeActions (option) {

	for(let i = 0, len = exports.afterChangeActions.length;i < len;i ++) {
		yield exports.afterChangeActions[i](option)
	}
	return Promise.resolve()

}

exports.add = function* (next) {

	try {
		
		let body = this.request.body

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

		let user = this.session.user || {}
		user = _.pick(user, ['_id', 'name', 'email'])
		body.createBy = user

		if(body.cats === []) delete body.cats

		let validateResult = yield validater(body, docs)

		if(validateResult.errCount) {
			return this.body = {
				code: 1
				,errFields: validateResult.errFields
				,errs: validateResult.errs
			}
		}

		if(body.slug === validateResult.result.slug) {

			let indb = yield db.collection('post').findOne({
				slug: body.slug
			})

			if(indb) {
				return this.body = {
					code: 1
					,errorMsg: 'slug already used'
					,errorField: 'slug'
				}
			}

		}

		body = validateResult.result

		//parse css
		var css = yield styleParser(body.style)
		body.css = css

		//parse jade
		var local = Object.assign({}, this.local, {
			post: body
		})

		var html = yield jadeParser(body.content, local)
		body.html = htmlFilter(html)

		//todo:check cat
		//skip, do not check
		var insd = yield db.collection('post').insertOne(body)

		yield afterChangeActions({
			_id: body._id
			,action: 'add'
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

		this.body = {
			code: 0
			,result: obj
			,res: insd
		}

	} catch(e) {

		err(e, 'add post failed')

		return this.body = {
			code: 1
			,errorMsg: 'add post failed:' + e
		}

	}

}

exports.del = function* (next) {

	try {

		let path = this.path
		let isSelf = this.path.indexOf('self') > -1
		let user = this.session.user || {}
		
		let body = this.request.body
		let _id = body._id
		let opt = {
			_id: _id
		}

		if(isSelf) opt['createBy._id'] = user._id

		let indb = db.collection('post').findOne(opt)

		if(!indb) {
			return this.body = {
				code: 1
				,errorMsg: 'post not exists'
			}
		}

		let res = yield db.collection('post').deleteOne(opt)

		yield afterChangeActions({
			_id: opt._id
			,action: 'del'
		})

		this.body = {
			code: 0
			,result: res
		}

	} catch(e) {

		err(e, 'del post failed')

		return this.body = {
			code: 1
			,errorMsg: 'del post failed:' + e
		}

	}
}

exports.get = function* (next) {

	try {

		let sess = this.session
		let user = sess.user || {}

		let body = this.request.body
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

		let total = yield db.collection('post').count(opt1)
		let res = yield db.collection('post').find(opt1, opt2)
		.sort(sort)
		.toArray()

		this.body = {
			code: 0
			,result: res
			,total: total
		}

	} catch(e) {

		err(e, 'get post failed')

		return this.body = {
			code: 1
			,errorMsg: 'get post failed:' + e
		}

	}

}

exports.update = function* (next) {
	
	try {

		let path = this.path
		let isSelf = this.path.indexOf('self') > -1
		let user = this.session.user || {}
		let body = this.request.body
		let _id = body._id
		let opt = {
			_id: _id
		}

		if(body.published === 'true') body.published = true
		else if(body.published === 'false') body.published = false

		if(isSelf) opt['createBy._id'] = user._id
			
		let ind = yield db.collection('post').findOne(opt)

		if(!ind) {
			return this.body = {
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

		let validateResult = yield validater(body, cdoc)

		if(validateResult.errCount) {
			this.body = {
				code: 1
				,errFields: validateResult.errFields
				,errs: validateResult.errs
			}
		}

		body = validateResult.result

		//parse css
		if(_.isString(body.style) && body.style !== ind.style) {
			var css = yield styleParser(body.style)
			body.css = css
		}

		//parse html

		if(_.isString(body.content) && body.content !== ind.content) {
			var local = Object.assign({}, this.local, {
				post: Object.assign(ind, body)
			})
			var html = yield jadeParser(body.content)
			body.html = htmlFilter(html)
		}

		if(body.slug && body.slug !== ind.slug) {

			let indb = yield db.collection('post').findOne({
				slug: body.slug
			})

			if(indb) {
				return this.body = {
					code: 1
					,errorMsg: 'slug already used'
					,errorField: 'slug'
				}
			}

		}

		body.updateTime = new Date()

		var insd = yield db.collection('post').updateOne({
			_id: _id
		}, { $set: body })

		yield afterChangeActions({
			_id: _id
			,action: 'update'
		})

		this.body = {
			code: 0
			,result: insd
		}

	} catch(e) {

		err(e, 'update post failed')

		return this.body = {
			code: 1
			,errorMsg: 'update post failed:' + e
		}

	}
}

exports.validateStyle = function* (next) {
	
	try {

		let style = this.request.body.style
		var css = yield styleParser(style)

		this.body = {
			result: true
			,code: 0
		}

	} catch(e) {

		err(e, 'validate stylus failed')

		return this.body = {
			code: 1
			,errorMsg: 'validate stylus failed:' + e.stack || e
		}

	}
}

exports.previewHtml = function* (next) {
	
	try {

		let body = this.request.body

		//parse jade
		var local = Object.assign({}, this.local, {
			post: body
		})

		var html = yield jadeParser(body.content, local)
		html = htmlFilter(html)

		this.body = {
			result: html
			,code: 0
		}

	} catch(e) {

		err(e, 'previewHtml failed')

		return this.body = {
			code: 1
			,errorMsg: 'preview failed:' + e.stack || e
		}

	}
}

exports.validateScript = function* (next) {
	
	try {

		this.body = {
			result: 'validateScript service not ready'
			,code: 0
		}

	} catch(e) {

		err(e, 'validateScript failed')

		return this.body = {
			code: 1
			,errorMsg: 'validateScript failed:' + e.stack || e
		}

	}
}

tools.extendLib(__filename, exports, plugins)