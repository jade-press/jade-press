/*
 * jadepress
 * api design document
 *
 */
 
'use strict'

const publicRoute = require('../app/setting').publicRoute

exports[publicRoute.home] = {
	url: publicRoute.home
	,method: 'get'
	,name: 'home page'
	,desc: ''
	,lib: 'route/public-page'
	,func: 'home'
}

exports['/s'] = {
	url: '/s'
	,method: 'get'
	,name: 'search'
	,desc: ''
	,lib: 'route/public-page'
	,func: 'search'
}

exports[publicRoute.cat] = {
	url: publicRoute.cat
	,method: 'get'
	,name: 'category page'
	,desc: ''
	,lib: 'route/public-page'
	,func: 'cat'
}

exports[publicRoute.post] = {
	url: publicRoute.post
	,method: 'get'
	,name: 'single post page'
	,desc: ''
	,lib: 'route/public-page'
	,func: 'post'
}

exports.loadOrder = [publicRoute.home, '/s', publicRoute.cat, publicRoute.post]

exports.apis = exports.loadOrder.map(function(v) {
	return exports[v]
})