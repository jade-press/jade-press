'use strict'


module.exports = function($) {

	let browser = $

	$

	//delete
	.jqueryClick('.list-group-item:last .pull-xs-right .btn-warning:first', function() {
		$.waitForJqueryElement(
			'.list-group-item:last .pull-xs-right .btn-group:last .btn-danger:visible'
			,500
			)
	})

	//cancel
	.jqueryClick(
		'.list-group-item:last .pull-xs-right .btn-group:last .btn-primary:visible'
		,function() {
		$.waitForJqueryElement(
			'.list-group-item:last .pull-xs-right .btn-warning:visible'
			,500
		)
	})

	//delete
	.jqueryClick('.list-group-item:last .pull-xs-right .btn-warning', function() {
		$.waitForJqueryElement(
			'.list-group-item:last .pull-xs-right .btn-group:last .btn-danger:visible'
			,500
			)
	})

	//confirm delete
	.jqueryClick('.list-group-item:last .pull-xs-right .btn-group:last .btn-danger:visible', function() {
		$.waitForJqueryElement(
			'#msg3 .alert-success'
			,500
			)
	})

}

