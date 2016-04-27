/**
 * option
 */


'use strict'

var _ = require('lodash')
,local = require('../app/local')
,setting = require('../app/setting')
,tools = require('./tools')
,log = tools.log
,err = tools.err
,db = require('./db').db
,validate = require('s-validater').validate
,docs = require('../doc/db').option
,v8 = require('v8')
,os = require('os')

exports._add = function* (_body) {
		
	var body = _body

	var id = body._id

	if(!id || !_.isString(id)) return Promise.resolve({
		code: 1
		,errorMsg: '_id not right'
	})

	let ind = yield db.collection('option').findOne({
		_id: body._id
	})

	if(ind) return Promise.resolve({
		code: 1
		,errorMsg: '_id hasTaken, use another one'
	})

	let validateResult = validate(body, docs)

	if(!validateResult.errCount) {
		body = validateResult.result
		let res = yield db.collection('option').insertOne(body)
		return Promise.resolve({
			code: 0
			,res: res
			,result: body
		})
	} else {
		return Promise.resolve({
			code: 1
			,errFields: validateResult.errFields
			,errs: validateResult.errs
		})
	}

}

exports._del = function* (_body) {

	let body = _body
	let _id = body._id
	let opt = {
		_id: _id
	}

	res = yield db.collection('option').deleteOne(opt)

	return Promise.resolve({
		code: 0
		,result: res
	})

}

exports.get = function* (next) {

	try {

		let sess = this.session
		let user = sess.user || {}

		let body = this.request.body
		let id = body.id
		let name = body.name

		let opt = {}

		if(id) opt.id = id
		if(name) opt.name = new RegExp(name)

		let res = yield db.collection('option').find(opt)
		.toArray()

		this.body = {
			code: 0
			,result: res
		}

	} catch(e) {

		err(e, 'get cat failed')

		return this.body = {
			code: 1
			,errorMsg: 'get cat failed:' + e
		}

	}

}

exports.update = function* (next) {
	
	try {
		
		let body = this.request.body

		let _id = body._id

		let ind = yield db.collection('option').findOne({
			_id: _id
		})

		if(!ind) {
			return this.body = {
				code: 0
				,errorMsg: 'option not exists'
			}
		}

		_.extend(ind, body)
		ind.updateTime = new Date()
		let validateResult = validate(body, docs)

		if(!validateResult.errCount) {
			let res = _.extend({}, validateResult.result)
			delete res._id
			var insd = yield db.collection('option').updateOne({
				_id: _id
			}, { $set: res })

			this.body = {
				code: 0
				,res: insd
				,result: validateResult.result
			}
		} else {
			this.body = {
				code: 1
				,errFields: validateResult.errFields
				,errs: validateResult.errs
			}
		}


	} catch(e) {

		err(e, 'update option failed')

		return this.body = {
			code: 1
			,errorMsg: 'update option failed:' + e
		}

	}
}


exports.getSystemInfo = function* (next) {

	this.body = {
		code: 0
		,result: {
			os: {
				EOL: os.EOL
				,arch: os.arch()
				,cpus: os.cpus()
				,endianness: os.endianness()
				,freemem: os.freemem()
				//,homedir: os.homedir()
				,hostname: os.hostname()
				,loadavg: os.loadavg()
				,networkInterfaces: os.networkInterfaces()
				,platform: os.platform()
				,release: os.release()
				//os.tmpdir()
				,totalmem: os.totalmem()
				,type: os.type()
				,uptime: os.uptime()
			}
			,v8: v8.getHeapStatistics()
			,process: {
				memoryUsage: process.memoryUsage()
				,release: process.release
				,versions: process.versions
			}
		}
	}

}