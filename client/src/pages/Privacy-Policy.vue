<template>
  <div class="q-pa-xl">
    <q-markdown :src="markdown"></q-markdown>
  </div>
</template>

<script>
import { QMarkdown } from '@quasar/quasar-ui-qmarkdown'
import markdown from '../assets/privacy-policy.md'

export default {
  data() {
    return {
      markdown
    }
  },
  components: {
    QMarkdown
  }
}
</script>

<style src="@quasar/quasar-ui-qmarkdown/dist/index.css"></style>
