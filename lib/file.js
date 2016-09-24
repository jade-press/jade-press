
'use strict'

/**
 * catogory
 */
const
_ = require('lodash')
,local = require('../app/local')
,escRegStr = require('escape-string-regexp')
,setting = require('../app/setting')
,tools = require('./tools')
,log = tools.log
,err = tools.err
,db = require('./db').db
,validater = require('s-validater').validatePromise
,types = require('s-validater').types
,docs = require('../doc/db').file
,newId = require('./meta').createDigitId
,cid = require('shortid').generate
,multiparty = require('multiparty')
,GridFSBucket = require('mongodb').GridFSBucket
,bucket = new GridFSBucket(db, {
	bucketName: 'fs'
})

exports.handleUpload = function (req) {


	return new Promise(function(resolve, reject) {

		let form = new multiparty.Form()
		let fid = cid()
		let gstream = bucket.openUploadStream('')
		gstream.id = fid

		let res = {
			_id: fid
		}

		form.on('part', function(part) {
			res.filename = part.filename
			res.byteCount = part.byteCount
			part.pipe(gstream)
		})

		gstream.once('finish', function() {
			resolve(res)
		})

		form.parse(req)

	})	

}

function getExt(filename) {
	let arr = filename.split('.')
	let len = arr.length
	return len > 1?arr[len - 1]:''
}

exports.upload = function *(next) {

	try {

		let path = this.path
		let user = this.session.user || {}
		user = _.pick(user, ['_id', 'name', 'email'])

		let fobj = yield exports.handleUpload(this.req)
		let sea = {
			_id: fobj._id
		}

		let obj = {
			filename: fobj.filename
			,byteCount: fobj.byteCount
			,ext: getExt(fobj.filename)
			,createBy: user
			,createTime: new Date()
		}
		
		let indb = yield db.collection('fs.files').findOneAndUpdate(sea, {
			$set: obj
		}, {
			returnOriginal: true
		})
		
		this.body = {
			code: 0
			,result: {
				_id: fobj._id
				,filename: fobj.filename
				,ext: obj.ext
				,md5: indb.value.md5
			}
		}

	} catch(e) {

		err(e.stack || e, 'upload file failed')

		return this.body = {
			code: 1
			,errorMsg: 'upload file failed:' + e
		}

	}

}

exports.del = function* (next) {

	try {
		
		let body = this.request.body
		let _id = body._id
		let opt = {
			_id: _id
		}

		let indb = yield db.collection('fs.files').count(opt)

		if(!indb) return this.body = {
			code: 1
			,errorMsg: 'file not exist'
		}

		let res = yield bucket.delete(_id)
		let res1 = yield exports.removeFileFromPost(_id)

		this.body = {
			code: 0
			,result: res
			,res: res1
		}

	} catch(e) {

		err(e, 'del file failed')

		return this.body = {
			code: 1
			,errorMsg: 'del file failed:' + e
		}

	}

}

exports.get = function* (next) {

	try {

		let sess = this.session
		let user = sess.user || {}

		let body = this.query
		let _id = body._id
		let name = body.name
		let md5 = body.md5
		let page = parseInt(body.page, 10) || 1
		let pageSize = parseInt(body.pageSize, 10) || 500
		let fields = body.fields

		let opt1 = {}

		if(_id) opt1._id = _id
		if(md5) opt1.md5 = md5
		if(name) opt1.filename = new RegExp(escRegStr(name))

		let opt2 = {
			skip: (page - 1) * pageSize
			,limit: pageSize
		}

		if(fields) opt2.fields = fields

		let sort = {
			createTime: -1
		}

		let total = yield db.collection('fs.files').count(opt1)
		let res = yield db.collection('fs.files').find(opt1, opt2)
		.sort(sort)
		.toArray()

		this.body = {
			code: 0
			,result: res
			,total: total
		}

	} catch(e) {

		err(e, 'get file failed')

		return this.body = {
			code: 1
			,errorMsg: 'get file failed:' + e
		}

	}

}

exports.file = function* (next) {

	try {
		let params = this.params
		,file = params.file

		if(!file) {
			return yield next
		}

		let arr = file.split('.')
		,len = arr.length

		if(len !== 2) {
			return yield next
		}

		let id = arr[0]
		let ext = arr[1]

		let indb = yield db.collection('fs.files').findOne({
			_id: id
		})

		if(!indb) {
			return yield next
		}

		//todo: anti leech
		let stream = bucket.openDownloadStream(id)

		this.type = '.' + ext
		this.body = stream

	} catch(e) {

		err(e.stack || e, 'get file fail')
		this.status = 500
		this.body = '500'

	}

	//end
}

exports.removeFileFromPost = function* (id) {

	let sea = {
		'files._id': id
	}
	let sea1 = {
		'featuredFile._id': id
	}

	let rm = {
		$pull: {
			files: {
				_id: id
			}
		}
	}
	let rm1 = {
		$set: {
			featuredFile: {}
		}
	}
	yield db.collection('post').updateMany(sea1, rm1)
	return db.collection('post').updateMany(sea, rm)

}