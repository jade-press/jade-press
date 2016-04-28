
/**
 * Module dependencies.
 */

'use strict'

exports.init = function() {


	let
	koa = require('koa')
	,compress = require('koa-compress')
	,serve = require('koa-static')
	,conditional = require('koa-conditional-get')
	,etag = require('koa-etag')
	,Jade = require('koa-jade')
	,bodyParser = require('koa-bodyparser')
	,mount = require('koa-mount')
	,router = require('koa-router')
	,MongoStore = require('koa-generic-session-mongo')
	,session = require('koa-generic-session')
	,path = require('path')
	,fs = require('fs')

	//user local
	,_ = require('lodash')
	,setting = require('./setting')
	,local = require('./local')
	,port = local.port
	,routes = require('../route/')
	,oneYear = 1000 * 60 * 60 * 24 * 365

	// all environments
	,app = koa()

	//middleware
	app.keys = [setting.secret]

	app.use(conditional())
	app.use(etag())

	//compression
	app.use(compress({
		threshold: 2048
		,flush: require('zlib').Z_SYNC_FLUSH
	}))

	//static files
	app.use(serve( path.resolve(__dirname, '../public'), {
		maxAge: oneYear
	}))

	//static files bower_components
	app.use( serve( process.cwd() + '/bower_components' ), {
		maxAge: oneYear
	})

	//load theme res
	let themeResPath = process.cwd() + '/node_modules/' + setting.theme + '/public'
	try {
		let themeRes = fs.accessSync(themeResPath)
		let op = serve( path.resolve(themeResPath), {
			maxAge: oneYear
		})
		app.use(mount('/' + setting.theme, op))
	} catch(e) {
		console.warn(setting.theme, 'has no theme res')
	}

	// parse application/x-www-form-urlencoded
	app.use(bodyParser())

	//view engine
	var jade = new Jade({
		viewPath: path.resolve(__dirname, '..')
		,debug: false
		,pretty: false
		,compileDebug: local.env !== 'production'
		,locals: { _:_ }
		//basedir: 'path/for/jade/extends',
		,noCache: local.env !== 'production'
	})

	app.use(jade.middleware)

	//session
	app.use(session({
		key: setting.sessionName
		,rolling: true
		,store: new MongoStore(setting.mongoStoreOptions)
	}))

	//routes
	routes.init(app)

	
	if( process.cwd() === path.resolve(__dirname, '..') ) app.listen(port, function() {
		console.log('' + new Date(), local.siteName, 'runs on port', port)
	})

	//if not use as module return app
	else return app
}


