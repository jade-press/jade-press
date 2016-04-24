
'use strict'

let
_ = require('lodash')
,local = require('../app/local')
,setting = require('../app/setting')
,tools = require('./tools')
,log = tools.log
,err = tools.err
,db = require('./db').db
,doc = require('../doc/db/user')
,validater = require('s-validater').validate

exports.logout = function* (next) {

	var query = this.query
	,sess = this.session

	if(sess.user) {
		this.session = null
	}

	this.redirect(query.redirect || '/login')

}

exports.login = function* (next) {

	try {

		let body = this.request.body
		let sess = this.session
		let errCount = sess.errCount || 0
		let props = ['email', 'password']
		let rules = _.pick(doc, props)

		if(errCount >= 3) rules.captcha = {
			type: 'string'
			,minLen: 1
			,maxLen: 10
		}
		
		let validateResult = validater(body, rules)
		if(validateResult.errCount) {
			return this.body = {
				code: 1
				,errFields: validateResult.errFields
				,errs: validateResult.errs
				,errCount: sess.errCount
			}
		}

		if( 
			sess.errCount && 
			sess.errCount > 2 && 
			(body.captcha.toLowerCase() !== sess.captcha.toLowerCase()) 
		) {
			sess.errCount = sess.errCount? (sess.errCount + 1) : 1
			return this.body = {
				code: 1
				,errorMsg: 'captcha not right'
				,errorField: 'captcha'
				,errCount: sess.errCount
			}
		}

		let sea = {
			email: body.email
			,password: validateResult.result.password
		}
		let user = yield db.collection('user').findOne(sea)

		if(!user) {
			sess.errCount = sess.errCount? (sess.errCount + 1) : 1
			return this.body = {
				code: 1
				,errorMsg: 'email or password not right'
				,errorField: 'id'
				,errCount: sess.errCount
			}
		}

		user = _.pick(user, ['_id', 'id', 'name', 'email', 'group'])
		sess.user = user

		sess.errCount = 0

		var redirect = this.local.host + '/admin/main'

		if(sess.redirect) {
			redirect = this.local.host + sess.redirect
			sess.redirect = ''
		}

		this.body = {
			code: 0
			,redirect: redirect
		}

	}
	catch(e) {

		err(e, 'login fail')
		let sess = this.session
		sess.errCount = sess.errCount? (sess.errCount + 1) : 1
		
		return this.body = {
			code: 1
			,errorMsg: 'login fail:' + e
			,errCount: sess.errCount
		}

	}

	//end
}