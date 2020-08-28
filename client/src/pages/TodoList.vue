<template>
  <div class="q-pa-md">
    <!--
      :selected-rows-label="getSelectedString"
      selection="single"
      :selected.sync="selected"
    -->
    <q-table
      title="Todos"
      :data="todos"
      :columns="columns"
      row-key="_id"
      binary-state-sort
      
      
			:pagination.sync="pagination"
			:loading="loading"
			:filter="filter"
			@request="onRequest"
    >
		<template v-slot:top-right>
        <q-input  dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
    </template>

    <template v-slot:top-left>
      <div class="q-table__title">Todos</div>
      <q-form @submit="submitTodo">
        <q-input
        ref="addInput"
          debounce="300"
          v-model="newTitle"
          label="Add new todo"
          lazy-rules="ondemand"
          :rules="[ createRules ]"
        >
            <q-btn  dense flat icon="add" type="submit" />
        </q-input>
      </q-form>
    </template>

    <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
        	<q-td>
						<q-checkbox color="gray" v-model="props.row.done" @input="doneTodo(props.row._id, props.row.done)" />
          </q-td>

          <q-td key="title" :props="props">
            {{ props.row.title }}
            <q-popup-edit
              v-model="props.row.title"
              title="Update Title"
              buttons
              @save="updateTodo(props.row._id, props.row.title)"
            >
              <q-input v-model="props.row.title" dense autofocus counter />
            </q-popup-edit>
          </q-td>
<!--
          <q-td key="dueDate" :props="props">
            {{ new Date(props.row.dueDate).toLocaleTimeString() }}
            <q-popup-edit v-model="props.row.dueDate" title="Update calories" buttons>
              <q-input type="number" v-model="props.row.dueDate" dense autofocus />
            </q-popup-edit>
          </q-td>-->

          <q-td key="createdAt" :props="props">
            <div class="text-pre-wrap">{{ new Date(props.row.createdAt).toLocaleTimeString() }}</div>
          </q-td>

          <q-td key="updatedAt" :props="props">
            {{ new Date(props.row.updatedAt).toLocaleTimeString() }}
          </q-td>

          <q-td key="delete" :props="props">
            <q-btn round color="negative" icon="delete" @click="deleteTodo(props.row._id)" />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import TodoRequests from '../todoRequests'

export default {
  data () {
    return {
      newTitle: '',
			filter: '',
      loading: false,
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 0
      },
			todos: [],
    	selected: [],
      columns: [
        { name: 'done', label: 'Done', field: 'done', align: 'left' },
        {
          name: 'title',
          required: true,
          label: 'Title',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        /*{ name: 'dueDate', align: 'center', label: 'Due Date', field: 'dueDate', sortable: true },*/
        { name: 'createdAt', label: 'Created', field: 'createdAt', sortable: true, style: 'width: 10px' },
        { name: 'updatedAt', label: 'Updated', field: 'updatedAt', sortable: true, },
        { name: 'delete', label: 'Delete', field: 'delete' }
      ]
    }
  },
  methods: {
		async onRequest (props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
			const filter = props.filter
			console.log(sortBy)
			console.log(descending)
			console.log(filter)

      this.loading = true


      // update rowsCount with appropriate value
      this.pagination.rowsNumber = await this.getRowsNumberCount(filter)

      // get all rows if "All" (0) is selected
      const fetchCount = rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage

      // calculate starting row of data
      const startRow = (page - 1) * rowsPerPage

      // fetch data from server

      const returnedData = await this.fetchFromServer(descending, page, fetchCount, sortBy, filter)

      // clear out existing data and add new
      this.todos.splice(0, this.todos.length, ...returnedData)

      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.pagination.sortBy = sortBy
      this.pagination.descending = descending

      this.loading = false
		},

    async fetchFromServer (order, page, limit, sortBy, filter) {
			let skip = 0

			skip = (page - 1) * limit
			console.log(limit)
			return await TodoRequests.getAllTodos(order, skip, limit, sortBy, filter)
    },

    async getRowsNumberCount (filter) {
      let count = 0
			count = await TodoRequests.countTodos(filter)
			console.log('COUNTED')
			console.log(count)
      return count
    },
  
    getSelectedString () {
			//console.log(this.selected[0]._id)
			let newTodoList = this.todos.filter((item) => {
				//console.log(item._id)
				return item._id !== this.selected[0]._id
			})
			//console.log(newTodoList)
			//this.todos = newTodoList
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.todos.length}`
    },

    async deleteTodo(id) {
      await TodoRequests.deleteTodo(id)
      console.log('DELETE')
      console.log(id)
      await this.onRequest({
        pagination: this.pagination,
        filter: this.filter
      })
    },
    async updateTodo(id, val) {
      let editedTodo = {
        title: val
      }
      await TodoRequests.editTodo(editedTodo, id)
      console.log(id)
      console.log(val)
      await this.onRequest({
        pagination: this.pagination,
        filter: this.filter
      })
      return true
    },
    async doneTodo(id, val) {
      console.log(id)
      console.log(val)

      let editedTodo = {
        done: val
      }
      await TodoRequests.doneTodo(editedTodo, id)

      await this.onRequest({
        pagination: this.pagination,
        filter: this.filter
      })
    },
    async submitTodo() {
      let validated = await this.createRules(this.newTitle)
      console.log('SUBMIT: '+validated)

      if (validated) {
        let todo = {
          title: this.newTitle
        }

        await TodoRequests.createTodo(todo)
        this.newTitle = ''
        this.$refs.addInput.blur()
        this.$refs.addInput.resetValidation()

        await this.onRequest({
          pagination: this.pagination,
          filter: this.filter
        })
      }
    },
    async createRules(val) {
      return new Promise((resolve, reject) => {
        resolve(!!val || 'Please type something')
      })
    }
	},
	mounted () {
    // get initial data from server (1st page)
    this.onRequest({
      pagination: this.pagination,
      filter: this.filter
    })
  }
}
</script>