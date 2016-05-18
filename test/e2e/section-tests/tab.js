'use strict'


module.exports = function($, tab, testElem, time) {

	let browser = $

	$

	//tab
	.click('.nav-tabs a[href="' + tab + '"]')
	.waitForElementVisible(testElem, time || 500)

}

