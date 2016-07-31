/*
filters
*/

'use strict'

const
crypto = require('crypto')
let setting = require('../app/setting')
let cid = require('shortid').generate
,db = require('./db').db
,accesses = require('../doc/api').accessUrls
,time = require('./time')
,_ = require('lodash')
,meta = require('./meta')

//defaults
exports.emptyString = function() {
	return ''
}

exports.newDate = function() {
	return new Date()
}

exports.generateId = function() {
	return cid()
}

//2 days expire
exports.defaultExpire = function(expire) {
	return time(expire || 2 * 24 * 60 * 60 * 1000).t
}

//custom validate
exports.validateAccess = function() {
	let v = this.value
	if(!_.isArray(v) || v.length < 1) return false

	for(let i = 0, len = v.length;i < len;i ++) {
		let url = v[i]
		if(_.indexOf(accesses, url) === -1) {
			return false
		}
	}
	return true
}

exports.inRange = function() {
	return this.rule.range.join(',').indexOf(this.value) > -1 && this.value.indexOf(',') === -1
}

exports.encrypt = function() {

	const secret = setting.secret
	const cipher = crypto.createCipher('RC4', secret)
	let encrypted = cipher.update(this.value, 'utf8', 'hex')
	encrypted += cipher.final('hex')

	return encrypted

}

//defaults
exports.emptyStringPromise = function* () {
	return Promise.resolve('')
}

exports.defaultPostSlugPromise = function* () {
	return Promise.resolve('post-' + cid())
}

exports.defaultCatSlugPromise = function* () {
	return Promise.resolve('cat-' + cid())
}

exports.titleAsTagsPromise = function* () {
	return Promise.resolve(this.targetObj.title)
}

exports.defaultParentCatIdPromise = function* () {
	return Promise.resolve('__root_cat')
}

exports.defaultParentCatIdTreePromise = function* () {
	let cat = yield db.collection('cat').findOne({
		_id: '__root_cat'
	})
	return Promise.resolve(cat._id + ',' + this.targetObj._id)
}

exports.validateCatsPromise = function* () {
	let arr = this.value
	if(!_.isArray(arr) || !arr.length) return Promise.resolve(false)
	return Promise.resolve(true)
}

exports.defaultParentCatPromise = function* () {
	return db.collection('cat').findOne({
		_id: '__root_cat'
	})
}

exports.defaultCatPromise = function* () {
	let cat = yield db.collection('cat').findOne({
		_id: '__default_cat'
	})
	return [cat]
}

exports.defaultParentCatNameTreePromise = function* () {
	let cat = yield db.collection('cat').findOne({
		_id: '__root_cat'
	})
	return Promise.resolve(cat.name + ',' + this.targetObj.name)
}

exports.newDatePromise = function* () {
	return Promise.resolve(new Date())
}

exports.generateIdPromise = function* () {
	return Promise.resolve(cid())
}

exports.generateDigitalIdPromise = function* () {
	let id = yield meta.createDigitId()
	return Promise.resolve(id)
}

exports.inRangePromise = function* () {
	return Promise.resolve(this.rule.range.join(',').indexOf(this.value) > -1 && this.value.indexOf(',') === -1)
}

exports.encryptPromise = function* () {

	const secret = setting.secret
	const cipher = crypto.createCipher('RC4', secret)
	let encrypted = cipher.update(this.value, 'utf8', 'hex')
	encrypted += cipher.final('hex')

	return Promise.resolve(encrypted)

}
