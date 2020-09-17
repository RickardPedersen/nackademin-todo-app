<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-show="showMenu"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          <q-btn flat size="xl" label="Todo App" to="/" />
        </q-toolbar-title>
        <q-btn v-show="showLogOutButton" @click="logout" color="negative">Log Out</q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-show="showMenu"
      v-model="leftDrawerOpen"
      :show-if-above="showMenu"
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          <!--Essential Links-->
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
      <div class="flex flex-center">
        <q-btn class="q-ma-sm" color="primary" label="Cookie Policy" to="/cookie-policy" />
        <q-btn class="q-ma-sm" color="primary" label="Privacy Policy" to="/privacy-policy" />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import { mapGetters } from 'vuex'

const linksData = [
  {
    title: 'All Todos',
    caption: '',
    icon: '',
    link: '/todos'
  },
  {
    title: 'Todo Lists',
    caption: '',
    icon: '',
    link: '/todo-list',
  },
  {
    title: 'User List',
    caption: '',
    icon: '',
    link: '/users',
    adminLink: true
  },
  {
    title: 'Profile',
    caption: '',
    icon: '',
    link: '/profile'
  }
]

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
      showLogOutButton: false,
      showMenu: false
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('userToken')
      //this.$router.go('/')
      location.reload(true)
    }
  },
  computed: {
    ...mapGetters(['auth'])
  },
  created() {
    this.showLogOutButton = this.auth.loggedIn
    this.showMenu = this.auth.loggedIn
  },
  beforeUpdate() {
    this.showLogOutButton = this.auth.loggedIn
    this.showMenu = this.auth.loggedIn
    //this.leftDrawerOpen = this.auth.loggedIn
  }
}
</script>
