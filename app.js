/*!
 * main entrance
**/

'use strict'

let init = require('./app/start').init
,co = require('co')
,config = require('./config')
,setting = config.setting
,local = config.local

try {

	var app = await init(config)

	app.listen(local.port, setting.listenAddress, function() {
		console.log('' + new Date(), local.siteName, 'runs on port', local.port)
	})

} catch(err) {
	console.error(err.stack || err)
}