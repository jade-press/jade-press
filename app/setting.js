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

	//plugins
	,plugins: {}

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
	,maxFilesSize: 200000 * 1024
	,pageSize: 20

	/* mail server info
	,mailSender: {
		name: 'your-sender-name'
		,address: 'your-email-service@your-mail-service.com'
	}
	,mailServer: {
		service: 'Gmail'
		,auth: {
				user: 'your@email.com'
				,pass: 'your password'
		}
	}
	*/

	,resetPasswordEmailTemplate: function(from, to, _host, rid, siteName) {

		let id0 = rid
		let host = _host
		let html = '<h1>reset passord (' + siteName + ')</h1>' +
		'<hr />' +
		'<p>a request has been sent to our server to change "' + to + '" corresponding password，so we sended this email. </p>' +
		'<p>if you did not send the request, just ignore this email.</p>' +
		'<p>you can click the link below to reset your password.</p>' + 
		'<p><a target="_blank" href="' + host + '/reset-password/' + id0 + '">' + host + '/reset-password/' + id0 + '</a></p>' +

		'<p>please be aware that this link will expire in 48 hour since you send the request.</p>' +
		'<p></p>' +
		'<p></p>' +
		'<p>--from ' + siteName + '</p>'

		return {
			from: from
			,to: to
			,subject: 'reset password[' + siteName + ']'
			,html: html
		}
	}

}

,config = require('../config')

module.exports = Object.assign(setting, config.setting)