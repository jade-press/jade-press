
'use strict'


let chai = require('chai')
,chalk = require('chalk')
,log = console.log
,err = function(e) {
	console.error(chalk.red('--> ' + (e.stack || e)))
}
,ok = function(e) {
	console.log(chalk.green('--> ' + (e.stack || e)))
}
,tit = function(e) {
	console.log(chalk.blue('= ' + (e.stack || e) + ' ='))
}
,describe = function(title, test) {
	try {
		test()
		ok(title)
	} catch(e) {
		err(title)
		err(e)
		process.exit(1)
	}
}

// console.log(Mocha)
// console.log(mocha)
// mocha.suit.emmit('pre-require')

// let describe = mocha.describe
let request = require('request')
,qr = function(args) {
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


module.exports = function* (test) {

	let arr = test.tests
	let len = arr.length
	let count = 0

	tit(test.title)

	for(var i = 0;i < len;i ++) {
		let ts = arr[i]
		var res  = yield qr(ts.options)
		var body = res.body
		//log(body)
		//log(ts.expect)
		describe(ts.title, function() {
			chai.assert(JSON.stringify(body) === JSON.stringify(ts.expect))
		})

	}

	return Promise.resolve()

}

