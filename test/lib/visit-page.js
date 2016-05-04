
'use strict'

const request = require('request')


module.exports = function(args) {

	return new Promise(function(resolve, reject) {
		request(args, function(err, response, body) {
			if(err) reject(err)
			else resolve({
				response: response
				,body: body
			})
		})
	})
	
}