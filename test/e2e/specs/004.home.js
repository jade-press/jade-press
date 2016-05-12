'use strict'

let config = require('../config')
,port = config.port
,host = 'http://127.0.0.1:' + port
,test = {
	title: 'home'
	,waitForElementVisible: '#wrapper'
	,elementPresent: '#nav'
	,containsText: ['h2', 'hello, jadepress!']
	,elementCount: ['h2', 1]
	,url: 'http://127.0.0.1:' + port
}

exports[test.title] = function(browser) {
	browser
		.url(test.url)
		.waitForElementVisible(test.waitForElementVisible, 5000)
		.assert.elementPresent(test.elementPresent)
		.assert.containsText(test.containsText[0], test.containsText[1])
		.assert.elementCount(test.elementCount[0], test.elementCount[1])
		.end()
}
