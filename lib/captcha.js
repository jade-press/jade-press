
'use strict'

let setting = require('../app/setting')
,captcha = require('canvas-captcha')

var getCaptcha = function(options) {
	return new Promise(function(resolve, reject) {
		captcha(options, function(err, data) {
			if(err) reject(err)
			else resolve(data)
		})
	})
}

exports.captcha = function* (next) {

	var captchaData = yield getCaptcha(setting.captchaOptions)
	this.session.captcha = captchaData.captchaStr 
	this.body = captchaData.captchaImg
	
}