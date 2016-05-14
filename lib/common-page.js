
'use strict'

/**
 * catogory
 */
var _ = require('lodash')
,local = require('../app/local')
,setting = require('../app/setting')
,tools = require('./tools')
,log = tools.log
,err = tools.err
,db = require('./db').db
,cf = require('./db').cf
,links = require('../doc/api/admin-page')
,accesses = require('../doc/api').accessesControlled

exports.login = function* (next) {

	try {

		if(this.session.user) return this.redirect('/admin/main')
		this.render('views/page/login', this.local)

	} catch(e) {

		err('failed render admin page', e)
		this.status = 500
		this.local.error = e
		this.render('views/page/500', this.local)

	}

}

exports.admin = function* (next) {

	try {

		let params = this.params
		let page = params.page
		let user = this.session.user

		if(!user) return this.redirect('/login')

		//check should reset password or not
		if(user.resetPassword) {
			this.session.redirect = this.path
			return this.redirect('/reset-password/' + user.resetPassword)
		}
			
		let path = this.path
		this.local.user = user
		this.local.links = getLinks(user)
		if(
			path.indexOf('page') > -1 ||
			path.indexOf('post') > -1
		) this.local.publicRoute = setting.publicRoute

		else if(path.indexOf('group') > -1) this.local.accesses = accesses

		this.render('views/admin/' + page, this.local)

	} catch(e) {

		err('failed render admin page', e)
		this.status = 500
		this.local.error = e
		this.render('views/page/500', this.local)

	}

}

function getLinks(user) {
	return _.filter(user.group.access, function(v) {
		return v.indexOf('/admin/') > -1
	})
	.map(function(v) {
		return links[v]
	})
}

exports.resetPasswordPage = function* (next) {
	//todo
	try {

		let params = this.params
		let id = params.id
		if(!id) return yield next

		let sea = {
			_id: id
			,state: 'init'
		}
		let rs = yield db.collection('reset_password').findOne(sea)

		if(!rs) return yield next

		this.local.resetPassword = rs

		this.render('views/page/reset-password', this.local)

	} catch(e) {

		err('failed render reset-password page', e)
		this.status = 500
		this.local.error = e
		this.render('views/page/500', this.local)

	}

}

exports.resetPasswordRequestPage = function* (next) {
	//todo
	try {

		this.render('views/page/reset-password-request', this.local)

	} catch(e) {

		err('failed render reset-password page', e)
		this.status = 500
		this.local.error = e
		this.render('views/page/500', this.local)

	}

}