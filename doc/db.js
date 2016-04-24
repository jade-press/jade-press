/*
 * jadepress
 * database design document
 *
 */
 
'use strict'

const fs = require('fs')
let dbs = fs.readdirSync(__dirname + '/db')

exports.collections = dbs.map(function(currentValue, index, array) {

	let name = currentValue.replace(/\.js$/, '')
	exports[name] = require(__dirname + '/db/' + currentValue)
	return name

})


