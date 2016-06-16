var MongoClient = require('mongodb').MongoClient
,setting = require('../app/setting')
,local = require('../app/local')

exports.init = async function () {

	//load db:jadepress
	exports.db = await MongoClient.connect(setting.dbLink)
	var validater = require('s-validater')

	//db init
	setting.dbCols.forEach(function(v) {
		exports.db.collection(v)
	})

	Object.assign( validater, require('./filters') )

	return Promise.resolve()

	//end
}