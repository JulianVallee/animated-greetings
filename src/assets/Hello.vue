<template>
  <div>
    <input v-model="username">
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script lang="typescript">
import Vue from 'vue';

export default Vue.extend({
  name: 'Hello',
  data() {
    return {
      username: ''
    }
  },

  computed: {
    error(): string {
      return this.username.trim().length < 7
          ? 'Please enter a longer username'
          : ''
    }
  },

  methods: {
    someMethod() {
      return this.username.trim().length < 7
          ? 'Please enter a longer username'
          : ''
    }
  }
})
</script>