
'use strict'


exports['/api/post/add'] = {
	url: '/api/post/add'
	,name: 'new post'
	,desc: ''
	,lib: 'lib/post'
	,func: 'add'
	,method: 'post'
}

exports['/api/post/del'] = {
	url: '/api/post/del'
	,name: 'delete post'
	,desc: ''
	,lib: 'lib/post'
	,func: 'del'
	,method: 'post'
}

exports['/api/post/update'] = {
	url: '/api/post/update'
	,name: 'update post'
	,desc: ''
	,lib: 'lib/post'
	,func: 'update'
	,method: 'post'
}

exports['/api/post/del-self'] = {
	url: '/api/post/del-self'
	,name: 'delete user-created post'
	,desc: ''
	,lib: 'lib/post'
	,func: 'del'
	,method: 'post'
}

exports['/api/post/update-self'] = {
	url: '/api/post/update-self'
	,method: 'post'
	,name: 'update user-created post'
	,desc: ''
	,lib: 'lib/post'
	,func: 'update'
}

exports['/api/post/get'] = {
	url: '/api/post/get'
	,method: 'post'
	,name: 'get post'
	,desc: ''
	,lib: 'lib/post'
	,func: 'get'
}

exports['/api/post/validate-style'] = {
	url: '/api/post/validate-style'
	,method: 'post'
	,name: 'validate style'
	,desc: 'validate post stylus'
	,lib: 'lib/post'
	,func: 'validateStyle'
}