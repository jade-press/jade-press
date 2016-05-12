'use strict'

let config = require('../config')
,port = config.port
,host = 'http://127.0.0.1:' + port
,test = {
	title: '404'
	,waitForElementVisible: '#wrapper'
	,elementPresent: '#wrapper'
	,containsText: ['h1', '404.']
	,elementCount: ['h1', 1]
	,url: 'http://127.0.0.1:' + port + '/ggg'
}

exports[test.title] = function(browser) {
	browser
		.url(test.url)
		.waitForElementVisible(test.waitForElementVisible, 5000)
		.assert.elementPresent(test.elementPresent)
		.assert.containsText(test.containsText[0], test.containsText[1])
		.end()
}
