'use strict'

let config = require('../config')
let host = 'http://127.0.0.1:' + config.port
let resolve = require('path').resolve

//sub test for main
module.exports = function($) {

	let browser = $

	$

	//url
	.click('#nav a[href="' + host + '/admin/file"]')
	.waitForElementVisible('#nav a.active[href="' + host + '/admin/file"]', 1500)
	.assert.urlContains('file')

	//no files
	.assert.elementCount('.list-group-item', 0)

	//upload
	.setValue('input#file2', resolve(__dirname, '../../../public/img/jade-press-logo.png'))
	.waitForElementVisible('.list-group-item', 1500)

	//upload same file agian
	.setValue('input#file2', resolve(__dirname, '../../../public/img/jade-press-logo.png'))
	.waitForElementVisible('.alert.alert-danger', 1500)
	.waitForJqueryElement('.list-group-item.tada', 200)

	//try another file
	.setValue('input#file2', resolve(__dirname, '../../data/p1.png'))
	.pause(100)
	.assert.elementCount('.list-group-item', 2)

	//del
	require('../section-tests/delete-elem')($)

}

