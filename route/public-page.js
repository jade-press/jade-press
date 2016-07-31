
'use strict'

/**
 * catogory
 */

const
publics = {}

const _ = publics._ = require('lodash')
,local  = require('../app/local')
,setting = require('../app/setting')
,tools = require('../lib/tools')
,log = tools.log
,err = tools.err
,db = require('../lib/db').db
,path = require('path')
,baseThemeViewPath = publics.baseThemeViewPath = setting.theme.path?setting.theme.path + '/views/':
			process.cwd() + '/node_modules/' + setting.theme + '/views/'
,Pager = new require('zpager')
,pager = new Pager()
,getCats = require('../lib/cat').publics.getCats
,getPosts = require('../lib/post').publics.getPosts
,fs = require('fs')
,plugins = require('../lib/plugins').plugins
,buildThemeRes = tools.buildThemeRes

exports.publicExports = publics

let basicPostFields = {
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

exports.home = function* (next) {

	try {

		let query = this.query
		let page = query.page || 1
		page = parseInt(page, 10) || 1
		let pageSize = query.pageSize || local.pageSize
		pageSize = parseInt(pageSize, 10) || local.pageSize

		let user = this.session.user
		this.local.user = user

		let obj = yield getPosts({
			page: page
			,pageSize: pageSize
			,fields: basicPostFields
		})

		let pagerHtml = pager.render({
			page: page
			,pageSize: pageSize
			,total: obj.total
			,url: this.path
		})

		let objc = yield getCats()

		_.extend(this.local, {
			pager: pagerHtml
			,pageSize: pageSize
			,total: obj.total
			,posts: obj.posts
			,themeRes: buildThemeRes(this.local.host)
			,publicRoute: setting.publicRoute
			,createUrl: tools.createUrl
			,cats: objc.cats
		})

		this.render(baseThemeViewPath + 'home', this.local)

	} catch(e) {

		err('failed render home page', e)
		this.status = 500
		this.local.error = e
		this.render(setting.path500, this.local)

	}

}

exports.post = function* (next) {

	try {

		let params = this.params
		let sea = tools.createQueryObj(params, [':_id', ':id', ':slug'])
		if(!sea) return yield next

		let user = this.session.user
		this.local.user = user
		sea.fields = Object.assign({}, basicPostFields, {
			css: 1
			,script: 1
		})
		let post = yield getPosts(sea)

		if(!post) return yield next

		let obj = yield getCats()

		_.extend(this.local, {
			post: post
			,publicRoute: setting.publicRoute
			,createUrl:tools.createUrl
			,themeRes: buildThemeRes(this.local.host)
			,cats: obj.cats
		})
		
		this.render(baseThemeViewPath + '/post', this.local)

	} catch(e) {

		err('failed render single post page', e)
		this.status = 500
		this.local.error = e
		this.render(setting.path500, this.local)

	}

}

exports.cat = function* (next) {

	try {

		let params = this.params
		let query = this.query
		let sea = tools.createQueryObj(params, [':_id', ':id', ':slug'])
		if(!sea) return yield next

		let catObj = yield getCats(sea)
		if(!catObj) return yield next

		let page = query.page || 1
		page = parseInt(page, 10) || 1
		let pageSize = query.pageSize || local.pageSize
		pageSize = parseInt(pageSize, 10) || local.pageSize

		let user = this.session.user
		this.local.user = user

		let obj = yield getPosts({
			page: page
			,pageSize: pageSize
			,cat_id: catObj._id
			,fields: basicPostFields
		})

		let objc = yield getCats()

		let pagerHtml = pager.render({
			page: page
			,pageSize: pageSize
			,total: obj.total
			,url: this.path
		})

		_.extend(this.local, {
			posts: obj.posts
			,page: page
			,pageSize: pageSize
			,total: obj.total
			,cat: catObj
			,pager: pagerHtml
			,themeRes: buildThemeRes(this.local.host)
			,publicRoute: setting.publicRoute
			,createUrl: tools.createUrl
			,cats: objc.cats
		})

		this.render(baseThemeViewPath + 'category', this.local)

	} catch(e) {

		err('failed render cat page', e)
		this.status = 500
		this.local.error = e
		this.render(setting.path500, this.local)

	}

}

exports.search = function* (next) {

	try {

		let query = this.query

		let page = query.page || 1
		page = parseInt(page, 10) || 1
		let pageSize = query.pageSize || local.pageSize
		pageSize = parseInt(pageSize, 10) || local.pageSize

		let user = this.session.user
		this.local.user = user

		let obj = yield getPosts({
			page: page
			,pageSize: pageSize
			,title: query.title
			,fields: basicPostFields
		})

		let objc = yield getCats()

		let pagerHtml = pager.render({
			page: page
			,pageSize: pageSize
			,total: obj.total
			,url: this.path
		})

		_.extend(this.local, {
			posts: obj.posts
			,page: page
			,pageSize: pageSize
			,total: obj.total
			,pager: pagerHtml
			,themeRes: buildThemeRes(this.local.host)
			,publicRoute: setting.publicRoute
			,createUrl: tools.createUrl
			,cats: objc.cats
			,keyword: query.title
		})

		this.render(baseThemeViewPath + 'search', this.local)

	} catch(e) {

		err('failed render search page', this.href, e)
		this.status = 500
		this.local.error = e
		this.render(setting.path500, this.local)

	}

}

tools.extendLib(__filename, exports, plugins)
