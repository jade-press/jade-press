'use strict'

let config = require('../config')
let host = 'http://127.0.0.1:' + config.port
let testTab = require('../section-tests/tab')

//sub test for main
module.exports = function($) {

	testTab($, '#list', 'form[name=form1]')

	//edit button
	$
	.jqueryClick('.list-group-item:last .pull-xs-right .btn-primary', function() {
		$.assert.elementCount('.list-group-item:last form[name=form3]', 1)
	})

	//cancel
	.jqueryClick('.list-group-item:last form[name=form3] .btn-danger', function() {
		$.pause(100).assert.elementCount('.list-group-item:last form[name=form3]', 0)
	})

	//edit
	.jqueryClick('.list-group-item:last .pull-xs-right .btn-primary', function() {
		$.assert.elementCount('.list-group-item:last form[name=form3]', 1)
	})

	//form
	$.setValue('form[name=form3] input[name=name]', 'kk')
	.clearValue('form[name=form3] input[name=name]', function() {
		$.assert.elementCount('.alert.alert-danger:visible', 1)
	})
	.setValue('form[name=form3] input[name=name]', Array(51).fill('p').join(''), function() {
		$.getValue('form[name=form3] input[name=name]', function(result) {
			this.assert.equal(result.value, Array(50).fill('p').join(''))
		})
	})

	.clearValue('form[name=form3] input[name=name]')
	.setValue('form[name=form3] input[name=name]', 'test1', function() {
		$.assert.elementCount('.alert.alert-danger:visible', 0)
	})
	
	//submit again
	.click('form[name=form3] button[type="submit"]')

	//success alert-success
	.waitForElementPresent('#msg3 .alert.alert-success', 800)

	//delete
	require('../section-tests/delete-elem')($)


}

