'use strict'

let config = require('../config')
,port = config.port
,host = 'http://127.0.0.1:' + port
,tests = [
	{
		title: 'forget password'
		,waitForElementVisible: '#wrapper'
		,elementPresent: 'h1'
		,containsText: ['.btn-link', 'login']
		,elementCount: ['h1', 1]
		,url: 'http://127.0.0.1:' + port + '/reset-password-request'
	}
]

//disable
exports['@disabled'] = 0

tests.forEach(function(test) {

	exports[test.title] = function(browser) {
		browser
			.url(test.url)
			.waitForElementVisible(test.waitForElementVisible, 5000)
			.assert.elementPresent(test.elementPresent)
			.assert.containsText(test.containsText[0], test.containsText[1])
			.assert.elementCount(test.elementCount[0], test.elementCount[1])
			.end()
	}
	
})

