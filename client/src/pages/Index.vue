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
            <q-form class="q-px-sm q-pt-xl">
              <q-input square clearable v-model="username" type="username" label="Username">
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>

              <q-input square clearable v-model="password" type="password" label="Password">
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
            </q-form>
          </q-card-section>

          <q-card-actions class="q-px-lg">
            <q-btn unelevated size="lg" color="blue-7" class="full-width text-white" label="Log In" @click="login" />
          </q-card-actions>

          <q-separator class="q-mb-sm q-mt-sm" />

          <q-card-actions class="q-px-lg">
            <q-btn unelevated size="lg" color="green-7" class="full-width text-white" label="Create New Account" @click="loginCard = !loginCard" />
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
            <q-form class="q-px-sm q-pt-xl">
              <q-input square clearable v-model="newUsername" type="username" label="Username">
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>

              <q-input square clearable v-model="newPassword" type="password" label="Password">
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
            </q-form>
          </q-card-section>

          <q-card-actions class="q-px-lg">
            <q-btn unelevated size="lg" color="green-7" class="full-width text-white" label="Sign Up" @click="createAccount" />
          </q-card-actions>

          <q-separator class="q-mb-sm q-mt-sm" />

          <q-card-actions class="q-px-lg">
            <q-btn unelevated size="lg" color="blue-7" class="full-width text-white" label="Back To Log In" @click="loginCard = !loginCard" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
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
    login() {
      console.log('LOGGIN IN')
    },
    createAccount() {
      console.log('CREATING ACCOUNT')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
