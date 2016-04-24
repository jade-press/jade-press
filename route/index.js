
'use strict'

let
_ = require('lodash')
,setting = require('../app/setting')
,local = require('../app/local')
,tools = require('../lib/tools')
,ua = require('../lib/ua')
,Router = require('koa-router')
,apis = require('../doc/api').accesses
,publicApis = require('../doc/public-page').apis
,path = require('path')

exports.init = function(app) {
	
	let route = new Router()
	apis = apis.concat(publicApis)
	for(let i = 0, len = apis.length;i < len;i ++) {
		let api = apis[i]
		let p = path.resolve(__dirname, '../', api.lib)
		route[api.method](api.url, require(p)[api.func])
	}

	route.use(tools.init)
	route.use(ua.ua)
	route.use(tools.loginCheck)
	route.use(tools.authCheck)
	route.use(tools.setNoCache)

	app
	.use(route.routes())
	.use(route.allowedMethods())
	
	//404
	app.use(function* (next) {
		this.status =  404
		this.render('views/page/404', this.local)
	})

	//end
}