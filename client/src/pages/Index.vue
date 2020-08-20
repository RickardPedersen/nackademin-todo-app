<template>
  <q-page class="column content-center">
    <q-card
      class="my-card q-mb-lg q-mt-lg"
      flat
      bordered
      v-for="(post, index) in todos" v-bind:key="index"
    >
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <!--<div class="text-overline">Overline</div>-->
          <div class="text-h5 q-mt-sm q-mb-xs">{{post.title}}</div>
          <div class="text-caption text-grey">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </q-card-section>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn flat round icon="event" />
        <q-btn flat>
          7:30PM
        </q-btn>
        <q-btn flat color="primary">
          DONE
        </q-btn>
      </q-card-actions>
    </q-card>
    
  </q-page>
</template>

<script>
import TodoRequests from '../todoRequests'
export default {
  name: 'PageIndex',
  data() {
    return {
      todos: []
    }
  },
  async created() {
    this.todos = await TodoRequests.getAllTodos()
    console.log(this.todos)
  }
}
</script>
