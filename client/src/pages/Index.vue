<template>
  <q-page class="column content-center">
    <div>
      <q-btn color="primary" @click="sortByCreated">
        Sort by created
      </q-btn>
      <q-btn color="primary">
        Sort by updated
      </q-btn>
      <q-btn color="primary">
        Sort by...
      </q-btn>
    </div>
    <TodoItem
      v-for="(item, index) in todos" v-bind:key="index"
      :title="item.title"
      :todoId="item._id"
      :createdDate="item.createdDate"
      :updatedDate="item.updatedDate"
    />
  </q-page>
</template>

<script>
import TodoRequests from '../todoRequests'
import TodoItem from '../components/TodoItem'
export default {
  name: 'PageIndex',
  data() {
    return {
      todos: [],
      createdOrder: 'asc'
    }
  },
  components: {
    TodoItem
  },
  async created() {
    this.$root.$on('reload', async () => {
      console.log('RELOAD')
      this.todos = []
      this.todos = await TodoRequests.getAllTodos()
      console.log(this.todos)
    })
    this.todos = await TodoRequests.getAllTodos('asc')
    console.log(this.todos)
  },
  methods: {
    async sortByCreated() {
      this.todos = []
      this.todos = await TodoRequests.getAllTodos(this.createdOrder)

      if (this.createdOrder === 'asc') {
        this.createdOrder = 'desc'
      } else {
        this.createdOrder = 'asc'
      }
    }
  }
}
</script>
