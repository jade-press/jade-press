
'use strict'

/**
 * catogory
 */
var _ = require('lodash')
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

exports.createResetPassword = async function (user, createBy, expire) {

	let obj = {
		_id: filters.generateId()
		,state: 'init'
		,createTime: new Date()
		,createBy: createBy
		,user: user
		,expire: filters.defaultExpire(expire)
	}

	await db.collection('reset_password').insertOne(obj)

	return Promise.resolve(obj._id)

}

exports.add = async (ctx, next) => {

	try {
		
		let body = ctx.request.body
		let bd = _.pick(body, [
			'email'
			,'name'
			,'password'
			,'group'
		])

		let validateResult = validater(bd, docs)

		if(validateResult.errCount) {
			ctx.body = {
				code: 1
				,errFields: validateResult.errFields
				,errs: validateResult.errs
			}
		}

		bd = validateResult.result

		let count = await db.collection('user').count({
			email: bd.email
		})

		if(count) return ctx.body = {
			code: 1
			,errorMsg: 'email already used'
		}

		if(body.resetPassword === 'true' || body.resetPassword === true) {
			let  rs = await exports.createResetPassword(bd, ctx.session.user)
			bd.resetPassword = rs
		}

		var insd = await db.collection('user').insertOne(bd)
		ctx.body = {
			code: 0
			,result: bd
			,res: insd
		}

	} catch(e) {

		err(e, 'add user failed')

		return ctx.body = {
			code: 1
			,errorMsg: 'add user failed:' + e
		}

	}

}

exports.del = async (ctx, next) => {

	try {
		
		let body = ctx.request.body
		let _id = body._id
		let opt = {
			_id: _id
			,type: 'user-created'
		}

		let res = await db.collection('user').deleteOne(opt)

		ctx.body = {
			code: 0
			,result: res
		}

	} catch(e) {

		err(e, 'del user failed')

		return ctx.body = {
			code: 1
			,errorMsg: 'del user failed:' + e
		}

	}
}

exports.get = async (ctx, next) => {

	try {

		let sess = ctx.session
		let user = sess.user || {}

		let body = ctx.request.body
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

		let total = await db.collection('user').count(opt)
		let res = await db.collection('user').find(opt, opt2)
		.sort(sort)
		.toArray()

		ctx.body = {
			code: 0
			,result: res
			,total: total
		}

	} catch(e) {

		err(e, 'get user failed')

		return ctx.body = {
			code: 1
			,errorMsg: 'get user failed:' + e
		}

	}

}

exports.update = async (ctx, next) => {
	
	try {

		let body = ctx.request.body
		let _id = body._id

		let ind = await db.collection('user').findOne({
			_id: _id
		})

		if(!ind) {
			return ctx.body = {
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
			var insd = await db.collection('user').updateOne({
				_id: _id
			}, { $set: res })

			ctx.body = {
				code: 0
				,result: insd
			}
		} else {
			ctx.body = {
				code: 1
				,errFields: validateResult.errFields
				,errs: validateResult.errs
			}
		}


	} catch(e) {

		err(e, 'update user failed')

		return ctx.body = {
			code: 1
			,errorMsg: 'update user failed:' + e
		}

	}
}

exports.changePassword = async (ctx, next) => {
	
	try {
	
		let body = ctx.request.body
		let _id = ctx.session.user._id
		let opt = {
			_id: _id
		}
		var pass = filters.encrypt.call({
			value: body.oldpass + ''
		})
		opt.password = pass

		let ind = await db.collection('user').findOne(opt)

		if(!ind) {
			return ctx.body = {
				code: 0
				,errorMsg: 'password not right'
			}
		}

		let cdoc = _.pick(docs, 'password')
		let validateResult = validater(body, cdoc)

		if(!validateResult.errCount) {
			let res = validateResult.result
			res.updateTime = new Date()
			var insd = await db.collection('user').updateOne({
				_id: _id
			}, { $set: res })

			ctx.body = {
				code: 0
			}
		} else {
			ctx.body = {
				code: 1
				,errFields: validateResult.errFields
				,errs: validateResult.errs
			}
		}


	} catch(e) {

		err(e, 'update user password failed')

		return ctx.body = {
			code: 1
			,errorMsg: 'update user password failed:' + e
		}

	}
}

exports.resetPassword = async (ctx, next) => {

	try {
	
		let body = ctx.request.body
		let opt = {
			_id: body.resetPassword
			,state: 'init'
		}

		let doc = _.pick(docs, 'password')
		let bd = _.pick(body, 'password')
		let validateResult = await validater(bd, doc)
		if(validateResult.errCount) {
			return ctx.body = {
				code: 1
				,errFields: validateResult.errFields
				,errs: validateResult.errs
			}
		}

		let rse = await db.collection('reset_password').findOne(opt)
		let now = new Date()

		if(!rse) {
			return ctx.body = {
				code: 0
				,errorMsg: 'resetPassword id not right'
			}
		}

		if(rse.expire < now) {
			return ctx.body = {
				code: 0
				,errorMsg: 'resetPassword id expired, please apply a new one'
			}
		}

		let obj = validateResult.result
		obj.resetPassword = ''
		let sea2 = {
			_id: rse.user._id
		}

		let ind = await db.collection('user').updateOne(sea2, {
			$set: obj
		})

		await db.collection('reset_password').updateOne({
			_id: opt._id
		}, {
			$set: {
				state: 'done'
			}
		})

		if(ctx.session.user) ctx.session.user.resetPassword = ''

		let redirect = ctx.session.redirect?ctx.session.redirect + '':ctx.local.host

		delete ctx.session.redirect

		ctx.body = {
			code: 0
			,redirect: redirect
		}

	} catch(e) {

		err(e.stack || e, 'reset user password failed')

		return ctx.body = {
			code: 1
			,errorMsg: 'reset user password failed:' + (e.stack || e)
		}

	}
}

exports.resetPasswordApply = async (ctx, next) => {

	try {
	
		let body = ctx.request.body
		let captcha = body.captcha
		let sess = ctx.session
		let scaptcha = sess.captcha

		if(captcha.toLowerCase() !== scaptcha.toLowerCase()) {
			return ctx.body = {
				code: 1
				,errorMsg: 'captcha not right'
			}
		}

		let doc = _.pick(docs, 'email')
		let bd = _.pick(body, 'email')
		let validateResult = await validater(bd, doc)
		if(validateResult.errCount) {
			return ctx.body = {
				code: 1
				,errFields: validateResult.errFields
				,errs: validateResult.errs
			}
		}

		let user = await db.collection('user').findOne(bd, {
			fields: {
				email: 1
				,name: 1
			}
		})

		if(!user) {
			return ctx.body = {
				code: 0
				,errorMsg: 'email not exists'
			}
		}

		if(!setting.mailServiceReady) {
			return ctx.body = {
				code: 0
				,errorMsg: 'email service not ready, so jadepress can not send email'
			}
		}

		let rid = await exports.createResetPassword(user, sess.user)

		let rsObj = setting.resetPasswordEmailTemplate(
			setting.mailSender 
			,body.email
			,ctx.local.host
			,rid
			,local.siteName
		)

		mail.sendMailTask(rsObj)

		ctx.body = {
			code: 0
		}

	} catch(e) {

		err(e.stack || e, 'reset user password request failed')

		return ctx.body = {
			code: 1
			,errorMsg: 'reset user password request failed:' + (e.stack || e)
		}

	}

}