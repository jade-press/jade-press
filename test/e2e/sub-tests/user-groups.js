'use strict'

let config = require('../config')
let host = 'http://127.0.0.1:' + config.port
let urls = require('../../../doc/api').accessUrlsControlled

//sub test for main
module.exports = function($) {

	let browser = $

	$

	//url
	.click('#nav a[href="' + host + '/admin/group"]')
	.waitForElementVisible('#nav a.active[href="' + host + '/admin/group"]', 1500)
	.assert.urlContains('group')

	//tab
	.click('.nav-tabs a[href="#new"]')
	.waitForElementVisible('form[name=form2]', 500)
	.click('.nav-tabs a[href="#list"]')
	.waitForElementVisible('form[name=form1]', 500)

	//default list count
	.assert.elementCount('.list-group-item', 3)

	//admin auth check
	.assert.elementCount('.urls:first li', urls.length)

	//search no result
	.setValue('form[name=form1] input[name=name]', '111')
	.click('form[name=form1] button[type="submit"]')
	.pause(300)
	.assert.elementCount('.list-group-item', 0)

	//search 1 result
	.clearValue('form[name=form1] input[name=name]')
	.setValue('form[name=form1] input[name=name]', 'admin')
	.click('form[name=form1] button[type="submit"]')
	.pause(300)
	.assert.elementCount('.list-group-item', 1)

	.clearValue('form[name=form1] input[name=name]')
	.click('form[name=form1] button[type="submit"]')
	.pause(300)
	.assert.elementCount('.list-group-item', 3)

	//new group
	.click('.nav-tabs a[href="#new"]')
	.waitForElementVisible('form[name=form2]', 500)

	//form
	.setValue('form[name=form2] input[name=name]', 'kk')
	.clearValue('form[name=form2] input[name=name]', function() {
		$.assert.elementCount('.alert.alert-danger:visible', 2)
	})
	.setValue('form[name=form2] input[name=name]', Array(51).fill('p').join(''), function() {
		$.getValue('form[name=form2] input[name=name]', function(result) {
			this.assert.equal(result.value, Array(50).fill('p').join(''))
		})
	})

	.clearValue('form[name=form2] input[name=name]')
	.setValue('form[name=form2] input[name=name]', 'test1', function() {
		$.assert.elementCount('.alert.alert-danger:visible', 1)
	})

	.setValue('form[name=form2] textarea[name=desc]', Array(510).fill('p').join(''), function() {
		$.getValue('form[name=form2] textarea[name=desc]', function(result) {
			this.assert.equal(result.value, Array(500).fill('p').join(''))
		})
	})
	.clearValue('form[name=form2] textarea[name=desc]', function() {
		$.assert.elementCount('.alert.alert-danger:visible', 1)
	})
	.setValue('form[name=form2] textarea[name=desc]', 'desc')

	//submit fail
	.click('form[name=form2] button[type="submit"]', function() {
		$.assert.elementCount('.alert.alert-danger:visible', 1)
	})

	//select access url
	.jqueryClick('form[name=form2] .accesses .btn:first', function() {
		$.assert.elementCount('.alert.alert-danger:visible', 0)
	})

	//submit again
	.click('form[name=form2] button[type="submit"]')

	//success alert
	.waitForElementPresent('form[name=form2] .alert.alert-success', 1500)

	//reset form
	.getValue('form[name=form2] input[name=name]', function(result) {
		this.assert.equal(result.value, '')
	})

	//list count
	.assert.elementCount('.list-group-item', 4)


}

