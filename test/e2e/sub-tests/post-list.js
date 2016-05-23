'use strict'

let config = require('../config')
let host = 'http://127.0.0.1:' + config.port
let testTab = require('../section-tests/tab')
let resolve = require('path').resolve

//sub test for main
module.exports = function($) {

	let browser = $

	//tab
	testTab($, '#list', 'form[name=form1]')

	//edit button
	$
	.jqueryClick('.post-list > .list-group-item:last .btns .btn-primary', function() {
		$.pause(100).assert.elementCount('.post-list > .list-group-item:last form[name=form3]', 1)
	})

	//cancel
	.jqueryClick('.post-list > .list-group-item:last form[name=form3] .btn-cancel-edit', function() {
		$.assert.elementCount('.post-list > .list-group-item:last form[name=form3]', 0)
	})

	//edit
	.jqueryClick('.post-list > .list-group-item:last .btns .btn-primary', function() {
		$.pause(100).assert.elementCount('.post-list > .list-group-item:last form[name=form3]', 1)
	})

	//form

	//title
	.clearValue('form[name=form3] input[name=title]', function() {
		$.assert.elementCount('form[name=form3] .alert.alert-danger:visible', 1)
	})
	.setValue('form[name=form3] input[name=title]', Array(51).fill('p').join(''), function() {
		$.getValue('form[name=form3] input[name=title]', function(result) {
			this.assert.equal(result.value, Array(50).fill('p').join(''))
		})
	})

	//desc
	.clearValue('form[name=form3] textarea[name=desc]', function() {
		$.assert.elementCount('form[name=form3]  .alert.alert-danger:visible', 0)
	})
	.setValue('form[name=form3] textarea[name=desc]', Array(510).fill('p').join(''), function() {
		$.getValue('form[name=form3] textarea[name=desc]', function(result) {
			this.assert.equal(result.value, Array(500).fill('p').join(''))
		})
	})
	.clearValue('form[name=form3] textarea[name=desc]', function() {
		$.assert.elementCount('form[name=form3] .alert.alert-danger:visible', 0)
	})
	.setValue('form[name=form3] textarea[name=desc]', 'desc00')

	//slug
	.setValue('form[name=form3] input[name=slug]', '$$$', function() {
		$.assert.elementCount('form[name=form3] .alert.alert-danger:visible', 1)
	})
	.clearValue('form[name=form3] input[name=slug]', function() {
		$.assert.elementCount('form[name=form3] .alert.alert-danger:visible', 1)
	})
	.setValue('form[name=form3] input[name=slug]', 'post1-slug', function() {
		$.assert.elementCount('form[name=form3] .alert.alert-danger:visible', 0)
	})

	//tag
	.clearValue('form[name=form3] input[name=tags]', function() {
		$.assert.elementCount('form[name=form3] .alert.alert-danger:visible', 0)
	})
	.setValue('form[name=form3] input[name=tags]', Array(101).fill('p').join(''), function() {
		$.getValue('form[name=form3] input[name=tags]', function(result) {
			this.assert.equal(result.value, Array(100).fill('p').join(''))
		})
	})
	.clearValue('form[name=form3] input[name=tags]', function() {
		$.assert.elementCount('form[name=form3] .alert.alert-danger:visible', 0)
	})
	.setValue('form[name=form3] input[name=tags]', 'post1tag,tag33')

	//cat selection
	.jqueryClick('form[name=form3] .cats .btn:eq(0)', function() {
		$.assert.elementCount('form[name=form3] .cats .btn-primary', 2)
	})
	.jqueryClick('form[name=form3] .cats .btn:eq(1)', function() {
		$.assert.elementCount('form[name=form3] .cats .btn-primary', 1)
	})
	.jqueryClick('form[name=form3] .cats .btn:eq(1)', function() {
		$.assert.elementCount('form[name=form3] .cats .btn-primary', 2)
	})
	.jqueryClick('form[name=form3] .cats .btn:eq(0)', function() {
		$.assert.elementCount('form[name=form3] .cats .btn-primary', 1)
	})

	//upload same file agian
	.setValue('input#file3', resolve(__dirname, '../../../public/img/jade-press-logo.png'))
	.waitForJqueryElement('form[name=form3] .files-control3 .list-group-item.tada', 900)
	.waitForElementVisible('form[name=form3] .files-control3 .alert.alert-danger', 1500)
	

	//try another file
	.setValue('input#file3', resolve(__dirname, '../../data/p2.png'))
	.pause(100)
	.assert.elementCount('.files-control3 .files-list1 .list-group-item', 2)

	//insert file
	.jqueryClick('form[name=form3] .files-control3 .files-list1 .list-group-item:eq(0) .insert-file', function() {
		$.getValue('form[name=form3] [name=content] textarea', function(result) {
			this.assert.equal(result.value.indexOf('img') > -1, true)
		})
	})
	.clearValue('form[name=form3] [name=content] textarea')

	//setFeaturedFile
	.jqueryClick('form[name=form3] .files-control3 .files-list1 .list-group-item:eq(0) .set-file', function() {
		$.assert.elementCount('.files-control3 .featured-file img', 1)
	})

	//unsetFeaturedFile
	.jqueryClick('form[name=form3] .files-control3 .unset-featured', function() {
		$.assert.elementCount('.files-control3 .featured-file img', 0)
	})

	//more options
	.click('form[name=form3] .toggle-more')
	.waitForElementVisible('form[name=form3] .more', 1000)
	.click('form[name=form3] .toggle-more')
	.waitForElementNotVisible('form[name=form3] .more', 1000)
	.click('form[name=form3] .toggle-more')
	.waitForElementVisible('form[name=form3] .more', 1000)

	//style edit and validate
	.clearValue('form[name=form3] div[name=style] textarea')
	.setValue('form[name=form3] div[name=style] textarea', '$$$', function() {

		$
		.click('form[name=form3] button.validate-style')
		.waitForElementVisible('form[name=form3] .style-control-msg .text-danger', 1000)

	})
	.clearValue('form[name=form3] div[name=style] textarea')
	.setValue('form[name=form3] div[name=style] textarea', 'a\n\tcolor #fff', function() {

		$
		.click('form[name=form3] button.validate-style')
		.waitForElementVisible('form[name=form3] .style-control-msg .text-success', 1000)

	})

	//content editor buttons
	.click('form[name=form3] .editor-buttons .je-b', function() {
		$.getValue('form[name=form3] [name=content] textarea', function(result) {
			this.assert.equal(result.value, '<b></b>')
		})
	})

	//submit ok
	.click('form[name=form3] button[type="submit"]')

	//success alert
	//.pause()
	.waitForElementPresent('#msg3 .alert.alert-success', 1500)

	//publish/unpublish
	.jqueryClick('.post-list > .list-group-item:last .pull-xs-right .toggle-publish', function() {
		$.assert.jqueryElementPresent('.post-list > .list-group-item:last .pull-xs-right .toggle-publish.btn-info', 1500)
	})
	.jqueryClick('.post-list > .list-group-item:last .pull-xs-right .toggle-publish', function() {
		$.assert.jqueryElementPresent('.post-list > .list-group-item:last .pull-xs-right .toggle-publish.btn-success', 1500)
	})

	//delete
	.jqueryClick('.post-list > .list-group-item:last .btns .btn-warning:first', function() {
		$.waitForJqueryElement(
			'.post-list > .list-group-item:last .btns .btn-group:last .btn-danger:visible'
			,500
			)
	})

	//cancel
	.jqueryClick(
		'.post-list > .list-group-item:last .btns .btn-group:last .btn-secondary:visible'
		,function() {
		$.waitForJqueryElement(
			'.post-list > .list-group-item:last .btns .btn-warning:visible'
			,500
		)
	})

	//delete
	.jqueryClick('.post-list > .list-group-item:last .btns .btn-warning', function() {
		$.waitForJqueryElement(
			'.post-list > .list-group-item:last .btns .btn-group:last .btn-danger:visible'
			,500
			)
	})

	//confirm delete
	.jqueryClick('.post-list > .list-group-item:last .btns .btn-group:last .btn-danger:visible', function() {
		$.waitForJqueryElement(
			'#msg3 .alert-success'
			,1500
			)
	})


}
