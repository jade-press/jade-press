
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
	,password: {
		type: 'string'
		,minLen: 1
		,maxLen: 24
		,required: true
		,custom: function() {
			var v = this.value
			return /^[0-9A-Za-z]{6,16}$/.test(v) &&
						 /[A-Za-z]/.test(v) &&
						 /[0-9]/.test(v)
		}
		,postValueFilter: 'encrypt'
	}
	,email: {
		type: 'string'
		,reg: /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i // from angular
		,required: true
	}
	,createTime: {
		type: 'date'
		,default: 'newDate'
		,required: true
	}
	,updateTime: {
		type: 'date'
		,default: 'newDate'
		,required: true
	}
	,group: {
		type: 'object'
		,desc: 'user group object'
		,required: true
		,custom: function() {
			var obj = this.value
			return Array.isArray(obj.access) && obj.name
		}
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