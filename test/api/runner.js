
'use strict'

let _ = require('lodash')
,co = require('co')
,MongoClient = require('mongodb').MongoClient
,pack = require('../../package.json')
,port = 9965
,path = require('path')
,config = require('../../config-sample')
,chai = require('chai')
,expect = chai.expect
,host = 'http://127.0.0.1:' + port
,request = require('request')
,qr = function(args) {
	return new Promise(function(resolve, reject) {
		request(args, function(err, response, body) {
			if(err) reject(err)
			else resolve({
				response: response
				,body: body
			})
		})
	})

}

config.setting.mongoStoreOptions.url = 'mongodb://127.0.0.1:27017/test'
config.setting.dbLink = 'mongodb://127.0.0.1:27017/test'
config.local.port = port

let init = require('../../app/start').init

describe(pack.name, function() {


	step('start server', function(done) {

		co(init(config))
		.then(function(app) {

			app.listen(port, config.setting.listenAddress, function() {
				console.log('' + new Date(), config.local.siteName, 'runs on port', port)
				done()
				
			})
			
		})

	})

	let loginTests = require('./specs/login')(host)
	let tests = loginTests.tests
	testRun(tests)


})


function testRun(tests) {

	for(let i = 0, len = tests.length;i < len;i ++) {
		let test = tests[i]
		step(test.title, function(done) {
			qr(test.options)
			.then(function(res) {
				expect(JSON.stringify(res.body)).to.equal(JSON.stringify(test.expect))
				done()
			})
		})
	}

}
