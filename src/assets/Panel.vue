<script>

import anime from 'animejs/lib/anime.es.js';

export default {
  props: {
    colored: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  }
};
</script>

<template>
  <div class="panel">
    <div :class="{'panel__inner': true, 'panel--colored': colored}">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
  @import 'css/default.scss';

  .panel {
    overflow: hidden;
    width: 100%;
    border-radius: $borderRadius;

    &--colored {
      background: $panelBackground;
    }

    // The inner container will keep the padding
    // while transitioning to zero width/height
    &__inner {
      padding: $panelPadding;
    }
  }
</style>