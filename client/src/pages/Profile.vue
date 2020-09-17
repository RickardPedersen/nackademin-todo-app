<template>
  <div class="q-pa-md">
    <h3>Username: {{username}}</h3>
		<q-btn>
      Change Username
      <q-popup-edit
        title="Change username"
        buttons
				v-model="newUsername"
        @save="changeUsername(newUsername)"
      >
        <q-input ref="newUsername" v-model="newUsername" dense autofocus counter />
      </q-popup-edit>
    </q-btn>
		<br>
		<q-btn>
      Change password
      <q-popup-edit
        title="Change password"
        buttons
				v-model="newPassword"
        @save="changePassword(newPassword)"
      >
        <q-input ref="newPassword" type="password" v-model="newPassword" dense autofocus counter />
      </q-popup-edit>
    </q-btn>
    <h5>role: {{role}}</h5>
    <h5>Created At: {{createdAt}}</h5>
    <h5>Updated At: {{updatedAt}}</h5>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserRequests from '../UserRequests'
export default {
  name: 'Profile',
  data() {
      return {
          username: null,
					userId: null,
					createdAt: null,
					updatedAt: null,
					role: null,
					newPassword: '',
					newUsername: ''
      }
  },
  computed: {
    ...mapGetters(['auth'])
  },
  async created() {
    this.userId = this.auth.userId
    await this.getUser()

  },
  methods: {
      async getUser() {
          const user = await UserRequests.getUser(this.userId)
          this.username = user.username
          this.createdAt = user.createdAt
          this.updatedAt = user.updatedAt
          this.role = user.role
			},
			async changePassword (val) {
			let editedPassword = {
        password: val
      }
      await UserRequests.editUser(editedPassword, this.userId)
      await this.getUser()
		},
			async changeUsername(val) {
      let editedUsername = {
        username: val
      }
      await UserRequests.editUser(editedUsername, this.userId)
      await this.getUser()
		},
  }
}
</script>
