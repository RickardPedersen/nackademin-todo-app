<template>
    <q-card
      class="my-card q-mb-lg q-mt-lg"
      flat
      bordered
    >
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-overline">Created: {{ createdAt }}</div>
          <div v-show="updatedAt !== null" class="text-overline">Edited: {{ updatedAt }}</div>
          <div class="flex text-h5 q-mt-sm q-mb-xs">
            <div v-show="!editMode">
              {{dataTitle}}
            </div>
            <q-input
              filled
              v-model="newTitle"
              label="Titel"
              stack-label
              lazy-rules
              v-show="editMode"
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />
            <q-space />
            <q-btn
              icon="edit"
              color="primary"
              @click="editMode = true"
              v-show="!editMode"
            />
            <q-btn
              icon="done"
              color="positive"
              @click="saveEdit"
              v-show="editMode"
            />
            <q-btn
              icon="close"
              color="negative"
              @click="exitEdit"
              v-show="editMode"
            />
          </div>
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
        <q-space />
        <q-btn flat color="positive" @click="doneTodo">
          DONE
        </q-btn>
        <q-btn flat color="negative" @click="deleteTodo">
          DELETE
        </q-btn>
      </q-card-actions>
    </q-card>
</template>

<script>
import TodoRequests from '../todoRequests'
export default {
  name: 'TodoList',
  data() {
    return {
      editMode: false,
      newTitle: '',
      dataTitle: this.title,
      createdAt: null,
      updatedAt: null
    }
  },
  props: {
    title: String,
    todoId: String,
    createdDate: String,
    updatedDate: String 

  },
  methods: {
    async deleteTodo() {
      console.log(this.todoId)
      await TodoRequests.deleteTodo(this.todoId).then(()=> {
        this.$root.$emit('reload')

      })
      //console.log(res)
    },
    async doneTodo() {
      console.log('DONE ' + this.todoId)
        let editedTodo = {
          done: true
        }
      await TodoRequests.doneTodo(editedTodo, this.todoId).then(()=> {
        

        this.$root.$emit('reload')
      })
    },
    async saveEdit() {
      console.log('SAVED')
      let editedTodo = {
        title: this.newTitle
      }

      let result = await TodoRequests.editTodo(editedTodo, this.todoId)
      console.log(result)
      this.dataTitle = this.newTitle
      this.editMode = false
    },
    exitEdit() {
      this.newTitle = this.dataTitle
      this.editMode = false
    }
  },
  mounted() {
    let ca = new Date(this.createdDate).toLocaleString()
    this.createdAt = ca

      console.log('HEJ')
    if (this.updatedDate !== null) {
      let ua = new Date(this.updatedDate).toLocaleString()
      this.updatedAt = ua
    }
    //console.log(this.createdAt.toLocaleDateString())
    this.newTitle = this.title
  }
}
</script>