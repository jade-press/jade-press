var 
_ = require('lodash')
,packageInfo = require('../package.json')
,sid = require('shortid')
,resolve = require('path').resolve
,fs = require('fs')
,local = {
	siteName: 'jadepress'
	,siteDesc: 'jade-press'
	,version: packageInfo.version
	,jadepress: 'http://jadepress.org'
	,siteKeywords: 'jade-press'
}
,config = require('../config')

module.exports = Object.assign(local, config.local)