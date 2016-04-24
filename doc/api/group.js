
'use strict'


exports['/api/group/add'] = {
	url: '/api/group/add'
	,method: 'post'
	,name: 'new group'
	,desc: ''
	,lib: 'lib/group'
	,func: 'add'
}

exports['/api/group/del'] = {
	url: '/api/group/del'
	,method: 'post'
	,name: 'delete group'
	,desc: ''
	,lib: 'lib/group'
	,func: 'del'
}

exports['/api/group/update'] = {
	url: '/api/group/update'
	,method: 'post'
	,name: 'update group'
	,desc: ''
	,lib: 'lib/group'
	,func: 'update'
}

exports['/api/group/get'] = {
	url: '/api/group/get'
	,method: 'post'
	,name: 'get group'
	,desc: ''
	,lib: 'lib/group'
	,func: 'get'
}

exports['/api/access/get'] = {
	url: '/api/access/get'
	,method: 'post'
	,name: 'get access controls url'
	,desc: ''
	,lib: 'lib/group'
	,func: 'getAccesses'
}