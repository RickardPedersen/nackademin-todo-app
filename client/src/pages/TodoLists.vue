<template>
  <div class="q-pa-md">
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
        <q-input dense debounce="300" v-model="filter" placeholder="Search">
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
            :rules="[createRules]"
          >
            <q-btn dense flat icon="add" type="submit" />
          </q-input>
        </q-form>

        <q-btn-dropdown
          class="float-right q-mb-sm"
          color="info"
          icon="add"
          label="Invite member"
          style="width:200px"
        >
          <q-input
            v-on:input="fectchUsersSearch(searchUser)"
            label="Invite to group"
            v-model="searchUser"
            class="bg-white"
            style="width:200px"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-list>
            <q-item
              v-for="(user, i) in userList"
              :key="i"
              clickable
              v-close-popup
              @click="inviteUser(user._id)"
            >
              <q-item-section>
                <q-item-label>{{ user.username }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <br />

        <q-btn-dropdown
          class="float-right"
          color="red"
          icon="delete"
          label="Remove member"
          style="width:200px"
        >
          <q-input
            v-on:input="fectchUsersSearch(searchUser)"
            label="Remove member"
            v-model="searchUser"
            class="bg-white"
            style="width:200px"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-list>
            <q-item
              v-for="(user, i) in userList"
              :key="i"
              clickable
              v-close-popup
              @click="removeMember(user._id)"
            >
              <q-item-section>
                <q-item-label>{{ user.username }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td>
            <q-checkbox
              color="gray"
              v-model="props.row.done"
              @input="doneTodo(props.row._id, props.row.done)"
            />
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

          <q-td key="createdAt" :props="props">
            <div class="text-pre-wrap">
              {{ new Date(props.row.createdAt).toLocaleTimeString() }}
            </div>
          </q-td>

          <q-td key="updatedAt" :props="props">
            {{ new Date(props.row.updatedAt).toLocaleTimeString() }}
          </q-td>

          <q-td key="delete" :props="props">
            <q-btn
              round
              color="negative"
              icon="delete"
              @click="deleteTodo(props.row._id)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import TodoListRequests from '../todoListRequest'
import TodoRequests from '../todoRequests'
import UserRequests from '../UserRequests'
export default {
  data() {
    return {
      userList: [],
      searchUser: '',
      testar: 'asdasdas',
      newTitle: '',
      newMember: '',
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
        {
          name: 'createdAt',
          label: 'Created',
          field: 'createdAt',
          sortable: true,
          style: 'width: 10px'
        },
        {
          name: 'updatedAt',
          label: 'Updated',
          field: 'updatedAt',
          sortable: true
        },
        { name: 'delete', label: 'Delete', field: 'delete' }
      ]
    }
  },
  methods: {
    async fectchUsersSearch(filter) {
      const res = await UserRequests.getAllUsers('', '', '', '', filter)
      this.userList = res.data
    },
    async inviteUser(userId) {
      const res = await TodoListRequests.addMember(
        this.$route.params.id,
        userId
      )
    },
    async removeMember(userId) {
      const res = await TodoListRequests.removeMember(
        this.$route.params.id,
        userId
      )
    },
    async onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      const filter = props.filter

      this.loading = true

      const fetchCount =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage

      const startRow = (page - 1) * rowsPerPage

      const fetchResult = await this.fetchFromServer(
        descending,
        page,
        fetchCount,
        sortBy,
        filter
      )

      this.pagination.rowsNumber = fetchResult.count

      const returnedData = fetchResult.data

      this.todos.splice(0, this.todos.length, ...returnedData)

      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.pagination.sortBy = sortBy
      this.pagination.descending = descending

      this.loading = false
    },

    async fetchFromServer(order, page, limit, sortBy, filter) {
      let skip = 0
      skip = (page - 1) * limit

      return await TodoListRequests.getTodoListTodos(
        this.$route.params.id,
        order,
        skip,
        limit,
        sortBy,
        filter
      )
    },

    async addMember() {
      await UserRequests.addMember(this.newMember)
      this.newMember = ''
      this.$refs.addMember.blur()
      this.$refs.addMember.resetValidation()
    },

    async deleteTodo(id) {
      await TodoRequests.deleteTodo(id)
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
      await this.onRequest({
        pagination: this.pagination,
        filter: this.filter
      })
      return true
    },
    async doneTodo(id, val) {
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

      if (validated) {
        let todo = {
          title: this.newTitle,
          listId: this.$route.params.id
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
  mounted() {
    this.onRequest({
      pagination: this.pagination,
      filter: this.filter
    })
  }
}
</script>
