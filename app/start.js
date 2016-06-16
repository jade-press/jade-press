
/**
 * Module dependencies.
 */

'use strict'

//only support node 6+
const verCompare = require('compare-versions')
if( verCompare(process.versions.node, '6.0.0') < 0 ) throw new Error('jade-press only support nodejs version 6.0.0+, please update your nodejs')


//use bluebird as global promise for better performace
global.Promise = require('bluebird')

//imports
const
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
,_ = require('lodash')
,tools = require('../lib/tools')
,oneYear = 1000 * 60 * 60 * 24 * 365
,plugins = require('../lib/plugins').plugins
,pack = require('../package.json')

exports.publicExports = {
	tools: tools
}

//middlewares
exports.middlewares = [
	
	conditional()

	// parse application/x-www-form-urlencoded
	,bodyParser()

	,etag()

	,compress({
		threshold: 2048
		,flush: require('zlib').Z_SYNC_FLUSH
	})

	,serve( path.resolve(__dirname, '../public'), {
		maxAge: oneYear
	})

	,serve( process.cwd() + '/bower_components', {
		maxAge: oneYear
	})

]


exports.start = function() {


	let

	setting = require('./setting')
	,local = require('./local')
	,port = local.port
	,routes = require('../route/')

	
	// all environments
	,app = koa()
	,middlewares = exports.middlewares

	//middleware
	app.keys = [setting.secret]

	//escape filter
	require(
		'jade'
	).filters.code = function( block ) {
		return block.replace( /</g, '&lt;'   )
	}

	//load theme res
	let themeResPath = setting.theme.path?setting.theme.path + '/public'
											: 
											process.cwd() + '/node_modules/' + setting.theme + '/public'
	try {
		let themeRes = fs.accessSync(themeResPath)
		let op = serve( themeResPath, {
			maxAge: oneYear
		})
		middlewares.push( mount('/' + (setting.theme.staticAlias || setting.theme.name || setting.theme), op) )
	} catch(e) {
		console.warn(setting.theme, 'has no public')
	}

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

	middlewares.push(jade.middleware)

	//session
	middlewares.push(session({
		key: setting.sessionName
		,rolling: true
		,store: new MongoStore(setting.mongoStoreOptions)
	}))

	//routes
	middlewares = middlewares.concat(routes.middlewares)


	//exntend
	exports.publicExports.middlewares = middlewares
	exports.middlewares = middlewares
	tools.extendLib(__filename, exports, plugins)

	//now use middlewares
	for(let i = 0, len = exports.middlewares.length;i < len;i ++) {
		app.use(exports.middlewares[i])
	}
	
	return app
}

exports.init = function* (config) {

	const
	setting = require('./setting')
	,local = require('./local')

	Object.assign(setting, config.setting)
	Object.assign(local, config.local)

	const
	tools = require('../lib/tools')
	,log = tools.log
	,err = tools.err
	,dbRef = require('../lib/db')
	,plugins = require('../lib/plugins')
	,mail = require('../lib/mail')


	//load db
	yield dbRef.init()

	const db = dbRef.db

	var hasMeta = yield db.collection('meta').findOne()

	tools.loadTheme404500()

	setting.mailServiceReady = yield mail.checkMailService()

	if(!hasMeta) yield require('../lib/init').init(config.init)

	yield require('../lib/update').check()

	local.themeVersion = setting.theme.version?setting.theme.version:(setting.plugins[setting.theme] || '*')

	plugins.loadPlugins()

	const app = exports.start()

	log('jade-press', 'version', pack.version)

	return Promise.resolve(app)

}

