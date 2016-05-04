
'use strict'

let chai = require('chai')
let chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
let killProcessByPort = require('./lib/kill-process-by-port').kill
,visit = require('./lib/visit-page')
,co = require('co')
,pack = require('../package.json')
,path = require('path')
,port = 9868
,wait = require('./lib/wait-for-server')

describe(pack.name, function() {

	this.timeout(20000)
	
	// after(function() {
	// 	co(killProcessByPort(port))
	// })

	it('run by default config', function(done) {
		
		var config = require('../config-sample')

		config.setting.mongoStoreOptions.url = 'mongodb://127.0.0.1:27017/test'
		config.setting.dbLink = 'mongodb://127.0.0.1:27017/test'
		config.local.port = port

		let init = require('../app/start').init

		co(init(config))
		.then(function(app) {
			chai.should()
			app.should.have.property('listen')
			app.listen(port, config.setting.listenAddress, function() {
				console.log('' + new Date(), config.local.siteName, 'runs on port', port)
				app.should.have.property('listen')
				done()
			})
			
		}, function(err) {
			console.error(err.stack || err)
		})

	})


	
})
