
'use strict'

/**
 * catogory
 */
const
_ = require('lodash')
,local = require('../app/local')
,setting = require('../app/setting')
,tools = require('./tools')
,time = require('../lib/time')
,log = tools.log
,err = tools.err
,db = require('./db').db
,validater = require('s-validater').validate
,docs = require('../doc/db').user
,filters = require('./filters')
,escRegStr = require('escape-string-regexp')
,mail = require('./mail')

exports.createResetPassword = function* (user, createBy, expire) {

	let obj = {
		_id: filters.generateId()
		,state: 'init'
		,createTime: new Date()
		,createBy: createBy
		,user: user
		,expire: filters.defaultExpire(expire)
	}

	yield db.collection('reset_password').insertOne(obj)

	return Promise.resolve(obj._id)

}

exports.add = function* (next) {

	try {
		
		let body = this.request.body
		let bd = _.pick(body, [
			'email'
			,'name'
			,'password'
			,'group'
		])

		let validateResult = validater(bd, docs)

		if(validateResult.errCount) {
			this.body = {
				code: 1
				,errFields: validateResult.errFields
				,errs: validateResult.errs
			}
		}

		bd = validateResult.result

		let count = yield db.collection('user').count({
			email: bd.email
		})

		if(count) return this.body = {
			code: 1
			,errorMsg: 'email already used'
		}

		if(body.resetPassword === 'true' || body.resetPassword === true) {
			let  rs = yield exports.createResetPassword(bd, this.session.user)
			bd.resetPassword = rs
		}

		let insd = yield db.collection('user').insertOne(bd)
		this.body = {
			code: 0
			,result: bd
			,res: insd
		}

	} catch(e) {

		err(e, 'add user failed')

		return this.body = {
			code: 1
			,errorMsg: 'add user failed:' + e
		}

	}

}

exports.del = function* (next) {

	try {
		
		let body = this.request.body
		let _id = body._id
		let opt = {
			_id: _id
			,type: 'user-created'
		}

		let res = yield db.collection('user').deleteOne(opt)

		this.body = {
			code: 0
			,result: res
		}

	} catch(e) {

		err(e, 'del user failed')

		return this.body = {
			code: 1
			,errorMsg: 'del user failed:' + e
		}

	}
}

exports.get = function* (next) {

	try {

		let sess = this.session
		let user = sess.user || {}

		let body = this.request.body
		let name = body.name
		let email = body.email
		let page = parseInt(body.page, 10) || 1
		let pageSize = parseInt(body.pageSize, 10) || 500
		let fields = body.fields
		let gId = body.groupId
		let opt = {}

		if(name) opt.name = new RegExp(escRegStr(name))
		if(email) opt.email = new RegExp(escRegStr(email))
		if(gId) opt['group._id'] = gId

		let opt2 = {
			skip: (page - 1) * pageSize
			,limit: pageSize
		}
		if(fields) opt2.fields = fields
		let sort = {
			createTime: -1
		}

		let total = yield db.collection('user').count(opt)
		let res = yield db.collection('user').find(opt, opt2)
		.sort(sort)
		.toArray()

		this.body = {
			code: 0
			,result: res
			,total: total
		}

	} catch(e) {

		err(e, 'get user failed')

		return this.body = {
			code: 1
			,errorMsg: 'get user failed:' + e
		}

	}

}

exports.update = function* (next) {
	
	try {

		let body = this.request.body
		let _id = body._id

		let ind = yield db.collection('user').findOne({
			_id: _id
		})

		if(!ind) {
			return this.body = {
				code: 0
				,errorMsg: 'user not exists'
			}
		}

		let keys = [
			'name'
			,'password'
			,'email'
			,'group'
		]

		body = _.pick(body, keys)

		let cdoc = _.pick(docs, Object.keys(body))

		let validateResult = validater(body, cdoc)

		if(!validateResult.errCount) {
			let res = validateResult.result
			res.updateTime = new Date()
			let insd = yield db.collection('user').updateOne({
				_id: _id
			}, { $set: res })

			this.body = {
				code: 0
				,result: insd
			}
		} else {
			this.body = {
				code: 1
				,errFields: validateResult.errFields
				,errs: validateResult.errs
			}
		}


	} catch(e) {

		err(e, 'update user failed')

		return this.body = {
			code: 1
			,errorMsg: 'update user failed:' + e
		}

	}
}

