<script lang="typescript">
import Vue from 'vue';

export default Vue.extend({
  name: 'Panel',
  props: {
    colored: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes() {
      return {
        'panel': true,
        'panel--colored': this.colored
      };
    }
  }
})
</script>

<template>
  <div :class="classes">
    <div class="panel__inner">
      <slot/>
    </div>
  </div>
</template>

<style lang="scss">
@import 'css/default.scss';

.panel {
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