
module.exports = {

	_id: {
		type: 'string'
		,required: true
		,default: 'generateIdPromise'
	}
	,id: {
		type: 'number'
		,desc: 'self increment digital id'
		,required: true
		,default: 'generateDigitalIdPromise'
	}
	,name: {
		type: 'string'
		,minLen: 1
		,maxLen: 50
		,required: true
	}
	,type: {
		type: 'string'
		,default: function* () {
			return Promise.resolve('user-created')
		}
		,required: true
	}
	,slug: {
		type: 'string'
		,desc: 'url safe charactor only'
		,reg: /^[a-zA-Z0-9\-]{1,24}$/
		,default: 'defaultCatSlugPromise'
		,required: true
		,custom: function(value) {
			return Promise.resolve(
				this.value !== 'admin' && 
				this.value !== 'file' && 
				this.value !== 'reset-password' &&
				this.value !== 'cat'
			)
		}
	}
	,desc: {
		type: 'string'
		,maxLen: 500
		,default: 'emptyStringPromise'
		,required: true
	}
	,parentId: {
		type: 'string'
		,default: 'defaultParentCatIdPromise' //if no parent category, parentId will be 'root'
		,required: true
	}
	,parentIdTree: {
		type: 'string'
		,default: 'defaultParentCatIdTreePromise' //if no parent category, parentId will be 'root'
		,required: true
	}
	,parentNameTree: {
		type: 'string'
		,default: 'defaultParentCatNameTreePromise' //if no parent category, parentId will be 'root'
		,required: true
	}
	,createTime: {
		type: 'date'
		,required: true
		,default: 'newDatePromise'
	}
	,updateTime: {
		type: 'date'
		,default: 'newDatePromise'
	}
	,createBy: {
		type: 'object'
		,desc: 'user object'
		,required: true
	}
	
}