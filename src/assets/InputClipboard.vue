<script>

export default {
  props: [
    'value',
    'placeholder'
  ],
  data() {
    return {
      isTooltipVisible: false
    }
  },
  i18n: {
    messages: {
      de: {
        tooltipLinkCopied: 'Kopiert!'
      },
      en: {
        tooltipLinkCopied: 'Copied!'
      }
    }
  },
  computed: {
    tooltipClasses() {
      return {
        'input-clipboard__tooltip': true,
        'input-clipboard__tooltip--visible': this.isTooltipVisible
      }
    }
  },
  methods: {
    selectText() {
      const input = this.$el.querySelectorAll('input')[0];

      input.focus();
      input.setSelectionRange(0, this.value.length);
    },
    onFocusInput() {
      this.selectText();
    },
    onClick() {
      this.$emit('click', this.value);

      this.isTooltipVisible = true;
      setTimeout(() => {
        this.isTooltipVisible = false;
      }, 3000);
    },
  }
};
</script>

<template>
  <div class="input-clipboard">
    <input type="text"
           class="input-clipboard__input"
           readonly="readonly"
           :value="value"
           :placeholder="placeholder"
           v-on:focus="onFocusInput" />

    <div class="input-clipboard__buttons">
      <button class="input-clipboard__button" tabindex="-1" v-on:click="onClick">
        <span :class="tooltipClasses">
          {{ $t('tooltipLinkCopied')}}
        </span>
        <font-awesome-icon :icon="['far', 'copy']"/>
      </button>
    </div>
  </div>
</template>

<style lang="scss">
@import 'css/default.scss';

$tooltipBackground: #ddd;
$tooltipColor: #333;


.input-clipboard {
  display: flex;
  width: 100%;
  margin-bottom: 1em;

  > input[type="text"] {
    display: block;
    width: 100%;
    height: auto;
    flex-grow: 1;
    margin: 0;
    padding: 0.5rem 1rem;

    border: solid $borderSize $borderColor;
    border-right: none;
    border-radius: $borderRadius 0 0 $borderRadius;

    outline: none !important;

    font-size: 1rem;

    &::placeholder {
      color: $inputPlaceholderColor;
    }

    &:focus, &:active {
      box-shadow: inset 0 0 4px $inputPlaceholderColor;
    }
  }

  &__buttons {
    display: flex;
  }

  &__button {
    position: relative;
    padding: 0 1rem;
    border: none;
    border-radius: 0;
    outline: none !important;
    background: $colorAccent;
    color: #fff !important;
    cursor: pointer;
    transition: $transitionDuration background, $transitionDuration color;

    &:hover {
      background: $colorAccent;
      color: #fff;
    }

    &--red {
      &:hover {
        color: $colorRed;
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

  &__tooltip {
    position: absolute;
    left: 50%;
    top: -8px;
    transform: translate(-50%, -100%);
    background: $tooltipBackground;
    padding: 5px;
    border-radius: 5px;
    color: $tooltipColor;
    font-weight: 300;
    font-size: 1rem;
    line-height: 1em;
    opacity: 0;
    transition: opacity $transitionDuration;

    &--visible {
      opacity: 1;
    }

    &:before{
      content:'';
      display:block;
      width:0;
      height:0;
      position:absolute;

      border-top: 8px solid $tooltipBackground;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;

      top: 100%;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>