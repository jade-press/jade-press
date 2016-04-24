
module.exports = {
	//default gridfs meta data

	_id: {
		type: 'string'
		,required: true
	}
	,md5: {
		type: 'string'
		,required: true
	}
	,ext: {
		type: 'string'
		,required: true
	}
	,byteCount: {
		type: 'number'
		,required: true
	}
	,uploadDate: {
		type: 'date'
		,required: true
	}
	,createBy: {
		type: 'object'
		,desc: 'user object'
		,required: true
	}
}