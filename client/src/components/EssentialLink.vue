<template>
  <div>
    <q-item
      clickable
      tag="a"
      :to="link"
      v-if="!adminLink"
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
    <q-item
      clickable
      tag="a"
      :to="link"
      v-else
      v-show="$store.getters.auth.isAdmin"
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// this.$store.getters.auth.userToken
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
  }
}
</script>
