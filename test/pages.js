
'use strict'

let chai = require('chai')
let chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
let killProcessByPort = require('./lib/kill-process-by-port').kill
,visit = require('./lib/visit-page')
,co = require('co')
,pack = require('../package.json')
,path = require('path')
,port = 9867
,wait = require('./lib/wait-for-server')


describe('pages', function() {

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

	let tests = [

		{
			title: 'home'
			,html: '<title>jadepress</title>'
			,url: 'http://127.0.0.1:' + port
		}
		,{
			title: 'category'
			,html: '<title>default - category - jadepress</title>'
			,url: 'http://127.0.0.1:' + port + '/cat/default'
		}
		,{
			title: 'single post'
			,html: '<title>hello, jadepress! - jadepress</title>'
			,url: 'http://127.0.0.1:' + port + '/default/hello-slug'
		}
		,{
			title: '404'
			,html: '<title>404 - jadepress</title>'
			,url: 'http://127.0.0.1:' + port + '/ggg'
		}
		,{
			title: 'search - no result'
			,html: 'find no post'
			,url: 'http://127.0.0.1:' + port + '/s?title=dddd'
		}
		,{
			title: 'search - has result'
			,html: 'hello, jadepress'
			,url: 'http://127.0.0.1:' + port + '/s?title=hello'
		}
		,{
			title: 'login'
			,html: 'login - jadepress'
			,url: 'http://127.0.0.1:' + port + '/login'
		}
		,{
			title: 'reset password'
			,html: 'reset password'
			,url: 'http://127.0.0.1:' + port + '/reset-password-request'
		}

	]

	tests.forEach(function(test) {
		it(test.title, function(done) {
			
			co(wait(port)).then(function(res) {
				visit({
					url: test.url
					,method: 'get'
				})
				.then(function(res) {
					chai.should()
					res.should.have.property('response')
					res.should.have.property('body')
					chai.expect(res.body.indexOf(test.html) > -1).to.equal(true)
					done()
				})
			}, function(err) {
				console.error(err.stack || err)
			})

		})
	})

})