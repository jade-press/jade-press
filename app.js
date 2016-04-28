/*!
 * main entrance
**/

'use strict'

let init = require('./app/start').init
,co = require('co')

co(init())
.then(function(res) {
	//console.log('server start')
}, function(err) {
	console.error(err.stack || err)
})