exports.changePassword = function* (next) {
	
	try {
	
		let body = this.request.body
		let _id = this.session.user._id
		let opt = {
			_id: _id
		}
		let pass = filters.encrypt.call({
			value: body.oldpass + ''
		})
		opt.password = pass

		let ind = yield db.collection('user').findOne(opt)

		if(!ind) {
			return this.body = {
				code: 0
				,errorMsg: 'password not right'
			}
		}

		let cdoc = _.pick(docs, 'password')
		let validateResult = validater(body, cdoc)

		if(!validateResult.errCount) {
			let res = validateResult.result
			res.updateTime = new Date()
			let insd = yield db.collection('user').updateOne({
				_id: _id
			}, { $set: res })

			this.body = {
				code: 0
			}
		} else {
			this.body = {
				code: 1
				,errFields: validateResult.errFields
				,errs: validateResult.errs
			}
		}


	} catch(e) {

		err(e, 'update user password failed')

		return this.body = {
			code: 1
			,errorMsg: 'update user password failed:' + e
		}

	}
}

exports.resetPassword = function* (next) {

	try {
	
		let body = this.request.body
		let opt = {
			_id: body.resetPassword
			,state: 'init'
		}

		let doc = _.pick(docs, 'password')
		let bd = _.pick(body, 'password')
		let validateResult = yield validater(bd, doc)
		if(validateResult.errCount) {
			return this.body = {
				code: 1
				,errFields: validateResult.errFields
				,errs: validateResult.errs
			}
		}

		let rse = yield db.collection('reset_password').findOne(opt)
		let now = new Date()

		if(!rse) {
			return this.body = {
				code: 0
				,errorMsg: 'resetPassword id not right'
			}
		}

		if(rse.expire < now) {
			return this.body = {
				code: 0
				,errorMsg: 'resetPassword id expired, please apply a new one'
			}
		}

		let obj = validateResult.result
		obj.resetPassword = ''
		let sea2 = {
			_id: rse.user._id
		}

		let ind = yield db.collection('user').updateOne(sea2, {
			$set: obj
		})

		yield db.collection('reset_password').updateOne({
			_id: opt._id
		}, {
			$set: {
				state: 'done'
			}
		})

		if(this.session.user) this.session.user.resetPassword = ''

		let redirect = this.session.redirect?this.session.redirect + '':this.local.host

		delete this.session.redirect

		this.body = {
			code: 0
			,redirect: redirect
		}

	} catch(e) {

		err(e.stack || e, 'reset user password failed')

		return this.body = {
			code: 1
			,errorMsg: 'reset user password failed:' + (e.stack || e)
		}

	}
}

exports.resetPasswordApply = function* (next) {

	try {
	
		let body = this.request.body
		let captcha = body.captcha
		let sess = this.session
		let scaptcha = sess.captcha

		if(captcha.toLowerCase() !== scaptcha.toLowerCase()) {
			return this.body = {
				code: 1
				,errorMsg: 'captcha not right'
			}
		}

		let doc = _.pick(docs, 'email')
		let bd = _.pick(body, 'email')
		let validateResult = yield validater(bd, doc)
		if(validateResult.errCount) {
			return this.body = {
				code: 1
				,errFields: validateResult.errFields
				,errs: validateResult.errs
			}
		}

		let user = yield db.collection('user').findOne(bd, {
			fields: {
				email: 1
				,name: 1
			}
		})

		if(!user) {
			return this.body = {
				code: 0
				,errorMsg: 'email not exists'
			}
		}

		if(!setting.mailServiceReady) {
			return this.body = {
				code: 0
				,errorMsg: 'email service not ready, so jadepress can not send email'
			}
		}

		let rid = yield exports.createResetPassword(user, sess.user)

		let rsObj = setting.resetPasswordEmailTemplate(
			setting.mailSender 
			,body.email
			,this.local.host
			,rid
			,local.siteName
		)

		mail.sendMailTask(rsObj)

		this.body = {
			code: 0
		}

	} catch(e) {

		err(e.stack || e, 'reset user password request failed')

		return this.body = {
			code: 1
			,errorMsg: 'reset user password request failed:' + (e.stack || e)
		}

	}

}