<script>
import Sharer from "./js/sharer.js";

export default {
  data() {
    return {
    }
  },
  props: {  // TODO: Add default values
    sharer: String,
    width: Number,
    height: Number,
    title: String,
    subject: String,
    url: String,
    hashtag: String,
    hashtags: Array,
  },
  methods: {
    onClick() {
      new Sharer(this.$el);
    }
  }
};
</script>

<template>
  <a class="sharer-button"
          :data-sharer="sharer"
          :data-width="width"
          :data-height="height"
          :data-title='title + "\n"'
          :data-subject='subject'
          :data-url="url"

          :data-quote="title"
          :data-hashtag="hashtag"
          :data-hashtags="hashtags"
          v-on:click="onClick">
    <slot></slot>
  </a>
</template>

<style type="text/scss">
.sharer-button {
  cursor: pointer;
}
</style>