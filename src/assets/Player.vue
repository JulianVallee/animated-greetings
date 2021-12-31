<script>
/* Components */
import AnimationLayerComponent from "./AnimationLayer";
import PlayerButtonComponent from "./PlayerButton";
import PlayerProgressBarComponent from "./PlayerProgressBar";

/* Modules */
import anime from 'animejs/lib/anime.es.js';
import SnowEffect from './js/snow';

/* Data */
import {GetAnimation} from "./js/animations";

import store from './js/store';

export default {
  components: {
    'animation-layer': AnimationLayerComponent,
    'player-button': PlayerButtonComponent,
    'player-progress-bar': PlayerProgressBarComponent
  },
  props: {
    inputs: Array,
    options: Object,
    standalone: Boolean
  },
  data() {
    return {
      loaded: false,

      paused: true,
      seeking: false,

      isResetting: false,

      resetState: null,

      /**
       * @see https://nightcatsama.github.io/vue-slider-component/#/basics
       */
      timeline: null,

      activeEffect: null,

      // We cache the length of the "inputs" prop, so we can
      // compare it against the new array length in our watcher
      inputsLengthOld: 0,

      // Scaling factor to use in responsive calculations,
      // 1 for every 100px width of the animation element
      playerResponsiveFactor: 1,

      resizeObserver: null,

      timeoutId: null,
      timeoutLateId: null,
    }
  },
  i18n: {
    messages: {
      de: {
        headerPreview: 'Vorschau',
        end: 'Ende'
      },
      en: {
        headerPreview: 'Preview',
        end: 'End'
      }
    }
  },
  logger: {
    enabled: true,
  },
  mounted() {
    this.$log("Mounted");
    this.$log('Store resetState:', store.resetState);

    // Call it once for initialization
    this.initBackgroundEffect();
    this.updateResponsiveFactor();
    this.update(store.resetState);

    if(!this.resizeObserver) {
      this.resizeObserver = new ResizeObserver(this.updateResponsiveFactor);
    }
    this.resizeObserver.unobserve(this.$el);
    this.resizeObserver.observe(this.$el);

    // Manual HMR support, that's what we get for using a library that acts on the DOM itself...
    if (module.hot) {
      module.hot.addStatusHandler(this.onHmrUpdateComplete);
    }
  },
  beforeDestroy() {
    this.$log("beforeDestroy");

    if (module.hot) {
      module.hot.removeStatusHandler(this.onHmrUpdateComplete);
    }

    this.resizeObserver.unobserve(this.$el);

    this.removeTimeline();
  },
  watch: {
    inputs(dataNew, dataOld) {
      this.$log("Watcher 'inputs' triggered");

      // We only need to reset if elements got added/removed,
      // not if their content changes
      if(dataNew.length !== this.inputsLengthOld) {
      }

      this.update();
      // Arrays and objects have the same value for new and old data,
      // see https://vuejs.org/v2/api/#vm-watch
      this.inputsLengthOld = dataNew.length;
    },

    '$i18n.locale'(newValue, oldValue) {
      this.update();
    }
  },
  computed: {
    classesAnimation() {
      console.log(this.isPaused);
      return {
        'animation': true,
        'paused': this.isPaused,
        'playing': !this.isPaused,
      }
    },
    classesOverlay() {
      return {
        'animation__overlay': true,
        'animation__overlay--active': this.options.controlsEnable
      };
    },
    footerButtonIcon() {
      return ['fas', this.isPaused ? 'play' : 'pause'];
    },
    buttonFullscreenIcon() {
      return ['fas', this.options.playerFullscreen ? 'compress' : 'expand'];
    },
    isPaused() {
      if(!this.loaded && store.resetState === null) {
        return this.options.startPaused;
      }

      return this?.timeline?.paused || this.paused;
    }
  },
  methods: {
    initBackgroundEffect() {
      const selector = 'animation__canvas-effect';
      const el = this.$el.getElementsByClassName(selector);

      if(el.length) {
        this.$log(`Initializing background effect`)
        this.activeEffect = new SnowEffect(el[0], 200);
      }
    },

    play() {
      this.$log("Playing timeline");

      this.timeline.play();
      this.paused = false;
    },
    pause() {
      this.$log("Pausing timeline");

      this.timeline.pause();
      this.paused = true;
    },
    togglePlay() {
      this.$log("Toggling timeline");

      if(this.timeline.paused) {
        this.play();
      } else {
        this.pause();
      }
    },

    seekStart() {
      this.$log("Seek start");

      this.timeline.pause();
      this.seeking = true;
    },

    /**
     * @param {number} value The time to seek to in percentage of the whole timeline duration
     */
    seekByPercentage(value) {
      const timeInMs = ((value / 100) * this.timeline.duration) || 0;
      this.timeline.seek(((value / 100) * this.timeline.duration) || 0);

      this.$log(`Seeked to ${value}% / ${timeInMs}ms`);
    },

    /**
     * @param {number} value The time to seek to in ms
     */
    seekByTime(value) {
      this.timeline.seek(value);
    },

    seekEnd() {
      this.$log("Seek end");

      if(!this.paused) {
        this.timeline.play();
      }
      this.seeking = true;
    },

    toggleFullscreen() {
      this.$log("Toggling fullscreen");

      if(this.options.editor) {
        this.options.editorShow = !this.options.editorShow;
        this.options.playerFullscreen = !this.options.playerFullscreen;
      }
    },

    onClickOverlay() {
        const dblClickThreshold = 150;
        const dblClickThresholdLate = 500;
        let toggled = false;

        if(!this.timeoutId && !this.timeoutLateId) {

          this.timeoutId = setTimeout(() => {
            // Single click
            this.timeoutId = null;

            if(this.options.controlsEnable || this.options.playerFullscreen) {
              this.togglePlay();
              toggled = true;

              this.timeoutLateId = setTimeout(() => {
                this.timeoutLateId = null;
              }, dblClickThresholdLate);
            }


          }, dblClickThreshold);

        } else {
          // Double click
          clearTimeout(this.timeoutId);

          if(this.timeoutLateId) {
            this.togglePlay();
          }

          this.toggleFullscreen();

          this.timeoutId = null;
          this.timeoutLateId = null;

        }


    },

    createTimeline(stateSnapshot) {
      this.$log("Creating new timeline");

      this.timeline = anime.timeline({
        loop: true,
        autoplay: false
      });

      // Clear previous layer animation inline styles
      Array.prototype.forEach.call(this.$el.querySelectorAll(`.animation__canvas-text .inner, .animation__canvas-text .letter`), function(element){
        element.style.opacity = 1;
        element.style.transform = 'scale(1)';
      });


      // Short pause at the beginning of each loop
      this.timeline
          .add({
            targets: '.animation__canvas',
            opacity: 1,
            duration: 0,
            delay: this.options.durationBefore > 0 ? this.options.durationBefore : 1000
          });

      // Build the animation timeline entries for each input
      for(let inputIndex = 0; inputIndex < this.inputs.length; inputIndex++) {
        const animation = GetAnimation(this.inputs[inputIndex].animation);

        let targetCounter = 0;
        for(const target of animation.targets) {
          // Check if .targets is a callback
          if(target.targets instanceof Function) {
            target.targets = target.targets(inputIndex);
          }

          this.mergeAnimationTargetData(target, targetCounter, inputIndex);
          this.timeline.add(target);

          targetCounter++;
        }
      }

      this.timeline
          .add({
            targets: '.animation__canvas',
            opacity: 1,
            duration: 0,
            delay: this.options.durationAfter > 0 ? this.options.durationAfter : 1
          });

      if(stateSnapshot !== null) {

        if(stateSnapshot.currentTime !== null) {
          let value = Math.min(stateSnapshot.currentTime, this.timeline.duration);
          value = value ? value : 0;
          this.timeline.seek(value);
        }

        if(!stateSnapshot.paused) {
          this.play();
        }

      } else if(!this.loaded) {
        if(!this.options.startPaused) {
          this.play();
        }

      }

      if(!this.loaded) {
        this.$log("Setting loaded to true");
        this.loaded = true;
      }

      this.$log(`Loaded:`, this.loaded);
      this.updateResponsiveFactor();
    },

    /**
     * Remove/dispose a timeline.
     * Anime.js API doesn't provide an intuitive way to dispose an animation.
     * @returns {Promise<unknown>}
     */
    removeTimeline() {
      this.$log("Removing timeline");

      return new Promise(resolve => {
        if(this.timeline) {
          this.timeline.reset();
          this.timeline.children = [];
        }

        this.$nextTick(() => {
          resolve();
        });
      })
    },

    /**
     * Update the timeline.
     */
    update(stateSnapshot = false) {
      this.$log("Updating timeline");

      if(this.isResetting) {
        this.$log(
            "Called update() while already updating, skipping! " +
            "If this keeps popping up and/or causes problems, debounce the update() function!"
        );

      } else {

        const state = stateSnapshot
            ? stateSnapshot
            : this.getStateSnapshot();

        this.$log('Update to state:', state);
        this.isResetting = true;

        this.removeTimeline()
            .then(() => {
              this.createTimeline(state);
              // this.afterUpdate();
              this.isResetting = false;
            });

      }
    },

    /**
     * Set state before updating/resetting the timeline.
     */
    beforeUpdate() {
      this.isResetting = true;

      // Get state that is used to render the UI in between two timelines
      if(this.timeline) {
        this.resetState.currentTime = this.timeline.currentTime;
        this.resetState.paused = this.isPaused;
      }
    },

    getStateSnapshot() {
      return {
        currentTime: this?.timeline?.currentTime || 0,
        paused: this.isPaused
      }
    },

    /**
     * Set state after updating/resetting the timeline.
     */
    afterUpdate() {
      this.isResetting = false;
      this.resetState = {};
    },

    mergeAnimationTargetData(target, targetCounter, inputIndex) {

      // Check if we can apply animation duration
      if(targetCounter % 2 !== 0) {
        // Delay leave
        if(this.options.delayLeave > 0) {
          target.delay = this.options.delayLeave;

        } else if(typeof target.delay !== 'undefined') {
          if(typeof target.delay !== "function") {
            target.delay += this.inputs[inputIndex].delayLeave;

          } else {
            // Store old callback
            const oldDelayCallback = target.delay;
            target.delay = (el, i) => {
              return oldDelayCallback(el, i) + this.inputs[inputIndex].delayLeave;
            }

          }
        } else {
          target.delay = this.inputs[inputIndex].delayLeave;
        }


        // Duration leave
        if(this.options.durationLeave > 0) {
          target.duration = this.options.durationLeave;

        } else if(typeof target.duration !== 'undefined') {
          target.duration += this.inputs[inputIndex].durationLeave;

        } else {
          target.duration = this.inputs[inputIndex].durationLeave;

        }

      } else {
        // Delay enter
        if(this.options.delayEnter > 0) {
          target.delay = this.options.delayEnter;

        } else if(typeof target.delay !== 'undefined') {
          if(typeof target.delay !== "function") {
            target.delay += this.inputs[inputIndex].delayEnter;

          } else {
            // Store old callback
            const oldDelayCallback = target.delay;
            target.delay = (el, i) => {
              return oldDelayCallback(el, i) + this.inputs[inputIndex].delayEnter;
            }

          }

        } else {
          target.delay = this.inputs[inputIndex].delayEnter;
        }

        // Duration enter
        if(this.options.durationEnter > 0) {
          target.duration = this.options.durationEnter;

        } else if(typeof target.duration !== 'undefined') {
          target.duration += this.inputs[inputIndex].durationEnter;

        } else {
          target.duration = this.inputs[inputIndex].durationEnter;

        }
      }
    },

    updateResponsiveFactor() {
      this.playerResponsiveFactor = this.$el.offsetWidth / 100;
    },

    onHmrUpdateComplete(status) {
      this.$log(`HMR Status: ${status}`);

      switch(status) {
        case 'prepare':
          // this.beforeUpdate();
          // console.log("########################");
          // console.log(this.loaded);
          // console.log(this.options.startPaused);
          // console.log(this.paused);
          // console.log(this.timeline.paused);
          // console.log(this.isPaused);
          // console.log("#########################");
          store.resetState = this.getStateSnapshot();
          break;

        case 'idle':
          this.update(store.resetState);
          store.resetState = null;
          break;
      }

      this.$log('Store resetState after HMR update:', store.resetState);
    }
  }
};
</script>

