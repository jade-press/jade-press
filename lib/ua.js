/**
 * ua
 */

const 
useragent = require('useragent')
,_ = require('lodash')

exports.ua = function* (next) {

	if( /^\/api\//.test(this.path) ) return yield next
		
	let 
	userAgent = this.get('user-agent')
	,agent = useragent.parse(userAgent)
	,is = useragent.is(userAgent)
	,vn = parseFloat(is.version)
	,ua = []
	,os = agent.os
	,device = agent.device

	_.each(is, function(v, k) {
		if(k === 'version') ua.push('v' + v)
		else if(v) ua.push(k)
	})

	if(os) ua.push('os-' + os.family)
	if(device) ua.push('device-' + device.family)

	if(is.ie && vn < 9) {
		is.modern = false
		ua.push('obsolete')
	}
	else {
		is.modern = true
		ua.push('modern')
	}

	this.local = this.local || {}
	_.extend(this.local, {
		ua: is
		,uaArr: ua
	})

	return yield next

}