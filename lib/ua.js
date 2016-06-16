/**
 * ua
 */

var 
useragent = require('useragent')
,_ = require('lodash')

exports.ua = async (ctx, next) => {

	if( /^\/api\//.test(ctx.path) ) return await next
		
	var 
	userAgent = ctx.get('user-agent')
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

	ctx.local = ctx.local || {}
	_.extend(ctx.local, {
		ua: is
		,uaArr: ua
	})

	return await next

}