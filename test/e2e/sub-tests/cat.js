'use strict'

let config = require('../config')
let host = 'http://127.0.0.1:' + config.port
let testTab = require('../section-tests/tab')

//sub test for main
module.exports = function($) {

	let browser = $

	$

	//url
	.click('#nav a[href="' + host + '/admin/cat"]')
	.waitForElementVisible('#nav a.active[href="' + host + '/admin/cat"]', 1500)
	.assert.urlContains('cat')

	//tab
	testTab($, '#new', 'form[name=form2]')
	testTab($, '#list', 'form[name=form1]')

	//default list count
	$
	.assert.elementCount('.list-group-item', 1)

	//search no result
	.setValue('form[name=form1] input[name=name]', '111')
	.click('form[name=form1] button[type="submit"]')
	.pause(300)
	.assert.elementCount('.list-group-item', 0)

	//search 1 result
	.clearValue('form[name=form1] input[name=name]')
	.setValue('form[name=form1] input[name=name]', 'default')
	.click('form[name=form1] button[type="submit"]')
	.pause(300)
	.assert.elementCount('.list-group-item', 1)

	//new user
	testTab($, '#new', 'form[name=form2]')

	//form
	$.setValue('form[name=form2] input[name=name]', 'kk')
	.clearValue('form[name=form2] input[name=name]', function() {
		$.assert.elementCount('.alert.alert-danger:visible', 1)
	})
	.setValue('form[name=form2] input[name=name]', Array(51).fill('p').join(''), function() {
		$.getValue('form[name=form2] input[name=name]', function(result) {
			this.assert.equal(result.value, Array(50).fill('p').join(''))
		})
	})

	.clearValue('form[name=form2] input[name=name]')
	.setValue('form[name=form2] input[name=name]', 'test1', function() {
		$.assert.elementCount('.alert.alert-danger:visible', 0)
	})

	.setValue('form[name=form2] textarea[name=desc]', Array(510).fill('p').join(''), function() {
		$.getValue('form[name=form2] textarea[name=desc]', function(result) {
			this.assert.equal(result.value, Array(500).fill('p').join(''))
		})
	})
	.clearValue('form[name=form2] textarea[name=desc]', function() {
		$.assert.elementCount('.alert.alert-danger:visible', 0)
	})
	.setValue('form[name=form2] textarea[name=desc]', 'desc')

	//submit ok
	.click('form[name=form2] button[type="submit"]', function() {
		$.assert.elementCount('.alert.alert-danger:visible', 0)
	})

	//success alert
	.waitForElementPresent('form[name=form2] .alert.alert-success', 1500)

	//reset form
	.getValue('form[name=form2] input[name=name]', function(result) {
		this.assert.equal(result.value, '')
	})

	//list count
	.assert.elementCount('.list-group-item', 2)

	//user-list
	require('./cat-list')($)


}
