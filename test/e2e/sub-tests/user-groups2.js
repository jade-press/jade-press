'use strict'

let config = require('../config')
let host = 'http://127.0.0.1:' + config.port
let urls = require('../../../doc/api').accessUrlsControlled

//sub test for main
module.exports = function($) {

	let browser = $

	$
	.click('.nav-tabs a[href="#list"]')
	.waitForElementVisible('form[name=form1]', 500)

	//edit button
	.jqueryClick('.list-group-item:last .pull-xs-right .btn-primary', function() {
		$.assert.elementCount('.list-group-item:last form[name=form3]', 1)
	})

	//cancel
	.jqueryClick('.list-group-item:last form[name=form3] .btn-danger', function() {
		$.assert.elementCount('.list-group-item:last form[name=form3]', 0)
	})

	//edit
	.jqueryClick('.list-group-item:last .pull-xs-right .btn-primary', function() {
		$.assert.elementCount('.list-group-item:last form[name=form3]', 1)
	})

	//form
	.setValue('form[name=form3] input[name=name]', 'kk')
	.clearValue('form[name=form3] input[name=name]', function() {
		$.assert.elementCount('.alert.alert-danger:visible', 1)
	})
	.setValue('form[name=form3] input[name=name]', Array(51).fill('p').join(''), function() {
		$.getValue('form[name=form3] input[name=name]', function(result) {
			this.assert.equal(result.value, Array(50).fill('p').join(''))
		})
	})

	.clearValue('form[name=form3] input[name=name]')
	.setValue('form[name=form3] input[name=name]', 'test2', function() {
		$.assert.elementCount('.alert.alert-danger:visible', 0)
	})

	.clearValue('form[name=form3] textarea[name=desc]')
	.setValue('form[name=form3] textarea[name=desc]', Array(510).fill('p').join(''), function() {
		$.getValue('form[name=form3] textarea[name=desc]', function(result) {
			this.assert.equal(result.value, Array(500).fill('p').join(''))
		})
	})
	.clearValue('form[name=form3] textarea[name=desc]', function() {
		$.assert.elementCount('.alert.alert-danger:visible', 0)
	})
	.setValue('form[name=form3] textarea[name=desc]', 'desc9')

	//unselect access url
	.jqueryClick('form[name=form3] .accesses .btn:first', function() {
		$.assert.elementCount('.alert.alert-danger:visible', 1)
	})

	//submit fail
	.click('form[name=form3] button[type="submit"]', function() {
		$.assert.elementCount('.alert.alert-danger:visible', 1)
	})

	//unselect access url
	.jqueryClick('form[name=form3] .accesses .btn:first', function() {
		$.assert.elementCount('.alert.alert-danger:visible', 0)
	})

	//submit again
	.click('form[name=form3] button[type="submit"]')

	//success alert
	.waitForElementPresent('#msg3 .alert.alert-success', 1500)


}

