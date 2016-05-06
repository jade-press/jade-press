// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

'use strict'

let config = require('../config')
,port = config.port
,tests = config.pages

,obj = {}

tests.forEach(function(test) {

	obj[test.title] = function (browser) {
		browser
		.url(test.url)
			.waitForElementVisible(test.waitForElementVisible, 5000)
			.assert.elementPresent(test.elementPresent)
			.assert.containsText(test.containsText[0], test.containsText[1])
			.assert.elementCount(test.elementCount[0], test.elementCount[1])
			.end()
	}

})

module.exports = obj