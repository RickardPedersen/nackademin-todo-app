<template>
  <q-page class="column content-center">
    <DoneTodo
      v-for="(item, index) in todos" v-bind:key="index"
      :title="item.title"
      :todoId="item._id"
    />
  </q-page>
</template>

<script>
import TodoRequests from '../todoRequests'
import DoneTodo from '../components/DoneTodo'
export default {
  name: 'TodoArchive',
  data() {
    return {
      todos: []
    }
  },
  components: {
    DoneTodo
  },
  async created() {
    this.$root.$on('reload', async () => {
      console.log('RELOAD')
      this.todos = []
      this.todos = await TodoRequests.getDoneTodos()
      console.log(this.todos)
    })
    this.todos = await TodoRequests.getDoneTodos()
    console.log(this.todos)
  }
}
</script>