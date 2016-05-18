'use strict'
let testTab = require('../section-tests/tab')

//sub test for main
module.exports = function($) {

	let browser = $

	$

	//url
	.assert.urlContains('main')

	//tab
	testTab($, '#password', 'form[name=form1]')

	$.click('.nav-tabs a[href="#info"]')
	.waitForElementNotVisible('form[name=form1]', 500)

	//form validate
	.click('.nav-tabs a[href="#password"]')
	.waitForElementVisible('form[name=form1]', 500)


	.setValue('input[name=password]', '111', function() {
		browser.assert.elementCount('.alert.alert-danger:visible', 1)
	})
	.clearValue('input[name=password]')
	.setValue('input[name=password]', '123456a', function() {
		browser.assert.elementCount('.alert.alert-danger:visible', 0)
	})
	.setValue('input[name=password1]', '123456b', function() {
		browser.assert.elementCount('.alert.alert-danger:visible', 1)
	})
	.clearValue('input[name=password1]')
	.setValue('input[name=password1]', '123456a')

	//submit
	.click('button[type="submit"]', function() {
		browser.assert.elementCount('.alert.alert-danger:visible', 1)
	})
	.setValue('input[name=oldpass]', '123456a', function() {
		browser.assert.elementCount('.alert.alert-danger:visible', 0)
	})
	.click('button[type="submit"]')
	.waitForElementPresent('.alert.alert-success', 1500)

}

