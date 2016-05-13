
'use strict'

let fs = require('fs')
,path = require('path')
,tools = require('./tools')
,setting = require('../app/setting')
,log = tools.log
,err = tools.err
,debug = tools.debug
,_ = require('lodash')

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
		debug(e.stack)
		debug(moduleName, 'has no plugin entrance')
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
		extend(exports.plugins, obj)
	})

}

function extend(plugins, plugin) {
	_.each(plugin, function(value, key) {
		if(!plugins[key]) plugins[key] = []
		plugins[key].push(value)
	})
}