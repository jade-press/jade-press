
module.exports = {

	_id: {
		type: 'string'
		,required: true
		,default: 'generateId'
	}
	,state: {
		type: 'string'
		,required: true
		,range: ['init', 'done']
		,default: function() {
			return this.rule.range[0]
		}
	}
	,expire: {
		type: 'date'
		,required: true
		,default: 'defaultExpire'
	}
	,createTime: {
		type: 'date'
		,required: true
		,default: 'newDate'
	}
	,createBy: {
		type: 'object'
		,desc: 'user object'
		,required: true
	}
	,user: {
		type: 'object'
		,desc: 'user object'
		,required: true
	}
	
}