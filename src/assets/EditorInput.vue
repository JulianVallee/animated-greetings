<script>

import { Compact as ColorPickerComponent } from 'vue-color'
import AnimationPickerComponent from "./AnimationPicker";

export default {
  components: {
    'color-picker': ColorPickerComponent,
    'animation-picker': AnimationPickerComponent,
  },
  props: ['value', 'placeholder', 'selected', 'maxLength', 'allowInputOptions'],
  data() {
    return {
      colorObject: null,

      //begin NOT IN USE
      sliderTimingsEnter: [1000, 1500],
      sliderTimingsLeave: [0, 500],

      sliderTimingsFunction: dotsPos => [
        [0, dotsPos[0], { backgroundColor: '#ffa366' }],
        [0, dotsPos[1], { backgroundColor: '#ff6600' }]
      ],
      //end

      sliderTimingsTooltipFormatterMS: '{value}ms',

      focused: false
    }
  },
  i18n: {
    messages: {
      de: {
        fontSize: 'Größe',
        fontColor: 'Farbe',
        animation: 'Animation',
        close: 'Schließen',
        delayEnter: 'Verzögerung Einblenden',
        durationEnter: 'Dauer Einblenden',
        delayLeave: 'Verzögerung Ausblenden',
        durationLeave: 'Dauer Ausblenden',
      },
      en: {
        fontSize: 'Size',
        fontColor: 'Color',
        animation: 'Animation',
        close: 'Close',
        delayEnter: 'Delay enter',
        durationEnter: 'Duration enter',
        delayLeave: 'Delay leave',
        durationLeave: 'Duration leave',
      }
    }
  },
  mounted() {
    this.colorObject = this.value.fontColor;
  },
  watch: {
    sliderTimingsValues(newValue, oldValue) {
      this.value.delayEnter = newValue[0];
      this.value.durationEnter = newValue[1];
    },
    colorObject(colorNew, colorOld) {
      if(colorNew.hex) {
        this.value.fontColor = colorNew.hex;
      }
    },
    selected(newValue, oldValue) {
      // When `selected` becomes true we add a negative tabindex attribute to the
      // input options components, so we can easily tab navigate from input to input
      if(newValue) {
        this.$nextTick(() => {
          const elements = [];

          if(this.$refs.animationPicker) {
            elements.push(this.$refs.animationPicker);
          }

          if(this.$refs.slider) {
            elements.push(this.$refs.slider.$el.getElementsByClassName('vue-slider-dot')[0]);
          }

          for(const element of elements) {
            element.setAttribute('tabindex', '-1');
          }
        });
      }
    }
  },
  methods: {
    onInputChanged() {
      this.$emit('change', this.$vnode.key);
    },
    onClickCloseSettings() {
      this.$emit('settings-close', this.$vnode.key);
    }
  }
};
</script>

<template>
  <div class="editor__input">
    <div :class="{'editor__input-wrapper': true, 'editor__input-wrapper--open': selected, 'editor__input-wrapper--focused': focused}">
      <input type="text"
             :value="value.value"
             :placeholder="placeholder"
             :maxlength="maxLength"
             v-on:focus="() => { $emit('focus', $vnode.key); this.focused = true; }"
             v-on:blur="focused = false"
             v-on:input="$emit('input', $vnode.key, $event.target.value);"/>

      <div class="editor__input-buttons">
        <button class="editor__input-button editor__input-button--red"
                tabindex="-1"
                v-on:click="$emit('click-delete', $vnode.key);">
          <font-awesome-icon :icon="['far', 'trash-alt']"/>
        </button>
      </div>
    </div>

