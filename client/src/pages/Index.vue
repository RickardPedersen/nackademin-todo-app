<template>
  <q-page
    class="row justify-center items-center"
    style="background: linear-gradient(#8274C5, #5A4A9F);"
  >
    <div class="column q-pa-lg" v-show="loginCard">
      <div class="row">
        <q-card square class="shadow-24" style="width:300px;height:485px;">
          <q-card-section class="bg-deep-purple-7">
            <h4 class="text-h5 text-white q-my-md">Log In</h4>
          </q-card-section>

          <q-card-section>
            <q-form @submit="login" class="q-px-sm q-pt-xl">

              <!--clearable-->
              <q-input
                square
                v-model="username"
                ref="username"
                type="username"
                label="Username"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type something']"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>

              <!--clearable-->
              <q-input
                square
                v-model="password"
                ref="password"
                type="password"
                label="Password"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type something']"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
            
              <q-btn unelevated size="lg" color="blue-7" class="full-width text-white q-mt-lg" label="Log In" type="submit"  />
            
            </q-form>
          </q-card-section>

          <q-separator class="q-mb-sm" />

          <q-card-actions class="q-px-lg">
            <q-btn unelevated size="lg" color="green-7" class="full-width text-white" label="Create New Account" @click="switchForm" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div class="column q-pa-lg" v-show="!loginCard">
      <div class="row">
        <q-card square class="shadow-24" style="width:300px;height:485px;">
          <q-card-section class="bg-deep-purple-7">
            <h4 class="text-h5 text-white q-my-md">Create Account</h4>
          </q-card-section>

          <q-card-section>
            <q-form @submit="createAccount" class="q-px-sm q-pt-xl">
              <!--clearable-->
              <q-input
                square
                v-model="newUsername"
                ref="newUsername"
                type="username"
                label="Username"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type something']"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>

              <!--clearable-->
              <q-input
                square
                
                v-model="newPassword"
                ref="newPassword"
                type="password"
                label="Password"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type something']"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>

              <q-btn type="submit" unelevated size="lg" color="green-7" class="full-width text-white q-mt-lg" label="Sign Up"  />
            </q-form>
          </q-card-section>

          <q-separator class="q-mb-sm" />

          <q-card-actions class="q-px-lg">
            <q-btn unelevated size="lg" color="blue-7" class="full-width text-white" label="Back To Log In" @click="switchForm" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  name: 'PageIndex',
  data() {
    return {
      username: '',
      password: '',
      newUsername: '',
      newPassword: '',
      loginCard: true
    }
  },
  components: {
  },
  methods: {
    async login() {
      console.log('LOGGIN IN')
      const postData = {
        username: this.username,
        password: this.password
      }
      try {
        
        let res = await axios.post('http://localhost:7070/api/authentication/login', postData)
        localStorage.setItem('userToken', res.data)
        console.log(localStorage.getItem('userToken'))

        //console.log('RESSSSSSSSSSSSSSS')
        //console.log(res)
        //console.log('SLUUUUUUUUUUUUUUUUUUUT')
        this.$router.push('/todos')
      } catch (error) {
        console.error(error)
      }
    },
    async createAccount() {
      const postData = {
        username: this.newUsername,
        password: this.newPassword
      }

      try {
        
        let res = await axios.post('http://localhost:7070/api/users', postData)
        console.log(res)
        this.switchForm()
      } catch (error) {
        console.error(error)
      }
      console.log('CREATING ACCOUNT')
      console.log(this.auth.loggedIn)
    },
    switchForm() {
      this.username = ''
      this.password = ''
      this.newUsername = ''
      this.newPassword = ''

      this.$refs.username.blur()
      this.$refs.password.blur()
      this.$refs.newUsername.blur()
      this.$refs.newPassword.blur()

      this.$refs.username.resetValidation()
      this.$refs.password.resetValidation()
      this.$refs.newUsername.resetValidation()
      this.$refs.newPassword.resetValidation()

      this.loginCard = !this.loginCard
    }
  },
  computed: {
    ...mapGetters(['auth'])
  }
}
</script>

<style lang="scss" scoped>

</style>
