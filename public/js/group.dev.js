
/*group*/

;(function () {
	var $alert = Vue.$alert
	var accessObj = {}
	var accesses = h5.accesses.map(function(v) {
		accessObj[v.uri || v.url] = v
		return v.uri || v.url
	})
	Vue.use(zPagenav)
	var app = new Vue({
		el: 'body'
		,data: {
			loaded: true
			,tab: 'list'
			,form1: null
			,form2: null
			,form3: null
			,accessObj: accessObj
			,accesses: accesses
			,formData1: {
				page: 1
				,pageSize: 20
				,maxLink: 5
				,fields: {
					desc: 1
					,access: 1
					,name: 1
					,type: 1
				}
			}
			,formData2: {
				access: []
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
			,onloadAccess: false
			,rows: 10
		}
		,computed: {

		}
		,methods: {

			setTab: function(tab) {
				this.tab = tab
			}
			,desc: function(url) {
				return this.accessObj[url].name
			}
			,checkShow: function(item) {
				if(item.type === 'built-in') return false
				if(this.state === 'list') return true
				return item._id === this.currentEditItem._id || 
								item._id === this.currentDelItem._id

			}
			,checkAccess2: function() {
				return this.formData2.access.length > 0
			}
			,checkAccess3: function(ref) {
				return this.formData3.access.length > 0
			}
			,inAccesses: function(item, arr) {
				return (arr || []).indexOf(item) > -1
			}
			,remove: function(item, arr) {
				for(var i = 0, len = arr.length;i < len;i ++) {
					if(item === arr[i]) return arr.splice(i, 1)
				}
			}
			,toggleAccess: function(item, arr) {
				if(this.inAccesses(item, arr)) this.remove(item, arr)
				else arr.push(item)
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
				this.currentEditItem = Object.assign({}, item)
				this.formData3 = Object.assign({}, item)
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
					access: []
				}
			}
			,add: function() {
				var pi = this
				if(pi.onSubmit2) return
				if(pi.form2.$invalid) return this.setDirty()
				pi.onSubmit2 = true
				$.ajax2({
					type: 'post'
					,url: h5.host + '/api/group/add'
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
						$alert('add new user group done', 'success', '#msg2', 10000)
						pi.total ++
						pi.list.push(data.result)
					}
					
				}, function(res) {
					pi.onSubmit2 = false
					$alert('add user group failed', 'danger', '#msg1')
				})

				//end func
			}
			,update: function() {
				var pi = this
				if(pi.onSubmit3) return
				if(pi.form3.$invalid) return
				pi.onSubmit3 = true
				$.ajax2({
					type: 'post'
					,url: h5.host + '/api/group/update'
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
						$alert('update group done', 'success', '#msg3', 10000)
					}
					
				}, function(res) {
					pi.onSubmit3 = false
					$alert('update user group failed', 'danger', '#msg31', 10000)
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
				$.ajax2({
					type: 'post'
					,url: h5.host + '/api/group/del'
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
					$alert('delete failed', 'danger', '#msg-item', 10000)
				})

				//end func
			}
			,getList: function() {
				var pi = this
				if(pi.onSubmit1) return
				if(pi.form1.$invalid) return

				pi.onSubmit1 = true
				$.ajax2({
					type: 'post'
					,url: h5.host + '/api/group/get'
					,data: pi.formData1
				})
				.then(function(res) {
					pi.onSubmit1 = false
					var data = res
					if(data.errorMsg) {
						$alert(data.errorMsg, 'danger', '#msg1')
						
					} else if(data.errs) {
						$alert(data.errs.join(';'), 'danger', '#msg1')
					}
					else {
						pi.total = data.total
						pi.list = data.result
					}
					
				}, function(res) {
					pi.onSubmit1 = false
					$alert('get list failed', 'danger', '#msg1')
				})

				//end func
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

})()