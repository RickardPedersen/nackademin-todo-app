<template>
  <q-item
    clickable
    tag="a"
    :to="link"
    v-show="userCanSee"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'EssentialLink',
  data() {
    return {
      userCanSee: true
    }
  },
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    },

    adminLink: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['auth'])
  },
  created() {
    if (this.adminLink) {
      this.userCanSee = this.auth.isAdmin
    }
  },
  beforeUpdate() {
    if (this.adminLink) {
      this.userCanSee = this.auth.isAdmin
    }
  }
}
</script>
