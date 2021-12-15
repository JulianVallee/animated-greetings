<script>

export default {
  props: {
    hasGap: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    getClasses() {
      return {
        'panel-container': true,
        'panel-container--no-gap': !this.hasGap
      }
    }
  }
};
</script>

<template>
  <div :class="getClasses">
    <slot></slot>
  </div>
</template>

<style lang="scss">
  @import 'css/default.scss';

  .panel-container {
    display: flex;
    grid-gap: $gridGap;
    transition: grid-gap $transitionDurationLong $transitionEasing;

    &--no-gap {
      grid-gap: 0;
    }

    @media screen and (max-width: $medium) {
      flex-direction: column;
    }
  }
</style>