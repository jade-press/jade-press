
'use strict'

/**
 * catogory
 */

let publics = {}

let _ = publics._ = require('lodash')
,local = publics.local = require('../app/local')
,setting = publics.setting = require('../app/setting')
,tools = publics.tools = require('../lib/tools')
,log = publics.log = tools.log
,err = publics.err = tools.err
,db = publics.db = require('../lib/db').db
,path = require('path')
,baseThemeViewPath = publics.baseThemeViewPath = setting.theme.path?setting.theme.path + '/views/':
			process.cwd() + '/node_modules/' + setting.theme + '/views/'
,Pager = publics.Pager = new require('zpager')
,pager = publics.pager = new Pager()
,getCats = publics.getCats = require('../lib/cat').publics.getCats
,getPosts = publics.getPosts = require('../lib/post').publics.getPosts
,fs = require('fs')
,plugins = require('../lib/plugins').plugins
,buildThemeRes = tools.buildThemeRes

exports.publicExports = publics

var basicPostFields = {
	id: 1
	,desc: 1
	,cats: 1
	,title: 1
	,tags: 1
	,slug: 1
	,files: 1
	,featuredFile: 1
	,createBy: 1
	,createTime: 1
	,html: 1
}

exports.home = async (ctx, next) => {

	try {

		let query = ctx.query
		let page = query.page || 1
		page = parseInt(page, 10) || 1
		let pageSize = query.pageSize || local.pageSize
		pageSize = parseInt(pageSize, 10) || local.pageSize

		let user = ctx.session.user
		ctx.local.user = user

		let obj = yield getPosts({
			page: page
			,pageSize: pageSize
			,fields: basicPostFields
		})

		let pagerHtml = pager.render({
			page: page
			,pageSize: pageSize
			,total: obj.total
			,url: ctx.path
		})

		var objc = yield getCats()

		_.extend(ctx.local, {
			pager: pagerHtml
			,pageSize: pageSize
			,total: obj.total
			,posts: obj.posts
			,themeRes: buildThemeRes(ctx.local.host)
			,publicRoute: setting.publicRoute
			,createUrl: tools.createUrl
			,cats: objc.cats
		})

		ctx.render(baseThemeViewPath + 'home', ctx.local)

	} catch(e) {

		err('failed render home page', e)
		ctx.status = 500
		ctx.local.error = e
		ctx.render(setting.path500, ctx.local)

	}

}

exports.post = async (ctx, next) => {

	try {

		let params = ctx.params
		let sea = tools.createQueryObj(params, [':_id', ':id', ':slug'])
		if(!sea) return yield next

		let user = ctx.session.user
		ctx.local.user = user
		sea.fields = Object.assign({}, basicPostFields, {
			css: 1
			,script: 1
		})
		let post = yield getPosts(sea)

		if(!post) return yield next

		var obj = yield getCats()

		_.extend(ctx.local, {
			post: post
			,publicRoute: setting.publicRoute
			,createUrl:tools.createUrl
			,themeRes: buildThemeRes(ctx.local.host)
			,cats: obj.cats
		})
		
		ctx.render(baseThemeViewPath + '/post', ctx.local)

	} catch(e) {

		err('failed render single post page', e)
		ctx.status = 500
		ctx.local.error = e
		ctx.render(setting.path500, ctx.local)

	}

}

exports.cat = async (ctx, next) => {

	try {

		let params = ctx.params
		let query = ctx.query
		let sea = tools.createQueryObj(params, [':_id', ':id', ':slug'])
		if(!sea) return yield next

		let catObj = yield getCats(sea)
		if(!catObj) return yield next

		let page = query.page || 1
		page = parseInt(page, 10) || 1
		let pageSize = query.pageSize || local.pageSize
		pageSize = parseInt(pageSize, 10) || local.pageSize

		let user = ctx.session.user
		ctx.local.user = user

		let obj = yield getPosts({
			page: page
			,pageSize: pageSize
			,cat_id: catObj._id
			,fields: basicPostFields
		})

		var objc = yield getCats()

		let pagerHtml = pager.render({
			page: page
			,pageSize: pageSize
			,total: obj.total
			,url: ctx.path
		})

		_.extend(ctx.local, {
			posts: obj.posts
			,page: page
			,pageSize: pageSize
			,total: obj.total
			,cat: catObj
			,pager: pagerHtml
			,themeRes: buildThemeRes(ctx.local.host)
			,publicRoute: setting.publicRoute
			,createUrl: tools.createUrl
			,cats: objc.cats
		})

		ctx.render(baseThemeViewPath + 'category', ctx.local)

	} catch(e) {

		err('failed render cat page', e)
		ctx.status = 500
		ctx.local.error = e
		ctx.render(setting.path500, ctx.local)

	}

}

exports.search = async (ctx, next) => {

	try {

		let query = ctx.query

		let page = query.page || 1
		page = parseInt(page, 10) || 1
		let pageSize = query.pageSize || local.pageSize
		pageSize = parseInt(pageSize, 10) || local.pageSize

		let user = ctx.session.user
		ctx.local.user = user

		let obj = yield getPosts({
			page: page
			,pageSize: pageSize
			,title: query.title
			,fields: basicPostFields
		})

		var objc = yield getCats()

		let pagerHtml = pager.render({
			page: page
			,pageSize: pageSize
			,total: obj.total
			,url: ctx.path
		})

		_.extend(ctx.local, {
			posts: obj.posts
			,page: page
			,pageSize: pageSize
			,total: obj.total
			,pager: pagerHtml
			,themeRes: buildThemeRes(ctx.local.host)
			,publicRoute: setting.publicRoute
			,createUrl: tools.createUrl
			,cats: objc.cats
			,keyword: query.title
		})

		ctx.render(baseThemeViewPath + 'search', ctx.local)

	} catch(e) {

		err('failed render search page', ctx.href, e)
		ctx.status = 500
		ctx.local.error = e
		ctx.render(setting.path500, ctx.local)

	}

}

tools.extendLib(__filename, exports, plugins)
