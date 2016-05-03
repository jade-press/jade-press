
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
,getCats = publics.getCats = require('../lib/cat').public.getCats
,getPosts = publics.getPosts = require('../lib/post').public.getPosts
,fs = require('fs')
,plugins = require('../lib/plugins').plugins
,buildThemeRes = tools.buildThemeRes

exports.publicExports = publics

exports.home = function* (next) {

	try {

		let query = this.query
		let page = query.page || 1
		page = parseInt(page, 10) || 1
		let pageSize = query.pageSize || setting.pageSize
		pageSize = parseInt(pageSize, 10) || setting.pageSize

		let user = this.session.user
		this.local.user = user

		let obj = yield getPosts({
			page: page
			,pageSize: pageSize
		})

		let pagerHtml = pager.render({
			page: page
			,pageSize: pageSize
			,total: obj.total
			,url: this.path
		})

		var objc = yield getCats()

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

		let post = yield getPosts(sea)

		if(!post) return yield next

		var obj = yield getCats()

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
		let pageSize = query.pageSize || setting.pageSize
		pageSize = parseInt(pageSize, 10) || setting.pageSize

		let user = this.session.user
		this.local.user = user

		let obj = yield getPosts({
			page: page
			,pageSize: pageSize
			,catId: catObj._id
		})

		var objc = yield getCats()

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
		let pageSize = query.pageSize || setting.pageSize
		pageSize = parseInt(pageSize, 10) || setting.pageSize

		let user = this.session.user
		this.local.user = user

		let obj = yield getPosts({
			page: page
			,pageSize: pageSize
			,title: query.title
		})

		var objc = yield getCats()

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
		})

		this.render(baseThemeViewPath + 'category', this.local)

	} catch(e) {

		err('failed render cat page', e)
		this.status = 500
		this.local.error = e
		this.render(setting.path500, this.local)

	}

}

tools.extendLib(__filename, exports, plugins)
