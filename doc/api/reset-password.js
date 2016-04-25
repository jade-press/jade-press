
'use strict'

exports['/reset-password/:id'] = {
	url: '/reset-password/:id'
	,method: 'get'
	,name: 'reset password page'
	,desc: ''
	,lib: 'lib/common-page'
	,func: 'resetPasswordPage'
}

exports['/reset-password-request'] = {
	url: '/reset-password-request'
	,method: 'get'
	,name: 'request reset password page'
	,desc: ''
	,lib: 'lib/common-page'
	,func: 'resetPasswordRequestPage'
}

exports['/reset-password'] = {
	url: '/reset-password'
	,method: 'post'
	,name: 'reset password'
	,desc: ''
	,lib: 'lib/user'
	,func: 'resetPassword'
}

exports['/reset-password-apply'] = {
	url: '/reset-password-apply'
	,method: 'post'
	,name: 'reset password apply'
	,desc: ''
	,lib: 'lib/user'
	,func: 'resetPasswordApply'
}