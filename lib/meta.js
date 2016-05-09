/**
 * option
 */

'use strict'

const db = require('./db').db

//create self increament id
exports.createDigitId = function* () {

	let obj = yield db.collection('meta').findOneAndUpdate({
		_id: '_digitId'
	}, {
		$inc: {
			value: 1
		}
	}, {
		returnOriginal: false
	})

	return Promise.resolve(obj.value.value)
}