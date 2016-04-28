
/*!
 * main entrance
**/

'use strict'

exports.init = function* () {

	let
	tools = require('../lib/tools')
	,log = tools.log
	,err = tools.err
	,setting = require('../app/setting')
	,local = require('../app/local')
	,dbRef = require('../lib/db')
	,plugins = require('../lib/plugins')
	,mail = require('../lib/mail')

	//load db
	yield dbRef.init()

	var db = dbRef.db

	var hasMeta = yield db.collection('meta').findOne()

	setting.mailServiceReady = yield mail.checkMailService()

	if(!hasMeta) yield require('../lib/init').init()

	local.themeVersion = setting.plugins[setting.theme] || '*'

	plugins.loadPlugins()

	let app = require('./index.js').init()

	return Promise.resolve(app)

}
