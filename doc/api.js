/*
 * jadepress
 * api design document
 *
 */
 
'use strict'

const fs = require('fs')
let dbs = fs.readdirSync(__dirname + '/api')
let _ = require('lodash')

exports.accesses = []
exports.accessUrls = []

dbs.map(function(currentValue, index, array) {

	let name = currentValue.replace(/\.js$/, '')
	let obj = require(__dirname + '/api/' + currentValue)
	let keys = _.keysIn(obj)
	let values = _.valuesIn(obj)
	exports.accessUrls = exports.accessUrls.concat(keys)
	exports.accesses = exports.accesses.concat(values)
	return name

})

exports.accessUrlsControlled = exports.accessUrls.filter(function(v) {
	return v.indexOf('/admin/') > -1 || v.indexOf('/api/') > -1
})

exports.accessesControlled = exports.accesses.filter(function(v) {
	return v.url.indexOf('/admin/') > -1 || v.url.indexOf('/api/') > -1
})
