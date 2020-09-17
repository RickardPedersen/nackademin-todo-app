<template>
    <div class="q-pa-xl">
        <q-markdown :src="markdown"></q-markdown>
        <div>
        <q-btn class="q-ma-sm" color="positive" label="Accept Cookies" @click="cookieAccept" />
        <q-btn class="q-ma-sm" color="negative" label="Decline Cookies" @click="cookieDecline" />
      </div>
    </div>
</template>

<script>
import { QMarkdown } from '@quasar/quasar-ui-qmarkdown'
import markdown from '../assets/cookie-policy.md'

export default {
	data() {
		return {
			markdown
		}
	},
  components: {
    QMarkdown
  },
  methods: {
    cookieAccept() {
      localStorage.setItem('cookiePolicyAccepted', true)
    },
    cookieDecline() {
      localStorage.removeItem('userToken')
      localStorage.removeItem('cookiePolicyAccepted')
    }
  }
}
</script>

<style src="@quasar/quasar-ui-qmarkdown/dist/index.css"></style>
