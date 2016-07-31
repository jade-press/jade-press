
/*
 * time
**/

module.exports = function(range, ymmdd, hms) {

	let t = new Date()

	if(ymmdd) {
		let arr = ymmdd.split('-')
		,y = parseInt(arr[0], 10)
		,m = parseInt(arr[1], 10) - 1
		,d = parseInt(arr[2], 10)

		t.setFullYear(y)
		t.setMonth(m)
		t.setDate(d)
	}

	if(hms) {
		let harr = hms.split(':')
		,h = parseInt(harr[0], 10)
		,mi = parseInt(harr[1], 10)
		,s = parseInt(harr[2], 10)

		t.setHours(h)
		t.setMinutes(mi)
		t.setSeconds(s)
	}

	let ti = t.getTime() + (range || 0)
	t.setTime(ti)
	
	let res = {
		t: t
		,year: t.getFullYear()
		,month: t.getMonth()
		,date: t.getDate()
		,day: t.getDay()
		,hour: t.getHours()
		,minute: t.getMinutes()
		,second: t.getSeconds()
		,time: t.getTime()
	}
	res.ymd = res.year + '-' + (res.month + 1) + '-' + res.date
	res.ymmdd = res.year + '-' + 
	(res.month > 8? res.month + 1 : '0' + (res.month + 1)) + 
	'-' + 
	(res.date > 9 ? res.date: '0' + res.date)

	res.hhmmss = (res.hour > 9?res.hour:'0' + res.hour) + ':' +
		(res.minute > 9?res.minute:'0' + res.minute) + ':' +
		(res.second > 9?res.second:'0' + res.second)

	res.stamp = res.ymmdd + ' ' + res.hhmmss

	return res
}