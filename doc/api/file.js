
'use strict'


exports['/api/file/add'] = {
	url: '/api/file/add'
	,method: 'post'
	,name: 'upload'
	,desc: ''
	,lib: 'lib/file'
	,func: 'upload'
}

exports['/api/file/get'] = {
	url: '/api/file/get'
	,method: 'get'
	,name: 'get files'
	,desc: ''
	,lib: 'lib/file'
	,func: 'get'
}

exports['/api/file/del'] = {
	url: '/api/file/del'
	,method: 'post'
	,name: 'delete files'
	,desc: ''
	,lib: 'lib/file'
	,func: 'del'
}

exports['/file/:file'] = {
	url: '/file/:file'
	,method: 'get'
	,name: 'upload'
	,desc: ''
	,lib: 'lib/file'
	,func: 'file'
}
