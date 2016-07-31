
'use strict'

const 
setting = require('../app/setting')
,captcha = require('canvas-captcha')

let getCaptcha = function(options) {
	return new Promise(function(resolve, reject) {
		captcha(options, function(err, data) {
			if(err) reject(err)
			else resolve(data)
		})
	})
}

exports.captcha = function* (next) {

	let captchaData = yield getCaptcha(setting.captchaOptions)
	this.session.captcha = captchaData.captchaStr 
	this.body = captchaData.captchaImg
	
}