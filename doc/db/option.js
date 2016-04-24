
module.exports = {
	_id: {
		type: 'string'
		,required: true
		,desc: 'the unique id and name'
		,reg: /^[a-zA-Z_][a-zA-Z_0-9]{1,24}$/
		,minLen: 1
		,maxLen: 24
	}
	,name: {
		type: 'string'
		,required: true
		,minLen: 1
		,maxLen: 50
	}
	,type: {
		type: 'string'
		,required: true
		,range: ['array', 'number', 'object', 'date', 'string']
		,custom: 'inRange'
	}
	,value: {
		type: 'mixed'
		,custom: 'validateOptionValue'
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
}