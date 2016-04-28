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
	,published: {
		type: 'boolean'
		,required: true
		,default: false
	}
	,title: {
		type: 'string'
		,minLen: 1
		,maxLen: 200
		,required: true
		,default: 'defaultPostTitlePromise'
	}
	,slug: {
		type: 'string'
		,desc: 'url safe charactor only'
		,reg: /^[a-zA-Z_][a-zA-Z_0-9]{1,24}$/
		,default: 'defaultPostSlugPromise'
		,required: true
	}
	,tags: {
		type: 'string'
		,minLen: 1
		,maxLen: 200
		,required: true
		,default: 'titleAsTagsPromise'
	}
	,desc: {
		type: 'string'
		,minLen: 1
		,maxLen: 300
		,default: 'emptyStringPromise'
		,required: true
	}
	,content: {
		type: 'string'
		,maxLen: 10000
		,default: 'emptyStringPromise'
		,required: true
	}
	,html: {
		type: 'string'
		,required: true
	}
	,style: {
		type: 'string'
		,maxLen: 5000
		,default: 'emptyStringPromise'
		,required: true
	}
	,css: {
		type: 'string'
		,required: true
	}
	,script: {
		type: 'string'
		,maxLen: 10000
		,default: 'emptyStringPromise'
		,required: true
	}
	,cats: {
		type: 'array'
		,default: 'defaultCatPromise'
		,required: true
		,custom: 'validateCatsPromise'
	}
	,files: {
		type: 'array'
		,default: []
		,required: true
	}
	,featuredFile: {
		type: 'object'
		,default: {}
		,required: true
	}
	,meta: {
		type: 'object'
		,default: {}
		,required: true
	}
	,visit: {
		type: 'number'
		,default: 0
		,required: true
	}
	,createBy: {
		type: 'object'
		,required: true
	}
	,createTime: {
		type: 'date'
		,default: 'newDatePromise'
		,required: true
	}
	,updateTime: {
		type: 'date'
		,default: 'newDatePromise'
		,required: true
	}
}
