

'use strict'

//kill process by port

const exec = require('child_process').exec

const execPromise = exports.execPromise = function (cmd) {

	return new Promise(function(resolve, reject) {
		exec(cmd, function(error, stdout, stderr) {
			console.log(error || stdout || stderr)
			if(error) resolve(error)
			resolve(stdout || stderr)
		})
	})

}

exports.kill = function* (port) {

	let out1 = yield execPromise('lsof -i | grep ' + port)
	let arr = out1.split(/\s+/)
	let pid = arr[1]
	let out2 = yield execPromise('kill ' + pid)
	return Promise.resolve(out2)


}