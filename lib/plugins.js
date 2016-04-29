
'use strict'

let fs = require('fs')
let path = require('path')
let tools = require('./tools')
let setting = require('../app/setting')
let log = tools.log
let err = tools.err

exports.plugins = {}

exports.loadPlugin = function(moduleName) {

	let modulePath = /^\//.test(moduleName)?
										moduleName + '/plugins/index.js'
										:
										process.cwd() + '/node_modules/' + moduleName + '/plugins/index.js'

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

	var modules = Object.keys(setting.plugins)

	//dir as theme
	if(setting.theme.name) modules.push(setting.theme.path)

	modules
	.map(exports.loadPlugin)
	.sort(function(a, b) {
		return a.priority > b.priority?-1:1
	})
	.forEach(function(obj) {
		Object.assign(exports.plugins, obj)
	})

}