<!--    <transition name="shrink-vertical">-->
      <div class="editor__input-settings" v-if="selected && allowInputOptions">
        <div class="editor__input-settings-inner" v-if="selected">
          <p>
            <label>{{ $t("fontSize") }}</label>
            <vue-slider ref="slider" v-model="value.fontSize" :min="1" :max="99" :duration="0" tabindex="-1"/>
          </p>

          <p>
            <label>{{ $t("fontColor") }}</label>
            <color-picker v-model="colorObject"/>
          </p>

          <p>
            <label>{{ $t("animation") }}</label>
            <animation-picker ref="animationPicker" v-model="value.animation" v-on:input="onInputChanged" tabindex="-1"/>
          </p>

          <p>
            <label>{{ $t("delayEnter") }}</label>
            <vue-slider v-model="value.delayEnter" :tooltip-formatter="sliderTimingsTooltipFormatterMS" :min="0" :max="3000" :duration="0" tabindex="-1" v-on:change="onInputChanged"/>

            <label>{{ $t("durationEnter") }}</label>
            <vue-slider v-model="value.durationEnter" :tooltip-formatter="sliderTimingsTooltipFormatterMS" :min="0" :max="3000" :duration="0" tabindex="-1" v-on:change="onInputChanged"/>

            <label>{{ $t("delayLeave") }}</label>
            <vue-slider v-model="value.delayLeave" :tooltip-formatter="sliderTimingsTooltipFormatterMS" :min="0" :max="3000" :duration="0" tabindex="-1" v-on:change="onInputChanged"/>

            <label>{{ $t("durationLeave") }}</label>
            <vue-slider v-model="value.durationLeave" :tooltip-formatter="sliderTimingsTooltipFormatterMS" :min="0" :max="3000" :duration="0" tabindex="-1" v-on:change="onInputChanged"/>
          </p>

          <div class="editor__settings-close">
            <a v-on:click="onClickCloseSettings">
              {{ $t("close") }}
            </a>
          </div>
        </div>
      </div>
<!--    </transition>-->
  </div>
</template>

<style lang="scss">
@import 'css/default.scss';

.shrink-vertical {
  &-enter-active, &-leave-active {
    transition: height $transitionDurationLong $transitionEasing, opacity $transitionDurationLong $transitionEasing;
    overflow: hidden;
  }

  &-enter, &-leave-to {
    height: 0 !important;
    opacity: 0 !important;
  }
}

.editor__input {
  margin-bottom: 1em;

  .vc-compact {
    box-shadow: none;
  }

  &-wrapper {
    display: flex;
    width: 100%;

    > input[type="text"] {
      display: block;
      width: 100%;
      height: auto;
      flex-grow: 1;
      margin: 0;
      padding: 0.5rem 1rem;

      //border: solid $borderSize #fff;
      //border-bottom: solid $borderSize $borderColor;
      border-radius: $borderRadius 0 0 $borderRadius;
      border-right: none;

      outline: none !important;
      box-shadow: none !important;

      font-size: 1rem;

      transition: border $transitionDuration;

      &::placeholder {
        color: $inputPlaceholderColor;
      }

      &:focus, &:active {
        box-shadow: none !important;
        border-color: $borderSize !important;
      }
    }

    &--open {
      .editor__input-button {
        border-bottom-right-radius: 0;
      }
    }

    &--focused {
      input, button {
        border-color: rgba(0,0,0,.3);
      }
    }
  }

  &-buttons {
    display: flex;
  }

  &-button {
    padding: 0 1rem;
    //border: none;
    border-radius: 0;
    outline: none !important;
    //background: $colorAccent;
    //color: #fff;
    background: #fff;
    color: $colorRed;
    border: solid 1px $borderColor;
    border-left: none;

    cursor: pointer;
    transition: $transitionDuration background, $transitionDuration color;

    &:hover {
      background: $colorAccent;
      color: #fff;
    }

    &--red {
      &:hover {
        //color: $colorRed;
        color: #fff;
        background: $colorRed;
        border-color: $colorRed;
      }
    }

    &--green {
      &:hover {
        color: $colorGreen;
      }
    }

    &:last-of-type {
      border-radius: 0 $borderRadius $borderRadius 0;
    }
  }

  &-settings {
    position: relative;
    margin-bottom: 1em;
    background: #fff;
    border: none;
    height: 100%;
    border-bottom-left-radius: $borderRadius;
    border-bottom-right-radius: $borderRadius;

    &-inner {
      padding: 1em;
    }

    p {
      margin: 0 0 1em 0;
    }

    label {
      display: block;
    }

    &-close {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>