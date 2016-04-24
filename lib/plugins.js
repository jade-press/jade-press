
'use strict'

let fs = require('fs')
let path = require('path')
let tools = require('./tools')
let log = tools.log
let err = tools.err

exports.plugins = {}

exports.loadPlugin = function(moduleName) {

	let modulePath = path.resolve(__dirname, '../node_modules/' + moduleName + '/plugins/index.js')

	try {

		let res = fs.accessSync(modulePath)
		let plugin = require(modulePath)
		log('plugin:', moduleName, 'loaded')
		return plugin
		
	} catch(e) {
		log(e.stack)
		log(moduleName, 'has no plugin entrance')
		return {
			priority: 10000000
		}
	}
}


exports.loadPlugins = function() {

	var modules = Object.keys(require('../package.json').dependencies)
	.filter(function(m) {
		return m.indexOf('jadepress') > -1
	})
	.map(exports.loadPlugin)
	.sort(function(a, b) {
		return a.priority > b.priority?-1:1
	})
	.forEach(function(obj) {
		Object.assign(exports.plugins, obj)
	})

}