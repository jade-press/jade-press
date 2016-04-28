var 
_ = require('lodash')
,packageInfo = require('../package.json')
,sid = require('shortid')
,resolve = require('path').resolve
,fs = require('fs')

module.exports = {
	siteName: 'jadepress'
	,siteDesc: 'jade-press'
	,version: packageInfo.version
	,jadepress: 'http://jadepress.org'
	,siteKeywords: 'jade-press'
}
