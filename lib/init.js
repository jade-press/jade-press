

'use strict'

let
_ = require('lodash')
,local = require('../app/local')
,setting = require('../app/setting')
,tools = require('./tools')
,styleParser = tools.parseStylus
,jadeParser = tools.parseJade
,log = tools.log
,err = tools.err
,dbRef = require('./db')
,db = dbRef.db
,filters = require('./filters')
,meta = require('./meta')
,newId = meta.createDigitId
,api = require('../doc/api')

const cid = require('shortid').generate

exports.init = function* (initOptions) {
	let userId = cid()
	yield exports.initMeta()
	yield exports.initOptions()
	let defaultGroup = yield exports.initGroup()
	let defaultCat = yield exports.initCat()
	let resetPassword = yield exports.initResetPassword(userId)
	let opts = {
		group: defaultGroup
		,pass: initOptions.password
		,email: initOptions.email
		,resetPassword: resetPassword
	}
	let user = yield exports.initUser(opts, userId)
	yield exports.initPost(defaultCat, user)

	return Promise.resolve()

}

exports.initOptions = function* () {
	return Promise.resolve()
}

exports.initMeta = function* () {
	return db.collection('meta').insertOne({
		name: 'digitId'
		,value: 100000
		,_id: '_digitId'
	})
}

exports.initResetPassword = function*(userId) {
	let dt = new Date()
	let oneyear = 365 * 24 * 60 * 60 * 1000
	let rs = {
		_id: cid()
		,state: 'init'
		,expire: filters.defaultExpire(oneyear)
		,createTime: dt
		,createBy: {}
		,user: {
			_id: userId
		}
	}
	yield db.collection('reset_password').insertOne(rs)
	return Promise.resolve(rs._id)
}

exports.initUser = function* (option, _id) {

	let pass = filters.encrypt.call({ value: option.pass })
	
	let date = new Date()
	
	let user = {
		_id: _id
		,name: 'admin'
		,password: pass
		,email: option.email
		,createTime: date
		,updateTime: date
		,group: option.group
		,resetPassword: option.resetPassword
	}

	yield db.collection('user').insertOne(user)

	let cuser = _.pick(user, [
		'_id'
		,'name'
		,'email'
		,'group'
	])

	return Promise.resolve(cuser)

}

exports.initCat = function* () {

	let did = yield newId()
	let did1 = yield newId()
	let _id = cid()
	let _id1 = cid()
	let date = new Date()
	let date1 = new Date()
	
	let root = {
		_id: '__root_cat'
		,id: did
		,name: 'root'
		,slug: 'root'
		,desc: 'root category'
		,parentId: ''
		,parentIdTree: ''
		,parentNameTree: ''
		,createTime: date
		,updateTime: date
		,createBy: {
			name: 'app'
		}
	}

	let defaultCat = {
		_id: '__default_cat'
		,id: did1
		,name: 'default'
		,slug: 'default'
		,desc: 'default category'
		,parentId: '__root_cat'
		,parentIdTree: '__root_cat,__default_cat'
		,parentNameTree: root.name + ',default'
		,createTime: date1
		,updateTime: date1
		,createBy: {
			name: 'app'
		}
	}

	yield db.collection('cat').insertOne(root)
	yield db.collection('cat').insertOne(defaultCat)
	return Promise.resolve(defaultCat)

}

exports.initGroup = function* () {

	let did = yield newId()
	let date = new Date()
	let urls = api.accessUrlsControlled

	let editorUrls = _.filter(urls, function(url) {
		return url.indexOf('/post/') > -1 ||
					 url.indexOf('/page/') > -1 ||
					 url.indexOf('/cat/') > -1 ||
					 url.indexOf('/file/') > -1
	})
	
	let writerUrls = [
		'/api/post/add'
		,'/api/post/del-self'
		,'/api/post/update-self'
		,'/api/post/get'
		,'/api/file/get'
		,'/api/file/add'
		,'/api/cat/get'
		,'/admin/main'
		,'/admin/post'
	]

	var arr = [
		{
	
			_id: cid()
			,name: 'admin'
			,desc: 'admin user can access all urls'
			,createTime: date
			,updateTime: date
			,access: urls
			,type: 'built-in'
	
		}
		,{
	
			_id: cid()
			,name: 'editor'
			,desc: 'editor can edit post, page, and category'
			,createTime: date
			,updateTime: date
			,access: editorUrls
			,type: 'built-in'
	
		}
		,{
	
			_id: cid()
			,name: 'writer'
			,desc: 'writer can write new post, and edit own post'
			,createTime: date
			,updateTime: date
			,access: writerUrls
			,type: 'built-in'
	
		}	
	]

	yield db.collection('group').insertMany(arr)
	return Promise.resolve(arr[0])

}

exports.initPost = function *(cat, user) {

	let _id = cid()
	let id = yield newId()
	let title = 'hello, jadepress!'
	let slug = 'hello-slug'
	let tags = 'hello, jadepress'
	let desc = 'the very first post'
	let content = '' +
`h3 welcome
hr
p  this is a test post
ul
	li list item 1
	li list item 2
.p-y-1
h3 code
hr
pre.prettyprint(lang='javascript').
	//some js
	exports.types = {
		date: _.isDate
		,object: _.isPlainObject
		,number: _.isNumber
		,array: _.isArray
		,string: _.isString
		,boolean: _.isBoolean
	}
.p-y-1
pre.prettyprint(lang='css').
	.m-r-1 {
		margin-right: 1rem!important;
	}
	.pagination {
		display: inline-block;
		padding-left: 0;
		margin-top: 1rem;
		margin-bottom: 1rem;
		border-radius: .25rem;
	}

	.page-item {
		display: inline;
	}

	.page-item:first-child .page-link {
		margin-left: 0;
		border-top-left-radius: .25rem;
		border-bottom-left-radius: .25rem;
	}

	.page-item:last-child .page-link {
		border-top-right-radius: .25rem;
		border-bottom-right-radius: .25rem;
	}
`

	let html = yield jadeParser(content, {})
	let style = ''
	let css = ''
	let script = ''
	let cats = [cat]
	let visit = 0
	let createBy = user
	let meta = {}
	let dt = new Date()

	yield db.collection('post').insertOne({
		_id: _id
		,id: id
		,title: title
		,slug: slug
		,tags: tags
		,desc: desc
		,content: content
		,html: html
		,style: style
		,css: css
		,script: script
		,cats: cats
		,files: []
		,featuredFile: {}
		,meta: meta
		,visit: visit
		,createBy: user
		,createTime: dt
		,updateTime: dt
		,published: true
	})

	return Promise.resolve()


}




