/*!
 * main entrance
**/

'use strict'

// // set babel 
// require('babel-core/register')({
//   presets: ['node6', 'stage-3']
// })

let init = require('./app/start').init
,co = require('co')
,config = require('./config')
,setting = config.setting
,local = config.local

;(async () => {

	try {

		var app = await init(config)

		app.listen(local.port, setting.listenAddress, function() {
			console.log('' + new Date(), local.siteName, 'runs on port', local.port)
		})

	} catch(err) {
		console.error(err.stack || err)
	}

})()
