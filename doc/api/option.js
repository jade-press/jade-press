
'use strict'

exports['/api/option/update'] = {
	url: '/api/option/update'
	,method: 'post'
	,name: 'update option'
	,desc: ''
	,lib: 'lib/option'
	,func: 'update'
}

exports['/api/option/get'] = {
	url: '/api/option/get'
	,method: 'get'
	,name: 'get option'
	,desc: ''
	,lib: 'lib/option'
	,func: 'get'
}

exports['/api/option/get-system-info'] = {
	url: '/api/option/get-system-info'
	,method: 'get'
	,name: 'get system info'
	,desc: ''
	,lib: 'lib/option'
	,func: 'getSystemInfo'
}