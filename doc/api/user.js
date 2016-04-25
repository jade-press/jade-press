
'use strict'

exports['/api/user/reset-password'] = {
	url: '/api/user/reset-password'
	,method: 'post'
	,name: 'reset password'
	,desc: ''
	,lib: 'lib/user'
	,func: 'resetPassword'
	,type: 'required'
}

exports['/api/user/add'] = {
	url: '/api/user/add'
	,name: 'new user'
	,desc: ''
	,lib: 'lib/user'
	,func: 'add'
	,method: 'post'
}

exports['/api/user/del'] = {
	url: '/api/user/del'
	,method: 'post'
	,name: 'delete user'
	,desc: ''
	,lib: 'lib/user'
	,func: 'del'
}

exports['/api/user/del'] = {
	url: '/api/user/del'
	,method: 'post'
	,name: 'delete user'
	,desc: ''
	,lib: 'lib/user'
	,func: 'del'
}

exports['/api/user/update'] = {
	url: '/api/user/update'
	,method: 'post'
	,name: 'update user'
	,desc: ''
	,lib: 'lib/user'
	,func: 'update'
}

exports['/api/user/change-password'] = {
	url: '/api/user/change-password'
	,method: 'post'
	,name: 'update user password'
	,desc: ''
	,lib: 'lib/user'
	,func: 'changePassword'
	,type: 'required'
}

exports['/api/user/get'] = {
	url: '/api/user/get'
	,method: 'post'
	,name: 'get user'
	,desc: ''
	,lib: 'lib/user'
	,func: 'get'
}