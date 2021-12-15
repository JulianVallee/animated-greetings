<script>

export default {
  props: ['disabled', 'fullwidth']
};
</script>

<template>
  <button type="button"
          :class="'editor__button'"
          :disabled="disabled"
          v-on:click="$emit('click')">
    <slot></slot>
  </button>
</template>

<style lang="scss">
@import 'css/default.scss';

.editor__button {
  padding: $inputPadding;
  border: solid $buttonBorderSize $buttonBorderColor;
  border-radius: $borderRadius;
  outline: none !important;
  font-size: 1em;
  color: $buttonTextColor;
  background: $buttonBackground;
  transition: transform $transitionDuration, color $transitionDuration, border $transitionDuration;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    //background: $buttonTextColor;
    //color: $buttonBackground;
    border-color: $colorPrimary;
    color: $colorAccent;
  }

  &--dashed {
    border-style: dashed !important;
    border-color: #ddd !important;
    color: #A6A6A6 !important;

    &:hover, &:focus {
      border-color: $colorPrimary !important;
      color: $colorAccent !important;
    }
  }

  &--fullwidth {
    width: 100%;
  }
}
</style>