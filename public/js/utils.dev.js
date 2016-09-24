
;(function() {
Vue.$alert = function() {

	var args = arguments
	var r1 = args[0]
	var opt = {}
	if($.isPlainObject(r1)) opt = r1
	else {
		opt.content = r1
		opt.type = args[1]
		opt.container = args[2]
		opt.duration = args[3]
		opt.title = args[4]
	}

	var id = 'alert' + new Date().getTime()
	var ht = '<div id="' + id + '" class="alert alert-' + opt.type + ' alert-dismissible fade in" role="alert">' +
		'<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
			'<span aria-hidden="true">&times;</span>' +
		'</button>' +
		(opt.title?'<strong>' + opt.title + '</strong> ':'') + 
		opt.content +
	'</div>'

	$(opt.container || 'body').append(ht)
	if(opt.duration) {
		setTimeout(function() {
			$('#' + id).alert('close')
		}, opt.duration)
	}
}

function checkNavBar() {
	//collapse button
	if(!$('.navbar-toggler').is(':visible')) $('#menus').addClass('in')
	else $('#menus').removeClass('in')
}


//resize
$(window).on('resize', checkNavBar)

checkNavBar()

$.ajax2 = function(opt) {
	opt.headers = {
		csrf: window.h5.csrf
	}
	return $.ajax(opt)
}

})()