/*!
 * main entrance
**/

var
tools = require('./lib/tools')
,log = tools.log
,err = tools.err
,setting = require('./app/setting')
,local = require('./app/local')
,co = require('co')
,dbRef = require('./lib/db')
,plugins = require('./lib/plugins')
,mail = require('./lib/mail')

function* init() {

	//load db
	yield dbRef.init()

	var db = dbRef.db

	var hasMeta = yield db.collection('meta').findOne()

	setting.mailServiceReady = yield mail.checkMailService()

	if(!hasMeta) yield require('./lib/init').init()

	local.themeVersion = require('./package.json').dependencies[setting.theme] || '*'

	plugins.loadPlugins()

	return Promise.resolve()
	//end
}

function ok() {

	try {
		require('./app/index.js')
	} catch(e) {
		err('fail1', e, 'start', local.siteName, 'server fail')
		console.error(e.stack)
	}
	
}

function notOk(e) {
	err('fail2', e, 'start', local.siteName)
}

co(init())
.then(ok, notOk)