<template>
    <div class="player">
      <template v-if="!standalone || options.playerFullscreen">
        <div class="advanced-header" v-if="options.advancedHeader">
          <span class="advanced-header__secondary">&nbsp;</span>
          <h3 class="advanced-header__primary">{{ $t("headerPreview") }}</h3>
        </div>
        <h3 v-else>{{ $t("headerPreview") }}</h3>
      </template>

      <div :class="classesAnimation">
        <div class="animation__canvas">
          <div class="animation__canvas-effect"></div>

          <animation-layer v-for="(input, key) in inputs"
                           :class="['animation__canvas-text', 'animation__canvas-text--' + key]"
                           :input="input"
                           :key="key"
                           :responsiveFactor="playerResponsiveFactor"/>
        </div>

        <div :class="classesOverlay" v-on:click="onClickOverlay"></div>


        <div class="animation__footer" v-if="options.controlsEnable || options.playerFullscreen">
          <div class="animation__footer__inner">
            <player-progress-bar
                :timeline="timeline"
                :is-resetting="isResetting"
                v-on:drag-start="seekStart"
                v-on:drag-end="seekEnd"
                v-on:change="seekByPercentage"/>

            <player-button :icon="footerButtonIcon" v-on:click="togglePlay"/>
            <player-button :icon="buttonFullscreenIcon" v-on:click="toggleFullscreen"/>
          </div>
        </div>

        <a :href="options.baseUrl" class="animation__watermark" v-if="options.watermark">
          <img :src="options.watermark">
        </a>
      </div>
    </div>
