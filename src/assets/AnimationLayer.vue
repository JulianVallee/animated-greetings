<script>
import { GetAnimation } from "./js/animations";
import EditorInputData from "./js/types/editor-input-data.js";

const FONT_SIZE_MIN = 0.5;

export default {
  props: {
    input: {
      type: Object,
      default: null
    },

    responsiveFactor: {
      type: Number,
      default: 1
    },

    shouldReset: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * @param input {EditorInputData}
     * @returns {number}
     */
    getResponsiveFontSize(input) {
      // Normalize font size, getting values between 0.02 - 1.98
      const fontSizeNormalized = input.fontSize / 100;
      return ((FONT_SIZE_MIN + (fontSizeNormalized)) * this.responsiveFactor);
    },
  },
  computed: {
    output() {
      const animation = GetAnimation(this.input.animation, 0);

      if(animation.hasOwnProperty('splitToCharArray')) {
        return this.input.value.split('');

      } else {
        return [this.input.value];

      }
    },

    classesRoot() {
      return [
        'animation__canvas-text',
        'animation__canvas-text--' + this.$vnode.key
      ];
    },

    styleInner() {
      return {
        fontSize: this.responsiveFontSize + 'em',
        color: this.input.fontColor
      };
    },

    responsiveFontSize() {
      // Normalize font size, getting values between 0.02 - 1.98
      const fontSizeNormalized = this.input.fontSize / 100;
      return ((FONT_SIZE_MIN + (fontSizeNormalized)) * this.responsiveFactor);
    }
  }
};
</script>

<template>
  <div :class="classesRoot">
    <div class="inner" :style="styleInner">
      <div v-for="(val, key) in output" class="letter" :key="val+key">{{ val }}</div>
    </div>
  </div>
</template>

<style lang="scss">
.animation {
  &__canvas {
    &-text {
      display: flex;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      align-items: center;
      justify-content: center;
      transform: translate(-50%, -50%);
      white-space: nowrap;

      // Possibly not required, have a look sometime to get rid of this
      .inner {
        line-height: 1em;

        > div {
          display: inline;
        }
      }

      // Used by animations that split the text into separate characters
      .letter {
        opacity: 0;
      }
    }
  }
}
</style>