
'use strict'

const
_ = require('lodash')
,publics = {}
,setting = require('../app/setting')
,local = require('../app/local')
,tools = publics.tools = require('../lib/tools')
,ua = require('../lib/ua')
,Router = require('koa-router')
,publicApis = publics.publicApis = require('../doc/public-page').apis
,path = require('path')
,plugins = require('../lib/plugins').plugins

let apis = publics.apis = require('../doc/api').accesses

let route = new Router()

exports.middlewares = publics.middlewares = [

	tools.init
	,tools.accessLog
	,ua.ua
	,tools.loginCheck
	,tools.authCheck

]

exports.publicExports = publics

tools.extendLib(__filename, exports, plugins)

apis = apis.concat(publicApis)

for(let i = 0, len = apis.length;i < len;i ++) {

	let api = apis[i]

	let p = /^\//.test(api.lib)?
					api.lib:
					path.resolve(__dirname, '../', api.lib)

	route[api.method](api.url, require(p)[api.func])

}

exports.middlewares.push( route.routes() )
exports.middlewares.push( route.allowedMethods() )
exports.middlewares.push( function* (next) {
	this.status =  404
	this.render(setting.path404, this.local)
} )