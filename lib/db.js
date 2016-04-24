var MongoClient = require('mongodb').MongoClient
,setting = require('../app/setting')
,local = require('../app/local')

exports.init = function* () {

	//load db:jadepress
	exports.db = yield MongoClient.connect(setting.dbLink)
	var validater = require('s-validater')

	//db init
	setting.dbCols.forEach(function(v) {
		exports.db.collection(v)
	})

	Object.assign( validater, require('./filters') )

	return Promise.resolve()

	//end
}