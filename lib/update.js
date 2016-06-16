'use strict'

const db = require('./db').db
const log = require('./tools').log
let verCompare = require('compare-versions')
let fs = require('fs')
let resolve = require('path').resolve
let pack = require('../package.json')

exports.check = async function () {

	let verCurrent = await db.collection('meta').findOne({
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

	if(toups.length) await exports.update(toups)

	let res2 = await db.collection('meta').updateOne({
		_id: '_jade_press_version'
	}, {
		$set: {
			value: pack.version
		}
	})

	return Promise.resolve(res2)
}

exports.update = async function (ups) {


	for(let i = 0, len = ups.length;i < len;i ++) {
		let file = ups[i]
		let ver = file.replace(/\.js$/, '')
		log('do', 'update', ver)
		await require( '../update/' + file ).update(ver)
		log('ok', 'update', ver)
	}

	return Promise.resolve()

}