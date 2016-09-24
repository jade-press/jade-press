
'use strict'


exports['/api/cat/add'] = {
	url: '/api/cat/add'
	,method: 'post'
	,name: 'new category'
	,desc: ''
	,lib: 'lib/cat'
	,func: 'add'
}

exports['/api/cat/del'] = {
	url: '/api/cat/del'
	,method: 'post'
	,name: 'delete category'
	,desc: ''
	,lib: 'lib/cat'
	,func: 'del'
}

exports['/api/cat/update'] = {
	url: '/api/cat/update'
	,method: 'post'
	,name: 'update category'
	,desc: ''
	,lib: 'lib/cat'
	,func: 'update'
}

exports['/api/cat/get'] = {
	url: '/api/cat/get'
	,method: 'get'
	,name: 'get category'
	,desc: ''
	,lib: 'lib/cat'
	,func: 'get'
}