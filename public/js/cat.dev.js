
/*cat*/


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
				,pageSize: 100
				,maxLink: 5
				,parentId: '__root_cat'
			}
			,formData2: {

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
		}
		,events: {
			'page-change': function(page) {
				this.getList()
			}
		}
		,methods: {

			setTab: function(tab) {
				this.tab = tab
			}
			,checkShow: function(item, action) {
				if(item.type !== 'user-created' && action === 'del') return false
				if(this.state === 'list') return true

				return item._id === this.currentEditItem._id || 
								item._id === this.currentDelItem._id

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
				this.currentEditItem = Object.assign({}, item)
				this.editIndex = index
				this.formData3 = Object.assign({}, this.currentEditItem)
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
			,add: function() {
				var pi = this
				if(pi.onSubmit2) return
				if(pi.form2.$invalid) return pi.setDirty()
				pi.onSubmit2 = true
				$.ajax({
					type: 'post'
					,url: h5.host + '/api/cat/add'
					,data: pi.formData2
				})
				.then(function(res) {
					pi.onSubmit2 = false
					var data = res
					if(data.errorMsg) {
						$alert(data.errorMsg, 'danger', '#msg2')
						
					} else if(data.errs) {
						$alert(data.errs.join(';'), 'danger', '#msg2')
					}
					else {
						pi.formData2 = {}

						pi.setPristine()
						$alert('add new category done', 'success', '#msg2', 10000)
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
				var data = {
					name: pi.formData3.name
					,desc: pi.formData3.desc
					,slug: pi.formData3.slug
					,_id: pi.formData3._id
				}
				pi.onSubmit3 = true
				$.ajax({
					type: 'post'
					,url: h5.host + '/api/cat/update'
					,data: data
				})
				.then(function(res) {
					pi.onSubmit3 = false
					var data = res
					if(data.errorMsg) {
						$alert(data.errorMsg, 'danger', '#msg3')
						
					} else if(data.errs) {
						$alert(data.errs.join(';'), 'danger', '#msg3')
					}
					else {
						pi.list.$set(pi.editIndex, pi.formData3)
						pi.state = 'list'
						pi.currentEditItem = {}
					}
					
				}, function(res) {
					pi.onSubmit3 = false
					$alert('update cat failed', 'danger', '#msg3')
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
					,url: h5.host + '/api/cat/del'
					,data: data
				})
				.then(function(res) {
					pi.onDel = false
					var data = res
					if(data.errorMsg) {
						$alert(data.errorMsg, 'danger', '#msg-item', 10000)
						
					} else if(data.errs) {
						$alert(data.errs.join(';'), 'danger', '#msg-item', 10000)
					}
					else {
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
					,url: h5.host + '/api/cat/get'
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

			//end methods
		}
	})
		

	app.getList()

})()