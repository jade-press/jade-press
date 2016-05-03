
/*post*/

;(function () {
	var $alert = Vue.$alert
	Vue.use(zPagenav)
	Vue.use(jadeEditor)
	var app = new Vue({
		el: 'body'
		,data: {
			loaded: true
			,tab: 'list'
			,fileTab: 'file-upload'
			,form1: null
			,form2: null
			,form3: null
			,files: []
			,editor2: 'formData2'
			,editor3: 'formData3'
			,uploadProgress: 0
			,formData1: {
				page: 1
				,pageSize: 20
				,maxLink: 5
				,published: ''
				,fields: {
					id: 1
					,desc: 1
					,cats: 1
					,title: 1
					,tags: 1
					,slug: 1
					,files: 1
					,featuredFile: 1
					,published: 1
				}
			}
			,formDataf: {
				page: 1
				,pageSize: 20
				,maxLink: 5
				,fields: {
					_id: 1
					,md5: 1
					,filename: 1
					,ext: 1
				}
			}
			,formData2: {
				cats: []
				,files: []
				,published: false
				,featuredFile: {}
			}
			,formData3: {}
			,currentEditItem: {}
			,total: 0
			,onSubmit1: false
			,onSubmit2: false
			,onDel: false
			,currentDelItem: {}
			,state: 'list'
			,editIndex: 0
			,list: []
			,showMoreOption2: false
			,showMoreOption3: false
			,onValidateStyle2: false
			,onValidateStyle3: false
			,onloadPost: false
			,validateStyleMsg2: {}
			,validateStyleMsg3: {}
			,onloadCats: false
			,onloadFiles: false
			,cats: []
			,catsOptions: []
			,rows: 10
			,filesTotal: 0
		}
		,methods: {

			setTab: function(tab) {
				this.tab = tab
			}
			,set: function(obj, value) {
				this.$set(obj, value)
			}
			,setFileTab: function(tab) {
				if(tab === 'file-list') this.getFiles()
				this.fileTab = tab
			}
			,unsetFeatured: function(obj) {
				obj.featuredFile = {}
			}
			,isImg: function(fileObj) {
				var ext = fileObj.ext
				return ext === 'jpg' ||
							 ext === 'png' ||
							 ext === 'webp'
			}
			,insertFile: function(f, id) {
				var ht = this.isImg(f)?
						"\nimg(src='" + this.createImgSrc(f) + "', alt='" + f.filename + "')\n": 
						"\na(href='" + this.createImgSrc(f) + "') " + f.filename + "\n"
				this.$broadcast('je-insert-content', ht, id)
				if(!this.inCats(f, this[id].files)) this[id].files.push(f)
			}
			,setAsFeatured: function(f, obj) {
				obj.featuredFile = f
			}
			,createImgSrc: function(fileObj) {
				return h5.host + '/file/' + fileObj._id + '.' + fileObj.ext
			}
			,createUrl: function(item) {
				//todo:more replace thing
				return h5.host + 
				h5.routes.post
					.replace(':catSlug', item.cats.length?item.cats[0].slug:'default')
					.replace(':postSlug', item.slug)
			}
			,createUrl: function(item, host, route) {
				host = h5.host
				route = h5.routes.post
				var replace = {
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
					,':catSlug': function(url, item) {
						return url.replace( ':catSlug',  item.cats[0].slug)
					}
					,':catId': function(url, item) {
						return url.replace( ':catId',  item.cats[0].id)
					}
					,':cat_id': function(url, item) {
						return url.replace( ':cat_id',  item.cats[0]._id)
					}
				}
				var reg = /(:[a-zA-Z_][a-zA-Z_1-9]{0,24})/g
				var rs = route.match(reg)
				var url = host + route
				for(var i = 0, len = rs.length;i < len;i ++) {
					var rp = rs[i]
					url = replace[rp](url, item)
				}
				return url
			}
			,checkShow: function(item) {

				if(this.state === 'list') return true
				return item._id === this.currentEditItem._id || 
								item._id === this.currentDelItem._id

			}
			,renderItemCats: function(item) {
				return item.cats.map(function(v) {
					return v.name
				}).join(',')
			}
			,inCats: function(cat, arr) {
				return (arr || []).map(function(v) {
					return v._id
				}).join(',').indexOf(cat._id) > -1
			}
			,remove: function(cat, arr) {
				for(var i = 0, len = arr.length;i < len;i ++) {
					if(cat._id === arr[i]._id) return arr.splice(i, 1)
				}
			}
			,toggleCat: function(cat, arr) {
				if(this.inCats(cat, arr)) this.remove(cat, arr)
				else arr.push(cat)
			}
			,toggleShowMore: function(tail) {
				var op = 'showMoreOption' + (tail || '')
				this[op] = !this[op]
			}
			,formHook2: function(fm2) {
				this._form2 = fm2
			}
			,setPristine: function() {
				var pi = this
				Vue.nextTick(function() {
					pi._form2.setPristine()
				})
			}
			,setDirty: function() {
				this._form2.setDirty()
			}
			,edit: function(item, index) {
				this.state = 'edit'
				this.editIndex = index
				this.loadPost(item)
			}
			,validateStyle: function(tail) {
				var pi = this
				var onload = pi['onValidateStyle' + tail]
				if(onload) return
				onload = true
				var style = pi['formData' + tail].style

				$.ajax({
					type: 'post'
					,url: h5.host + '/api/post/validate-style'
					,data: {
						style: style
					}
				})
				.then(function(res) {
					onload = false
					var data = res
					if(data.errorMsg || data.errs) {
						var errsm = data.errorMsg || data.errs.join(';')
						pi['validateStyleMsg' + tail] = {
							hasResult: true
							,pass: false
							,msg: errsm
						}
					} else {
						pi['validateStyleMsg' + tail] = {
							hasResult: true
							,pass: true
						}
					}
					
				}, function(res) {
					onload = false
					pi['validateStyleMsg' + tail] = {
						hasResult: true
						,pass: false
						,msg: 'validation failed'
					}
				})

				//end func	
			}
			,loadPost: function(item) {

				var pi = this
				if(pi.onloadPost) return
				pi.onloadPost = true

				$.ajax({
					type: 'post'
					,url: h5.host + '/api/post/get'
					,data: {
						_id: item._id
						,page: 1
						,pageSize: 1
						,fields: {
							title: 1
							,desc: 1
							,style: 1
							,script: 1
							,slug: 1
							,tags: 1
							,cats: 1
							,content: 1
							,files: 1
							,featuredFile: 1
						}
					}
				})
				.then(function(res) {
					pi.onloadPost = false
					var data = res
					if(data.errorMsg || data.errs) {
						var errsm = data.errorMsg || data.errs.join(';')
						$alert(errsm, 'danger', '#item', 10000)
					} else {
						pi.currentEditItem = Object.assign({}, data.result[0])
						pi.formData3 = Object.assign({}, pi.currentEditItem)
						pi.registerFileUpload()
					}
					
				}, function(res) {
					pi.validateStyleMsg2 = {
						hasResult: true
						,pass: false
						,msg: 'validation failed'
					}
				})

				//end func
			}
			,getUrl: function(url) {
				var arr = h5.access.filter(function(v) {
					return v.indexOf('post') > -1 && v.indexOf(url) > -1
				})
				if(!arr.length) return '/api/post/' + url + '-self'
				else if(arr.length === 1) return arr[0]

				var arr1 = arr.filter(function(v) {
					return v.indexOf('self') === -1
				})
				return arr[0]
			}
			,del: function(item) {
				this.state = 'del'
				this.currentDelItem = Object.assign({}, item)
			}
			,cancelEdit: function(item) {
				this.state = 'list'
				this.currentEditItem = {}
			}
			,cancel: function(item) {
				this.state = 'list'
				this.currentDelItem = {}
			}
			,reset: function() {
				this.formData2 = {
					cats: []
					,files: []
					,featuredFile: {}
				}
			}
			,add: function() {
				var pi = this
				if(pi.onSubmit2) return
				if(pi.form2.$invalid) return this.setDirty()
				pi.onSubmit2 = true
				$.ajax({
					type: 'post'
					,url: h5.host + '/api/post/add'
					,data: pi.formData2
				})
				.then(function(res) {
					pi.onSubmit2 = false
					var data = res
					if(data.errorMsg || data.errs) {
						$alert(data.errorMsg || data.errs.join(';'), 'danger', '#msg2')
						
					} else {
						pi.reset()

						pi.setPristine()
						$alert('add new post done', 'success', '#msg2', 10000)
						pi.total ++
						pi.list.push(data.result)
					}
					
				}, function(res) {
					pi.onSubmit2 = false
					$alert('add cat failed', 'danger', '#msg1')
				})

				//end func
			}
			,update: function() {
				var pi = this
				if(pi.onSubmit3) return
				if(pi.form3.$invalid) return
				pi.onSubmit3 = true
				var url = pi.getUrl('update')
				$.ajax({
					type: 'post'
					,url: url
					,data: pi.formData3
				})
				.then(function(res) {
					pi.onSubmit3 = false
					var data = res
					if(data.errorMsg || data.errs) {
						$alert(data.errorMsg || data.errs.join(';'), 'danger', '#msg31', 10000)
						
					} else {
						pi.list.$set(pi.editIndex, pi.formData3)
						pi.state = 'list'
						pi.currentEditItem = {}
					}
					
				}, function(res) {
					pi.onSubmit3 = false
					$alert('update post failed', 'danger', '#msg31', 10000)
				})

				//end func
			}

			,publish: function(item, index) {
				var pi = this

				var url = pi.getUrl('update')
				$.ajax({
					type: 'post'
					,url: url
					,data: {
						_id: item._id
						,published: !item.published
					}
				})
				.then(function(res) {

					var data = res
					if(data.errorMsg || data.errs) {
						$alert(data.errorMsg || data.errs.join(';'), 'danger', '#msg31', 10000)
						
					} else {
						item.published = !item.published
						//pi.list.$set(index, Object())
					}
					
				}, function(res) {
					$alert('publish post failed', 'danger', '#msg31', 10000)
				})

				//end func
			}

			,delConfirm: function(item, $index) {
				var pi = this
				if(pi.onDel) return
				var data = {
					_id: this.currentDelItem._id
				}
				pi.onDel = true
				var url = pi.getUrl('del')
				$.ajax({
					type: 'post'
					,url: url
					,data: data
				})
				.then(function(res) {
					pi.onDel = false
					var data = res
					if(data.errorMsg || data.errs) {
						$alert(data.errorMsg || data.errs.join(';'), 'danger', '#msg-item', 10000)
						
					} else {
						pi.list.splice($index, 1)
						pi.total --
						pi.state = 'list'
						$alert('delete done', 'success', '#msg3', 10000)
					}
					
				}, function(res) {
					pi.onDel = false
					$alert('del failed', 'danger', '#msg-item', 10000)
				})

				//end func
			}
			,getList: function() {
				var pi = this
				if(pi.onSubmit1) return
				if(pi.form1.$invalid) return

				pi.onSubmit1 = true
				$.ajax({
					type: 'post'
					,url: h5.host + '/api/post/get'
					,data: pi.formData1
				})
				.then(function(res) {
					pi.onSubmit1 = false
					var data = res
					if(data.errorMsg || data.errs) {
						$alert(data.errorMsg || data.errs.join(';'), 'danger', '#msg1')
						
					} else {
						pi.total = data.total
						pi.list = data.result
					}
					
				}, function(res) {
					pi.onSubmit1 = false
					$alert('get list failed', 'danger', '#msg1')
				})

				//end func
			}
			,getCats: function() {
				var pi = this
				if(pi.onloadCats) return

				pi.onloadCats = true
				$.ajax({
					type: 'post'
					,url: h5.host + '/api/cat/get'
					,data: {
						parentId: '__root_cat'
						,pageSize: 1000
						,page: 1
						,fields: {
							name: 1
							,desc: 1
							,id: 1
							,parentId: 1
							,slug: 1
						}
					}
				})
				.then(function(res) {
					pi.onloadCats = false
					var data = res
					if(data.errorMsg || data.errs) {
						$alert(data.errorMsg || data.errs.join(';'), 'danger', '#msg1')
						
					} else {
						pi.cats = data.result
						pi.catsOptions = [{
							_id: ''
							,name: 'all category'
						}].concat(pi.cats)
						pi.formData1.catId = pi.catsOptions[0]._id
					}
					
				}, function(res) {
					pi.onloadCats = false
					$alert('get cat list failed', 'danger', '#msg1')
				})
			}
			,getFiles: function() {
				var pi = this
				if(pi.onloadFiles) return

				pi.onloadFiles = true
				$.ajax({
					type: 'post'
					,url: h5.host + '/api/file/get'
					,data: this.formDataf
				})
				.then(function(res) {
					pi.onloadFiles = false
					var data = res
					if(data.errorMsg || data.errs) {
						$alert(data.errorMsg || data.errs.join(';'), 'danger', '#msgf')
						
					} else {
						pi.files = data.result
						pi.filesTotal = data.total
					}
					
				}, function(res) {
					pi.onloadFiles = false
					$alert('get file list failed', 'danger', '#msgf')
				})

				//end func
			}

			,md5check: function() {
				var pi = this

				$.ajax({
					type: 'post'
					,url: h5.host + '/api/file/get'
					,data: this.formDataf
				})
				.then(function(res) {
					pi.onloadFiles = false
					var data = res
					if(data.errorMsg || data.errs) {
						$alert(data.errorMsg || data.errs.join(';'), 'danger', '#msgf')
						
					} else {
						pi.files = data.result
						pi.filesTotal = data.total
					}
					
				}, function(res) {
					pi.onloadFiles = false
					$alert('get file list failed', 'danger', '#msgf')
				})

				//end func
			}
			,registerFileUpload: function() {

				Vue.nextTick(function() {
					$('#file3').fileupload({
						dataType: 'json'
						,formData: {}
						,url: h5.host + '/api/file/add'
						,done: function (e, data) {
							var res = data.result
							if(res.errorMsg || res.errs) {
								return $alert(res.errorMsg || res.errs.join(';'), 'danger', '#file-err3')
							}
							app.files.push(res.result)
							app.formData3.files.push(res.result)
							app.filesTotal ++
						}
						,error: function(jqxhr, str) {
							return $alert(str + ' please retry', 'danger', '#file-err3')
						}
						,progressall: function(e, data) {
							app.uploadProgress = Math.floor(data.loaded * 100/data.total)
						}
						,add: function(e, data) {
							console.log(data)
							data.submit()
						}
					})
				})

			}

			//end methods
		}
		,events: {
			'page-change': function(page) {
				this.getList()
			}
		}
	})
		
	app.getCats()
	app.getList()

	$(function () {

		$('#file2').fileupload({
			dataType: 'json'
			,formData: {}
			,url: h5.host + '/api/file/add'
			,done: function (e, data) {
				var res = data.result
				if(res.errorMsg || res.errs) {
					return $alert(res.errorMsg || res.errs.join(';'), 'danger', '#file-err2')
				}
				app.files.push(res.result)
				app.formData2.files.push(res.result)
				app.filesTotal ++
			}
			,error: function(jqxhr, str) {
				return $alert(str + ' please retry', 'danger', '#file-err2')
			}
			,progressall: function(e, data) {
				app.uploadProgress = Math.floor(data.loaded * 100/data.total)
			}
			,add: function(e, data) {
				console.log(data)
				data.submit()
			}
		})


	})

})()