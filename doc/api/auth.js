
'use strict'

exports['/login'] = {
	url: '/login'
	,method: 'get'
	,name: 'login page'
	,desc: ''
	,lib: 'lib/common-page'
	,func: 'login'
}

exports['/common-login'] = {
	url: '/login'
	,method: 'post'
	,name: 'login'
	,desc: ''
	,lib: 'lib/auth'
	,func: 'login'
}

exports['/logout'] = {
	url: '/logout'
	,method: 'get'
	,name: 'login'
	,desc: ''
	,lib: 'lib/auth'
	,func: 'logout'
}

exports['/captcha'] = {
	url: '/captcha'
	,method: 'get'
	,name: 'captcha'
	,desc: ''
	,lib: 'lib/captcha'
	,func: 'captcha'
}