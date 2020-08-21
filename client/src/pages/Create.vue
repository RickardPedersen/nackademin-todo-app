<template>
  <q-page class="column content-center">
    <q-form
      @submit="submitTodo"
      class="q-gutter-md q-mt-lg"
    >
      <q-input
        filled
        v-model="title"
        label="Title *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

    <q-space />
      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
      </div>
    </q-form>
    
  </q-page>
</template>

<script>
import TodoRequests from '../todoRequests'
export default {
  name: 'PageIndex',
  data() {
    return {
      todos: [],
      title: ''
    }
  },
  methods: {
      async submitTodo() {
          let todo = {
              title: this.title
          }

          await TodoRequests.createTodo(todo)
          this.$router.push(`/`)
      }
  }
}
</script>