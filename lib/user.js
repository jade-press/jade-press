
'use strict'

/**
 * catogory
 */
var _ = require('lodash')
,local = require('../app/local')
,setting = require('../app/setting')
,tools = require('./tools')
,time = require('../lib/time').date
,log = tools.log
,err = tools.err
,db = require('./db').db
,validater = require('s-validater').validate
,docs = require('../doc/db').user
,filters = require('./filters')
,escRegStr = require('escape-string-regexp')

exports.add = function* (next) {

	try {
		
		let body = this.request.body
		body = _.pick(body, [
			'email'
			,'name'
			,'password'
			,'group'
		])

		let validateResult = validater(body, docs)

		if(!validateResult.errCount) {
			body = validateResult.result
			var insd = yield db.collection('user').insertOne(body)
			this.body = {
				code: 0
				,result: body
				,res: insd
			}
		} else {
			this.body = {
				code: 1
				,errFields: validateResult.errFields
				,errs: validateResult.errs
			}
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

		res = yield db.collection('user').deleteOne(opt)

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
			var insd = yield db.collection('user').updateOne({
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
		var pass = filters.encrypt.call({
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
			var insd = yield db.collection('user').updateOne({
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