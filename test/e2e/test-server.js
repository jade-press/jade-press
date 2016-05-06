'use strict'

let config0 = require('./config')
,port = config0.port
,pack = require('../../package.json')
let path = require('path')
let co = require('co')
let config = require('../../node_modules/jade-press/config-sample')

config.setting.mongoStoreOptions.url = 'mongodb://127.0.0.1:27017/test'
config.setting.dbLink = 'mongodb://127.0.0.1:27017/test'
config.local.port = port

let init = require('jade-press').init

co(init(config))
.then(function(app) {

	app.listen(port, config.setting.listenAddress, function() {
		console.log('' + new Date(), config.local.siteName, 'runs on port', port)
	})
	
}, function(err) {
	console.error(err.stack || err)
})