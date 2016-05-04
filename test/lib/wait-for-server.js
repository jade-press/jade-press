
'use strict'

const execPromise = require('./kill-process-by-port').execPromise

const timeout = function(time) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			resolve()
		}, time)
	})
}

module.exports = function* (port) {

	let out1 = yield execPromise('lsof -i | grep ' + port)

	for(var i = 0, len = 50000;i < len;i ++) {
		if(out1.indexOf(port) > -1) return Promise.resolve(true)
		else out1 = yield timeout(10).then(function() {
			return execPromise('lsof -i | grep ' + port)
		})
	}

}