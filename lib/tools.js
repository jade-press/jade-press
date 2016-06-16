/*
tools
*/

'use strict'

const crypto = require('crypto')
let local = require('../app/local')
let setting = require('../app/setting')
let stylus = require('stylus')
let jade = require('jade')
let _ = require('lodash')
let path = require('path')
const fs = require('fs')

exports.loadTheme404500 = function() {

	let themeViewPath = setting.theme.path?
										setting.theme.path + '/views/'
										:
										process.cwd() + '/node_modules/' + setting.theme + '/views/'

	//404	
	try {
		let p404 = themeViewPath + '404.jade'
		let res = fs.accessSync(p404)
		setting.path404 = p404
		
	} catch(e) {
		exports.debug('theme no 404.jade')
		setting.path404 = path.resolve(__dirname, '../views/page/404.jade')
	}

	//500	
	try {
		let p500 = themeViewPath + '500.jade'
		let res = fs.accessSync(p500)
		setting.path500 = p500
		
	} catch(e) {
		exports.debug('theme no 500.jade')
		setting.path500 = path.resolve(__dirname, '../views/page/500.jade')
	}


}

exports.buildThemeRes = function(host) {
	return host + '/' + (setting.theme.staticAlias || setting.theme.name || setting.theme)
}

exports.extendLib = function(filename, mod, plugins) {
	
	let arr1 = filename.split(path.sep)
	let len1 = arr1.length
	let fid = arr1[len1 - 2] + '/' + arr1[len1 - 1]

	if(plugins[fid]) {
		_.each(plugins[fid], function(func) {
			Object.assign(mod, func(mod.publicExports))
		})	
	}

}

exports.replace = require('../modules/create-url').replace

exports.createUrl = require('../modules/create-url').createUrl

exports.parseStylus = function(str) {
	return new Promise(function(resolve, reject) {
		stylus.render(str, function(err, css){
			if(err) reject(err)
			else resolve(css)
		})
	})
}

exports.parseJade = function(str, locals, options) {
	return new Promise(function(resolve, reject) {
		var fn = jade.compile(str, options || {})
		var html = fn(locals)
		resolve(html)
	})
}

exports.decipher = function(_encrypted) {

	const decipher = crypto.createDecipher('md5', setting.secret)
	let encrypted = _encrypted
	var decrypted = decipher.update(encrypted, 'hex', 'utf8')
	decrypted += decipher.final('utf8')
	
	return decrypted

}

exports.debugLog = function(env) {
	return function() {
		if(local.env === env) console.log.apply(null, ['' + new Date()].concat(Array.from(arguments)))
	}
}

exports.debug = exports.debugLog('dev')

exports.log = function(...args) {
	console.log('' + new Date(), ...args)
}

exports.err = function(...args) {
	console.error('' + new Date(), ...args.map(function(v) {
		return v.stack || v
	}))
}

exports.warn = function(...args) {
	console.warn('' + new Date(), ...args.map(function(v) {
		return v.stack || v
	}))
}

exports.setNoCache = async (ctx, next) => {
	if( !/^\/admin\//.test(ctx.path) ) ctx.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')
	await next
}

exports.loginCheck = async (ctx, next) => {

	let sess = ctx.session
	,path = ctx.path
	,redirect = '/'

	if(
		!sess.user && 
		/^\/su\//.test(path)
	) {
		sess.redirect = path
		return ctx.redirect(redirect)
	}

	else if(!sess.user && /^\/api\//.test(ctx.path)) return ctx.body = {
		code: 1
		,errorMsg: 'please login'
	}

	await next()

}

exports.authCheck = async (ctx, next) => {

	var path = ctx.path

	if(
		!/^\/su\//.test(path) || 
		!/^\/api\//.test(path)
	) return await next

	var sess = ctx.session
	,user = sess.user || {}

	var authed = exports.checkPath(path, user.group)

	if(!authed && /^\/su\//.test(path)) return ctx.redirect('/')
	else if(!authed && /^\/api\//.test(path)) return ctx.body = {
		code: 1
		,errorMsg: 'not authorized'
	}

	await next()

}

exports.checkPath = function (path, group) {
	return group.access.indexOf(path) > -1
}

exports.init = async (ctx, next) => {


	let arr = ctx.href.split('/')
	,host = arr[0] + '//' + arr[2]
	,sess = ctx.session

	sess.state = sess.state || ctx.sessionId

	ctx.local = Object.assign({}, local, {
		host: host
		,state: sess.state
		,href: ctx.href
		,logined: false
		,path: ctx.path
	})

	if(!local.cdn) ctx.local.cdn = host
	if(!local.fileServer) ctx.local.fileServer = host
	

	return await next()
}

exports.accessLog = async (ctx, next) => {

	let sess = ctx.session || {}

	let user = sess.user || {
		name: 'anonymous'
		,email: 'anonymous'
	}

	if(setting.logOn) console.log(
		'' + new Date()
		,ctx.method
		,ctx.href
		,ctx.headers['x-forwarded-for'] || ctx.ip || ctx.ips
		,user.name 
		,user.email
		,JSON.stringify(ctx.request.body)
	)

	return await next()
}

exports.createQueryObj = function(params, pick) {
	var replace = _.pick(exports.replace, pick)
	var res = false
	_.each(params, function(value, key) {
		var k = ':' + key
		if(replace[k]) {
			if(!res) res = {}
			res[key] = value
			return false
		}
	})
	return res
}


