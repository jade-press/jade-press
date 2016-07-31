
'use strict'

const
nodemailer = require('nodemailer')
,setting = require('../app/setting')
,transporter = nodemailer.createTransport(setting.mailServer || {})
,mail = function(mailObj) {
	return new Promise(function(resolve, reject) {
		transporter.sendMail(mailObj, function(err, data) {
			if(err) reject(err)
			else resolve(data)
		})
	})
}
,db = require('./db').db
,tools = require('./tools')
,log = tools.log
,err = tools.err
,warn = tools.warn

exports.mail = mail

exports.checkMailService = function* () {

	return new Promise(function(resolve, reject) {
		transporter.verify(function(error, success) {
			if (error) {
				warn('mail service not ok')
				resolve(false)
			} else {
				log('mail service ok')
				resolve(true)
			}
		})
	})

}

exports.sendMailTask = function(options) {

/*

	let mailObj = {
		from: setting.mailSender // sender address 
		,to: userInfo.email // list of receivers 
		,subject: setting.emailValidationSubject // Subject line  
		,html: setting.emailValidationTemplate(id, userInfo, host)
	}

*/

	if(setting.env === 'debug') {
		return log('OK' ,'email mail send to')
	}

	let opts = options
	mail(opts)
	.then(ok, errs)

	function ok(res) {
		log('OK' ,'email mail send to', opts.to, JSON.stringify(res))
	}

	function errs(error) {
		err('FAIL', 'send email to', opts.to, error)
	}

	//end
}
