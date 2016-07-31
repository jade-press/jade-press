'use strict'

const
db = require('./db').db
,log = require('./tools').log
,verCompare = require('compare-versions')
,fs = require('fs')
,resolve = require('path').resolve
,pack = require('../package.json')

exports.check = function* () {

	let verCurrent = yield db.collection('meta').findOne({
		_id: '_jade_press_version'
	})

	verCurrent = verCurrent.value.replace(/^v/, '')

	let updates = fs.readdirSync( resolve(__dirname, '../update') )

	let toups = updates.filter(function(f) {
		let ver = f.replace(/\.js$/, '').replace(/^v/, '')
		let comp = verCompare(ver, verCurrent)
		return comp > 0
	})
	.sort(function(a, b) {
		let vera = a.replace(/\.js$/, '').replace(/^v/, '')
		let verb = b.replace(/\.js$/, '').replace(/^v/, '')
		return verCompare(vera, verb)
	})

	if(toups.length) yield exports.update(toups)

	let res2 = yield db.collection('meta').updateOne({
		_id: '_jade_press_version'
	}, {
		$set: {
			value: pack.version
		}
	})

	return Promise.resolve(res2)
}

exports.update = function* (ups) {


	for(let i = 0, len = ups.length;i < len;i ++) {
		let file = ups[i]
		let ver = file.replace(/\.js$/, '')
		log('do', 'update', ver)
		yield require( '../update/' + file ).update(ver)
		log('ok', 'update', ver)
	}

	return Promise.resolve()

}