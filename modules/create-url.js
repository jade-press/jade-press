exports.replace = {
	':yyyy': function(url, item) {
		return url.replace( ':yyyy', item.createTime.getFullYear() )
	}
	,':mm': function(url, item) {
		var m = item.createTime.getMonth()
		m = m > 9?m + '':'0' + m
		return url.replace( ':mm',  m)
	}
	,':dd': function(url, item) {
		var d = item.createTime.getDate()
		d = d > 9?d + '':'0' + d
		return url.replace( ':mm',  d)
	}
	,':slug': function(url, item) {
		return url.replace( ':slug',  item.slug)
	}
	,':id': function(url, item) {
		return url.replace( ':id',  item.id)
	}
	,':_id': function(url, item) {
		return url.replace( ':_id',  item._id)
	}
	,':catslug': function(url, item) {
		return url.replace( ':catslug',  item.cats[0].slug)
	}
	,':catid': function(url, item) {
		return url.replace( ':catid',  item.cats[0].id)
	}
	,':cat_id': function(url, item) {
		return url.replace( ':cat_id',  item.cats[0]._id)
	}
}

exports.createUrl = function(item, host, route) {
	var reg = /(:[a-zA-Z_][a-zA-Z_1-9]{0,24})/g
	var rs = route.match(reg)
	var url = host + route
	for(var i = 0, len = rs.length;i < len;i ++) {
		var rp = rs[i]
		url = exports.replace[rp](url, item)
	}
	return url
}