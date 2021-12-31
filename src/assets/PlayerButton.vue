<script>

export default {
  props: {
    icon: {
      type: Array[String],
      default: [],
      required: true
    }
  },
  data() {
    return {
    }
  },
  mounted() {
    this.$log("Mounted");
  },
  computed: {
  },
  watch: {
  },
  methods: {
  }
};
</script>

<template>
  <div class="animation__footer-button" v-on:click="$emit('click')">
    <font-awesome-icon :icon="icon" />
  </div>
</template>

<style lang="scss">
@import 'css/default.scss';

.animation {
  &__footer {
    &-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1rem;
      height: 100%;
      top: 0;
      padding: 0 2rem;
      border-radius: 0;
      color: $playerIconColor;
      cursor: pointer;
      z-index: 2;
      transition: color $transitionDuration;

      &:first-of-type {
        left: 0;
      }

      &:last-of-type {
        right: 0;
      }

      &:hover {
        color: rgba(255, 255, 255, 1);
      }
    }
  }
}
</style>