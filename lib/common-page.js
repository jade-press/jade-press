
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

exports.login = async (ctx, next) => {

	try {

		if(ctx.session.user) return ctx.redirect('/admin/main')
		ctx.render('views/page/login', ctx.local)

	} catch(e) {

		err('failed render admin page', e)
		ctx.status = 500
		ctx.local.error = e
		ctx.render('views/page/500', ctx.local)

	}

}

exports.admin = async (ctx, next) => {

	try {

		let params = ctx.params
		let page = params.page
		let user = ctx.session.user

		if(!user) return ctx.redirect('/login')

		//check should reset password or not
		if(user.resetPassword) {
			ctx.session.redirect = ctx.path
			return ctx.redirect('/reset-password/' + user.resetPassword)
		}
			
		let path = ctx.path
		ctx.local.user = user
		ctx.local.links = getLinks(user)
		if(
			path.indexOf('page') > -1 ||
			path.indexOf('post') > -1
		) ctx.local.publicRoute = setting.publicRoute

		else if(path.indexOf('group') > -1) ctx.local.accesses = accesses

		ctx.render('views/admin/' + page, ctx.local)

	} catch(e) {

		err('failed render admin page', e)
		ctx.status = 500
		ctx.local.error = e
		ctx.render('views/page/500', ctx.local)

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

exports.resetPasswordPage = async (ctx, next) => {
	//todo
	try {

		let params = ctx.params
		let id = params.id
		if(!id) return await next

		let sea = {
			_id: id
			,state: 'init'
		}
		let rs = await db.collection('reset_password').findOne(sea)

		if(!rs) return await next

		ctx.local.resetPassword = rs

		ctx.render('views/page/reset-password', ctx.local)

	} catch(e) {

		err('failed render reset-password page', e)
		ctx.status = 500
		ctx.local.error = e
		ctx.render('views/page/500', ctx.local)

	}

}

exports.resetPasswordRequestPage = async (ctx, next) => {
	//todo
	try {

		ctx.render('views/page/reset-password-request', ctx.local)

	} catch(e) {

		err('failed render reset-password page', e)
		ctx.status = 500
		ctx.local.error = e
		ctx.render('views/page/500', ctx.local)

	}

}