
/*file*/

;(function () {

	var $alert = Vue.$alert
	Vue.use(zPagenav)

	var app = new Vue({
		el: 'body'
		,data: {
			loaded: true
			,form1: null
			,list: []
			,uploadProgress: 0
			,formData1: {
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

			,total: 0
			,onSubmit1: false
			,onDel: false
			,currentDelItem: {}
			,state: 'list'
		}
		,methods: {

			isImg: function(fileObj) {
				var ext = (fileObj.ext || '').toLowerCase()
				return ext === 'jpg' ||
							 ext === 'jpeg' ||
							 ext === 'png' ||
							 ext === 'webp'
			}
			,createImgSrc: function(fileObj) {
				return h5.fileServer + '/file/' + fileObj._id + '.' + fileObj.ext
			}
			,checkShow: function(item) {

				if(this.state === 'list') return true
				return item._id === this.currentDelItem._id

			}
			,remove: function(cat, arr) {
				for(var i = 0, len = arr.length;i < len;i ++) {
					if(cat._id === arr[i]._id) return arr.splice(i, 1)
				}
			}
			,del: function(item) {
				this.state = 'del'
				this.currentDelItem = Object.assign({}, item)
			}
			,cancel: function(item) {
				this.state = 'list'
				this.currentDelItem = {}
			}

			,delConfirm: function(item, $index) {
				var pi = this
				if(pi.onDel) return
				var data = {
					_id: this.currentDelItem._id
				}
				pi.onDel = true
				var url = h5.host + '/api/file/del'
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
					,url: h5.host + '/api/file/get'
					,data: pi.formData1
				})
				.then(function(res) {
					pi.onSubmit1 = false
					var data = res
					if(data.errorMsg || data.errs) {
						$alert(data.errorMsg || data.errs.join(';'), 'danger', '#msg3')
						
					} else {
						pi.total = data.total
						pi.list = data.result
					}
					
				}, function(res) {
					pi.onSubmit1 = false
					$alert('get list failed', 'danger', '#msg3')
				})
			}
			,findFile: function(md5, arr) {
				for(var i = 0, len = arr.length;i < len;i ++) {
					var it = arr[i]
					if(md5 === it.md5) return it
				}
				return false
			}
			,md5Check: function(files) {
				var pi = this
				return pi.getMd5(files[0])
				.then(pi.checkFile)
			}
			,checkFile: function(file) {
				var pi = this
				return new Promise(function(resolve, reject) {

					var f = pi.findFile(file.md5, pi.list)
					if(f) return resolve(false)
					$.ajax({
						type: 'post'
						,url: h5.host + '/api/file/get'
						,data: {
							md5: file.md5
							,page: 1
							,pageSize: 1
							,fields: {
								_id: 1
								,md5: 1
								,filename: 1
								,ext: 1
							}
						}
					})
					.then(function(res) {
						var data = res
						if(data.errorMsg || data.errs) {
							$alert(data.errorMsg || data.errs.join(';'), 'danger', '#msg3')
							resolve(true)
						} else {
							if(data.total) {
								var obj = data.result[0]
								pi.list.push(obj)
								$alert(file.name + ' uploaded', 'danger', '#msg3')
								resolve(false)
							} else resolve(true)
						}
						
					}, function(res) {
						$alert('get list failed', 'danger', '#msg3')
						resolve(true)
					})
				})
			}
			,getMd5: function(file) {
				return new Promise(function(resolve, reject) {
					browserMD5File(file, function (err, md5) {
						if(err) reject(err)
						else {

							console.log(file.name, md5)
							file.md5 = md5
							resolve(file)
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
				app.list.push(res.result)
				app.total ++
			}
			,error: function(jqxhr, str) {
				return $alert(str + ' please retry', 'danger', '#file-err2')
			}
			,progressall: function(e, data) {
				app.uploadProgress = Math.floor(data.loaded * 100/data.total)
			}
			,add: function(e, data) {
				//console.log(data)
				app.md5Check(data.files)
				.then(function(file) {
					if(file) data.submit()
				}, function(e) {
					return $alert(s.stack || e, 'danger', '#file-err2')
				})

				
			}
		})


	})

})()