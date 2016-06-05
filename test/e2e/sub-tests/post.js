'use strict'

let config = require('../config')
let host = 'http://127.0.0.1:' + config.port
let testTab = require('../section-tests/tab')
let resolve = require('path').resolve

//sub test for main
module.exports = function($) {

	let browser = $

	$

	//url
	.click('#nav a[href="' + host + '/admin/post"]')
	.waitForElementVisible('#nav a.active[href="' + host + '/admin/post"]', 1500)
	.assert.urlContains('post')

	//tab
	testTab($, '#new', 'form[name=form2]')
	testTab($, '#list', 'form[name=form1]')

	//default list count
	$
	.assert.elementCount('.list-group-item', 1)

	//list content
	.assert.elementCount('.list-group-item .post-cats', 1)
	.assert.elementCount('.list-group-item .post-link', 1)
	.waitForText('.list-group-item .post-link', function(text) {
			return text.indexOf('hello') > -1
	}, 10)
	.waitForText('.list-group-item .post-cats', function(text) {
			return text.indexOf('default') > -1
	}, 10)

	//search no result
	.setValue('form[name=form1] input[name=title]', '111')
	.click('form[name=form1] button[type="submit"]')
	.pause(300)
	.assert.elementCount('.list-group-item', 0)

	//search 1 result
	.clearValue('form[name=form1] input[name=title]')
	.setValue('form[name=form1] input[name=title]', 'hello')
	.click('form[name=form1] button[type="submit"]')
	.pause(300)
	.assert.elementCount('.list-group-item', 1)

	//group select no result
	.click('form[name=form1] select')
	.keys($.Keys.ARROW_DOWN)
	.keys($.Keys.ENTER)
	.click('form[name=form1] button[type="submit"]')
	.waitForJqueryAjaxRequest()
	.pause(100)
	.assert.elementCount('.list-group-item', 0)

	//group select 1 result
	.click('form[name=form1] select')
	.keys($.Keys.ARROW_UP)
	.keys($.Keys.ENTER)
	.click('form[name=form1] button[type="submit"]')
	.waitForJqueryAjaxRequest()
	.pause(100)
	.assert.elementCount('.list-group-item', 1)

	//publish status
	.jqueryClick('form[name=form1] .btn-group .btn:eq(1)')
	.waitForJqueryAjaxRequest()
	.pause(100)
	.assert.elementCount('.list-group-item', 1)

	.jqueryClick('form[name=form1] .btn-group .btn:eq(2)')
	.waitForJqueryAjaxRequest()
	.pause(100)
	.assert.elementCount('.list-group-item', 0)

	.jqueryClick('form[name=form1] .btn-group .btn:eq(0)')
	.waitForJqueryAjaxRequest()
	.pause(100)
	.assert.elementCount('.list-group-item', 1)

	//new user
	testTab($, '#new', 'form[name=form2]')

	//form

	//title
	$.setValue('form[name=form2] input[name=title]', 'kk')
	.clearValue('form[name=form2] input[name=title]', function() {
		$.assert.elementCount('.alert.alert-danger:visible', 1)
	})
	.setValue('form[name=form2] input[name=title]', Array(51).fill('p').join(''), function() {
		$.getValue('form[name=form2] input[name=title]', function(result) {
			this.assert.equal(result.value, Array(50).fill('p').join(''))
		})
	})

	//instant publish button
	.click('form[name=form2] .publish-control', function() {
		$.waitForElementPresent('form[name=form2] .publish-control.btn-primary', 1000)
	})
	.click('form[name=form2] .publish-control', function() {
		$.waitForElementPresent('form[name=form2] .publish-control.btn-muted', 1000)
	})

	//desc
	.setValue('form[name=form2] textarea[name=desc]', Array(510).fill('p').join(''), function() {
		$.getValue('form[name=form2] textarea[name=desc]', function(result) {
			this.assert.equal(result.value, Array(500).fill('p').join(''))
		})
	})
	.clearValue('form[name=form2] textarea[name=desc]', function() {
		$.assert.elementCount('.alert.alert-danger:visible', 0)
	})
	.setValue('form[name=form2] textarea[name=desc]', 'desc')

	//slug
	.setValue('form[name=form2] input[name=slug]', '$$$', function() {
		$.assert.elementCount('form[name=form2] .alert.alert-danger:visible', 1)
	})
	.clearValue('form[name=form2] input[name=slug]', function() {
		$.assert.elementCount('form[name=form2] .alert.alert-danger:visible', 0)
	})
	.setValue('form[name=form2] input[name=slug]', 'post1-slug', function() {
		$.assert.elementCount('form[name=form2] .alert.alert-danger:visible', 0)
	})

	//tag
	.setValue('form[name=form2] input[name=tags]', Array(101).fill('p').join(''), function() {
		$.getValue('form[name=form2] input[name=tags]', function(result) {
			this.assert.equal(result.value, Array(100).fill('p').join(''))
		})
	})
	.clearValue('form[name=form2] input[name=tags]', function() {
		$.assert.elementCount('form[name=form2] .alert.alert-danger:visible', 0)
	})
	.setValue('form[name=form2] input[name=tags]', 'post1tag,tag2')

	//cat selection
	.jqueryClick('form[name=form2] .cats .btn:eq(0)', function() {
		$.assert.elementCount('form[name=form2] .cats .btn-primary', 1)
	})
	.jqueryClick('form[name=form2] .cats .btn:eq(1)', function() {
		$.assert.elementCount('form[name=form2] .cats .btn-primary', 2)
	})
	.jqueryClick('form[name=form2] .cats .btn:eq(1)', function() {
		$.assert.elementCount('form[name=form2] .cats .btn-primary', 1)
	})
	.jqueryClick('form[name=form2] .cats .btn:eq(0)', function() {
		$.assert.elementCount('form[name=form2] .cats .btn-primary', 0)
	})

	//file upload
	.setValue('input#file2', resolve(__dirname, '../../../public/img/jade-press-logo.png'), function() {
		$.pause(300)
		$.assert.elementCount('form[name=form2] .files-list1 .list-group-item', 1)
		$.assert.elementCount('form[name=form2] .files-list2 .list-group-item', 1)
	})

	//upload same file agian
	.setValue('input#file2', resolve(__dirname, '../../../public/img/jade-press-logo.png'))
	.waitForElementVisible('.files-control2 .alert.alert-danger', 1500)
	.waitForJqueryElement('.files-control2 .list-group-item.tada', 500)

	//try another file
	.setValue('input#file2', resolve(__dirname, '../../data/p1.png'))
	.pause(100)
	.assert.elementCount('.files-control2 .files-list1 .list-group-item', 2)

	//insert file
	.jqueryClick('form[name=form2] .files-control2 .files-list1 .list-group-item:eq(0) .insert-file', function() {
		$.getValue('form[name=form2] [name=content] textarea', function(result) {
			console.log(result.value)
			this.assert.equal(result.value.indexOf('img') > -1, true)
		})
	})
	.clearValue('form[name=form2] [name=content] textarea')

	//setFeaturedFile
	.jqueryClick('form[name=form2] .files-control2 .files-list1 .list-group-item:eq(0) .set-file', function() {
		$.assert.elementCount('.files-control2 .featured-file img', 1)
	})

	//unsetFeaturedFile
	.jqueryClick('form[name=form2] .files-control2 .unset-featured', function() {
		$.assert.elementCount('.files-control2 .featured-file img', 0)
	})

	//more options
	.click('form[name=form2] .toggle-more')
	.waitForElementVisible('form[name=form2] .more', 1000)
	.click('form[name=form2] .toggle-more')
	.waitForElementNotVisible('form[name=form2] .more', 1000)
	.click('form[name=form2] .toggle-more')
	.waitForElementVisible('form[name=form2] .more', 1000)

	//style edit and validate
	.setValue('form[name=form2] div[name=style] textarea', '$$$', function() {

		$
		.click('form[name=form2] button.validate-style')
		.waitForElementVisible('form[name=form2] .style-control-msg .text-danger', 1000)

	})
	.clearValue('form[name=form2] div[name=style] textarea')
	.setValue('form[name=form2] div[name=style] textarea', 'a\n\tcolor #fff', function() {

		$
		.click('form[name=form2] button.validate-style')
		.waitForElementVisible('form[name=form2] .style-control-msg .text-success', 1000)

	})

	//content editor buttons
	.click('form[name=form2] .editor-buttons .je-i', function() {
		$.getValue('form[name=form2] [name=content] textarea', function(result) {
			this.assert.equal(result.value, '<i></i>')
		})
	})
	.clearValue('form[name=form2] [name=content] textarea')

	//preview button
	.click('form[name=form2] .editor-buttons .preview-content', function() {
		$.waitForElementVisible('form[name=form2] .preview-wrap', 1000)
	})
	.click('form[name=form2] .editor-buttons .preview-content', function() {
		$.waitForElementNotVisible('form[name=form2] .preview-wrap', 1000)
	})
	.setValue('form[name=form2] [name=content] textarea', 'ul\n    li xxxx<bbf>fggg</bbf>',  function() {
		$.click('form[name=form2] .editor-buttons .preview-content', function() {
			$.waitForElementVisible('form[name=form2] .preview-wrap', 1000)
		})
		.waitForJqueryAjaxRequest()
		.waitForText('form[name=form2] .preview-wrap', function(text) {
			console.log(text)
				return text.indexOf('xxxx') > -1 && text.indexOf('fggg') === -1
				//iframe should be filtere
		}, 10)
	})

	.clearValue('form[name=form2] [name=content] textarea')

	//submit ok
	.click('form[name=form2] button[type="submit"]')

	//success alert
	.waitForElementPresent('#msg2 .alert.alert-success', 1500)

	//reset form
	.getValue('form[name=form2] input[name=title]', function(result) {
		this.assert.equal(result.value, '')
	})
	.waitForElementNotVisible('form[name=form2] .style-control-msg', 1000)

	//list count
	.assert.elementCount('.post-list .list-group-item', 2)

	//user-list
	require('./post-list')($)


}
