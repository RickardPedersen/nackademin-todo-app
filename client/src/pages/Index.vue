<template>
  <q-page class="column content-center">
    <TodoItem
      v-for="(item, index) in todos" v-bind:key="index"
      :title="item.title"
      :todoId="item._id"
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
      todos: []
    }
  },
  components: {
    TodoItem
  },
  async created() {
    this.todos = await TodoRequests.getAllTodos()
    console.log(this.todos)
  },
  async mounted() {
            this.$root.$on('reloadasdasdas', async () => {
              console.log('PARENT ASDASD')
              this.todos = await TodoRequests.getAllTodos()
            })

  }
}
</script>
