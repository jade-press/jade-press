'use strict'

//sub test for main
module.exports = function($) {

	$

	//url
	.assert.urlContains('reset')

	//form validate
	.setValue('input[name=password]', '111', function() {
		$.assert.elementCount('.alert.alert-danger:visible', 1)
	})
	.clearValue('input[name=password]')
	.setValue('input[name=password]', '123456a', function() {
		$.assert.elementCount('.alert.alert-danger:visible', 0)
	})
	.setValue('input[name=password1]', '123456b', function() {
		$.assert.elementCount('.alert.alert-danger:visible', 1)
	})
	.clearValue('input[name=password1]')
	.setValue('input[name=password1]', '123456a')

	//submit
	.click('button[type="submit"]')
	.pause(4000)

}

