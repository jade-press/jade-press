


;(function () {
	var $alert = Vue.$alert
	Vue.use(zPagenav)
	var app = new Vue({
		el: 'body'
		,data: {
			loaded: true
			,tab: 'list'
			,form1: null
			,form2: null
			,form3: null
			,formData1: {
				page: 1
				,pageSize: 20
				,maxLink: 5
				,fields: {
					name: 1
					,group: 1
					,email: 1
				}
			}
			,formData2: {
				group: {}
				,resetPassword: true
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
			,onloadGroup: false
			,groups: []
			,groupOptions: []
		}
		,methods: {

			setTab: function(tab) {
				this.tab = tab
			}
			,validateGroup2: function() {
				return this.formData2.group._id
			}
			,validateGroup3: function() {
				return this.formData3.group._id
			}
			,validatePass2: function() {
				var v = this.formData2.password
				return /^[0-9A-Za-z]{6,16}$/.test(v) &&
						 /[A-Za-z]/.test(v) &&
						 /[0-9]/.test(v)
			}
			,validateGroup3: function() {
				var v = this.formData3.password
				return /^[0-9A-Za-z]{6,16}$/.test(v) &&
						 /[A-Za-z]/.test(v) &&
						 /[0-9]/.test(v)
			}
			,checkShow: function(item) {
				if(item.type === 'built-in') return false
				if(this.state === 'list') return true
				return item._id === this.currentEditItem._id || 
								item._id === this.currentDelItem._id

			}
			,selectGroup: function(group, obj) {
				obj.group = group
			}
			,checkGroup: function(group, obj) {
				return (obj.group || {})._id === group._id
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
					group: {}
					,resetPassword: true
				}
			}
			,add: function() {
				var pi = this
				if(pi.onSubmit2) return
				if(pi.form2.$invalid) return this.setDirty()
				pi.onSubmit2 = true
				$.ajax({
					type: 'post'
					,url: h5.host + '/api/user/add'
					,data: pi.formData2
					,dataType: 'json'
				})
				.then(function(res) {
					pi.onSubmit2 = false
					var data = res
					if(data.errorMsg || data.errs) {
						$alert(data.errorMsg || data.errs.join(';'), 'danger', '#msg2')
						
					} else {
						pi.reset()
						pi.setPristine()
						$alert('add new user done', 'success', '#msg2', 10000)
						pi.total ++
						pi.list.push(data.result)
					}
					
				}, function(res) {
					pi.onSubmit2 = false
					$alert('add user failed', 'danger', '#msg2')
				})

				//end func
			}
			,update: function() {
				var pi = this
				if(pi.onSubmit3) return
				if(pi.form3.$invalid) return
				pi.onSubmit3 = true
				$.ajax({
					type: 'post'
					,url: h5.host + '/api/user/update'
					,data: pi.formData3
					,dataType: 'json'
				})
				.then(function(res) {
					pi.onSubmit3 = false
					var data = res
					if(data.errorMsg || data.errs) {
						$alert(data.errorMsg || data.errs.join(';'), 'danger', '#msg31', 10000)
					} else {
						pi.list.$set(pi.editIndex, pi.formData3)
						pi.state = 'list'
						pi.formData3 = {}
						pi.currentEditItem = {}
					}
					
				}, function(res) {
					pi.onSubmit3 = false
					$alert('update user failed', 'danger', '#msg31', 10000)
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
				$.ajax({
					type: 'post'
					,url: h5.host + '/api/user/del'
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
					$alert('delete failed', 'danger', '#msg-item')
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
					,url: h5.host + '/api/user/get'
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
			,getGroups: function() {
				var pi = this
				if(pi.onloadGroup) return

				pi.onloadGroup = true
				$.ajax({
					type: 'post'
					,url: h5.host + '/api/group/get'
					,data: {
						pageSize: 1000
						,page: 1
						,fields: {
							name: 1
							,desc: 1
							,access: 1
						}
					}
				})
				.then(function(res) {
					pi.onloadGroup = false
					var data = res
					if(data.errorMsg || data.errs) {
						$alert(data.errorMsg || data.errs.join(';'), 'danger', '#msg1')
						
					} else {
						pi.groups = data.result
						pi.groupOptions = [{
							_id: ''
							,name: 'all groups'
						}].concat(pi.groups)
						pi.formData1.groupId = pi.groupOptions[0]._id
					}
					
				}, function(res) {
					pi.onloadGroup = false
					$alert('get group list failed', 'danger', '#msg1')
				})

				//end func
			}

			//end methods
		}
		,events: {
			'page-change': function(page) {
				this.getGroups()
			}
		}
	})
		
	app.getGroups()
	app.getList()

})()