//local setting

'use strict'


let _ = require('lodash')
let packageInfo = require('../package.json')
let sid = require('shortid')
let resolve = require('path').resolve
let fs = require('fs')
let path = require('path')
let cols = fs.readdirSync( path.resolve(__dirname, '../doc/db') ).map(function(v) {
	return v.replace(/\.js$/, '')
})

let setting = {

	mongoStoreOptions: {

		//mongo session store
		url: 'mongodb://127.0.0.1:27017/sessions'

	}

	//mongodb url
	,dbLink: 'mongodb://127.0.0.1:27017/jadepress'

	//theme
	,theme: 'jadepress-theme-pi'

	//use public cdn or not
	,usePublicCdn: false

	//db
	,publicRoute: {
		home: '/'
		,cat: '/cat/:slug'
		,post: '/:catSlug/:slug'
	}

	//secret
	,secret: 'szdd345fef3dsdsfer23dv1ebdasdl'
	,logOn: true

	,captchaOptions: {
		font: '26px Unifont'
	}

	,dbCols: cols
	,sessionName: 'jdp'
	,maxFilesSize: 2000 * 1024
	,pageSize: 20
	
}

,config = require('../config')

module.exports = Object.assign(setting, config.setting)