</template>

<style lang="scss">
@import 'css/default.scss';
@import 'css/vue-slider.scss';
@import 'css/effects/snow.scss';

.animation {
  position: relative;
  aspect-ratio: 16/9;
  width: 100%;

  grid-column: 2 / 4;
  grid-row: 1;

  border-radius: $borderRadius;

  overflow: hidden;

  &__canvas {
    transform: translateZ(0); // Force-enable 3D acceleration
    width: 100%;
    height: 100%;
    text-align: center;
    background: $colorPrimary;
    font-weight: 900;
    font-size: 10px;
    color: #fff;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.25);

    user-select: none; // Prevents selecting text

    &-effect {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  &__watermark {
    position: absolute;
    bottom: 4%;
    right: 4%;
    width: 15%;

    img {
      width: 100%;
      user-select: none;
    }
  }

  &__overlay {
    position: absolute;
    height: 100%;
    width: 100%;
    bottom: 0;

    &--active {
      cursor: pointer;
    }
  }

  &__footer {
    position: absolute;
    display: flex;
    height: 5.6rem;
    width: 100%;
    bottom: -50px;
    margin-top: -4px;
    box-shadow: inset 0 -64px 48px -48px rgba(0, 0, 0, 0.75);
    opacity: 0;
    transition: opacity $transitionDuration, bottom $transitionDuration;

    &__inner {
      height: 50%;
      bottom: 0;
      position: absolute;
      width: 100%;
      display: flex;
    }

  }

  // Footer depends on parent
  &:hover, &.paused {
    .animation__footer {
      opacity: 1;
      bottom: 0;
    }
  }
}
</style>