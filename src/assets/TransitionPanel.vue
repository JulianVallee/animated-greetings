<script>

import PanelComponent from "./Panel";

import anime from 'animejs/lib/anime.es.js';

export default {
  components: {
    'panel': PanelComponent
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 500
    },
    easing: {
      type: String,
      default: 'easeOutQuint'
    },
    colored: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showSlot: false,
    }
  },
  mounted() {
    // Sync variable used by v-show with the variable used by v-if,
    // this prevents the slot being mounted if it should be invisible
    this.showSlot = this.show;
  },
  methods: {
    onBeforeEnter(el, done) {
      this.$emit('before-enter', el, done);

      // Show slot when element is about to enter
      this.showSlot = true;
    },
    onAfterEnter(el, done) {
      this.$emit('after-enter', el, done);
    },
    onBeforeLeave(el, done) {
      this.$emit('before-leave', el, done);
    },
    onAfterLeave(el, done) {
      this.$emit('after-leave', el, done);

      // Hide slot after element left
      this.showSlot = false;
    },

    /**
     * This is here as an advanced usage example:
     * Add `v-on:enter="onEnter"` to the transition for anime.js driven transitions
     * @param el
     * @param done
     */
    onEnter(el, done) {
      this.$emit('enter', el, done);

      anime
          .timeline({
            easing: this.easing,
            duration: this.duration,
            complete: done
          })
          .add({
            targets: el,
            width: '100%',
            opacity: 1
          });
    },

    /**
     * This is here as an advanced usage example:
     * Add `v-on:leave="onLeave"` to the transition for anime.js driven transitions
     * @param el
     * @param done
     */
    onLeave(el, done) {
      this.$emit('leave', el, done);

      anime
          .timeline({
            easing: this.easing,
            duration: this.duration,
            complete: done
          })
          .add({
            targets: el,
            opacity: 0,
            width: '0%'
          });
    }
  }
};
</script>

<template>
  <transition
      name="shrink-horizontal"
      v-on:before-enter="onBeforeEnter"
      v-on:after-enter="onAfterEnter"
      v-on:before-leave="onBeforeLeave"
      v-on:after-leave="onAfterLeave">
    <panel v-show="show" :colored="colored">
      <slot v-if="showSlot"></slot>
    </panel>
  </transition>
</template>

<style lang="scss">
  @import 'css/default.scss';

  .shrink-horizontal {
    &-enter-active, &-leave-active {
      transition: width $transitionDurationLong $transitionEasing, opacity $transitionDurationLong $transitionEasing;
      overflow: hidden;
    }

    &-enter, &-leave-to {
      width: 0 !important;
      opacity: 0 !important;
    }
  }
</style>