<template>
  <div class="q-pa-md">
    <q-table
      title="Users"
      :data="users"
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
      <div class="q-table__title">Users</div>
      <q-form @submit="addUser">
				<h5 class="q-mb-sm">Add User</h5>
        <q-input
        	ref="addUsername"
					dense
					outlined
          debounce="300"
          v-model="addUsername"
          label="Username"
          lazy-rules="ondemand"
          :rules="[ createRules ]"
        />

				<q-input
        	ref="addPassword"
					dense
					outlined
          debounce="300"
          v-model="addPassword"
          label="Password"
          lazy-rules="ondemand"
          :rules="[ createRules ]"
        />

            <q-btn dense type="submit" >Add user</q-btn>
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
						<q-btn :to="'/user/' + props.row._id">Todos</q-btn>
          </q-td>

          <q-td key="username" :props="props">
            {{ props.row.username }}
            <q-popup-edit
              v-model="props.row.username"
              title="Change Username"
              buttons
              @save="updateTodo(props.row._id, props.row.username)"
            >
              <q-input v-model="props.row.username" dense autofocus counter />
            </q-popup-edit>
          </q-td>

					<q-td key="password" :props="props">
            Change Password
            <q-popup-edit
              v-model="newPassword"
              title="Change Password"
              buttons
              @save="changePassword(props.row._id, newPassword)"
            >
              <q-input type="password" v-model="newPassword" dense autofocus counter />
            </q-popup-edit>
          </q-td>


					<q-td key="role" :props="props">
            {{ props.row.role }}
            <q-popup-edit
              v-model="props.row.role"
              title="Change Role"
              buttons
              @save="updateRole(props.row._id, props.row.role)"
            >
              <q-input v-model="props.row.role" dense autofocus counter />
            </q-popup-edit>
          </q-td>

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
import UserRequests from '../UserRequests'

export default {
  data () {
    return {
			addUsername: '',
			addPassword: '',
			newPassword: '',
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
		users: [],
    	selected: [],
      columns: [
        { name: 'seeTodos', label: 'See todos', field: 'seeTodos', align: 'left' },
        {
          name: 'username',
          required: true,
          label: 'Username',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
				},
				{
          name: 'password',
          required: true,
          label: 'Password',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`
				},
				{
          name: 'role',
          required: true,
          label: 'Role',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`
        },
        { name: 'createdAt', label: 'CreatedAt', field: 'createdAt', sortable: true, style: 'width: 10px' },
        { name: 'updatedAt', label: 'UpdatedAt', field: 'updatedAt', sortable: true, },
        { name: 'delete', label: 'Delete', field: 'delete' }
      ]
    }
  },
  methods: {
		async onRequest (props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
			const filter = props.filter

      this.loading = true

      // get all rows if "All" (0) is selected
      const fetchCount = rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage

      // calculate starting row of data
      const startRow = (page - 1) * rowsPerPage

      // fetch data from server

      const fetchResult = await this.fetchFromServer(descending, page, fetchCount, sortBy, filter)

      // update rowsCount with appropriate value
      this.pagination.rowsNumber = fetchResult.count

      const returnedData = fetchResult.data

      // clear out existing data and add new
      this.users.splice(0, this.users.length, ...returnedData)

      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.pagination.sortBy = sortBy
      this.pagination.descending = descending

      this.loading = false
		},

    async fetchFromServer (order, page, limit, sortBy, filter) {
			let skip = 0
      skip = (page - 1) * limit

      return await UserRequests.getAllUsers(order, skip, limit, sortBy, filter)
    },
    async deleteTodo(id) {
      await UserRequests.deleteUser(id)
      await this.onRequest({
        pagination: this.pagination,
        filter: this.filter
      })
    },
    async updateTodo(id, val) {
      let editedTodo = {
        username: val
      }
      await UserRequests.editUser(editedTodo, id)
      await this.onRequest({
        pagination: this.pagination,
        filter: this.filter
      })
      return true
		},
		async updateRole (id, val) {
			let editedRole = {
        role: val
      }
      await UserRequests.editUser(editedRole, id)
      await this.onRequest({
        pagination: this.pagination,
        filter: this.filter
      })
      return true
		},
		async changePassword (id, val) {
			let editedPassword = {
        password: val
      }
      await UserRequests.editUser(editedPassword, id)
      await this.onRequest({
        pagination: this.pagination,
        filter: this.filter
      })
      return true
		},
    async addUser() {
      let validated = await this.createRules(this.newTitle)

      if (validated) {
        let user = {
					username: this.addUsername,
					password: this.addPassword
        }

        await UserRequests.createUser(user)
        this.addUsername = ''
				this.addPassword = ''
				
        this.$refs.addUsername.blur()
				this.$refs.addPassword.blur()
				
        this.$refs.addUsername.resetValidation()
        this.$refs.addPassword.resetValidation()

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
