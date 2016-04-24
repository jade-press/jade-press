
module.exports = {

	_id: {
		type: 'string'
		,required: true
		,default: 'generateId'
	}
	,name: {
		type: 'string'
		,minLen: 1
		,maxLen: 50
		,required: true
	}
	,desc: {
		type: 'string'
		,maxLen: 500
		,default: 'emptyString'
		,required: true
	}
	,createTime: {
		type: 'date'
		,required: true
		,default: 'newDate'
	}
	,updateTime: {
		type: 'date'
		,required: true
		,default: 'newDate'
	}
	,access: {
		type: 'array'
		,desc: 'array of accessable url'
		,required: true
		,custom: 'validateAccess'
	}
	,type: {
		type: 'string'
		,desc: 'group type, "built-in" or "user-created" '
		,required: true
		,range: ['built-in', 'user-created']
		,default: function() {
			return 'user-created'
		}
	}

}