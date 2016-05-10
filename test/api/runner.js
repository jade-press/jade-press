
'use strict'

let _ = require('lodash')
,co = require('co')

,MongoClient = require('mongodb').MongoClient
,pack = require('../../package.json')
,port = 9965
,test = require('./tester')
,path = require('path')
,config = require('../../config-sample')

config.setting.mongoStoreOptions.url = 'mongodb://127.0.0.1:27017/test'
config.setting.dbLink = 'mongodb://127.0.0.1:27017/test'
config.local.port = port

let init = require('../../app/start').init

co(init(config))
.then(function(app) {

	app.listen(port, config.setting.listenAddress, function() {
		console.log('' + new Date(), config.local.siteName, 'runs on port', port)
		testRun()
	})
	
}, function(err) {
	console.error(err.stack || err)
})


function testRun() {

	console.log('run api tests jade-press@' + pack.version)
	co(testPromise())
	.then(function(app) {

		console.log('done')
		
	}, function(err) {
		console.error(err.stack || err)
	})

}

function* testPromise() {

	let db = yield MongoClient.connect(config.setting.dbLink)
	let host = 'http://127.0.0.1:' + port

	let loginTests = require('./specs/login')(host)

	yield test(loginTests)

	return Promise.resolve()
}