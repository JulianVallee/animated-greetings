<script>
/* Components */
import AnimationLayerComponent from "./AnimationLayer";

/* Modules */
import anime from 'animejs/lib/anime.es.js';
import snow from '../assets/js/snow.js';

/* Data */
import { GetAnimation } from "./js/animations";

export default {
  components: {
    'animation-layer': AnimationLayerComponent
  },
  props: {
    inputs: Array,
    options: Object,
    standalone: Boolean
  },
  data() {
    return {
      loaded: false,

      paused: false,

      isResetting: false,

      resetState: {
        inputLength: 0,
        progress: 0,
        duration: null,
        currentTime: null,
        paused: false
      },

      timeline: null,

      timelineOptions: {
        // See https://nightcatsama.github.io/vue-slider-component/#/basics/tooltip
        tooltip: 'always',

        // See https://nightcatsama.github.io/vue-slider-component/#/basics/tooltip
        tooltipFormatter: value => this.formatTime(value),

        // See https://nightcatsama.github.io/vue-slider-component/#/basics/marks
        marks: {},

        // Custom implementation
        marksFormatter: (value, markIndex, marksCount) => {
          const isLastMark = markIndex === marksCount;
          return isLastMark
              ? this.$t('end')
              : markIndex + 1
        }
      },

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
  mounted() {
    this.log("Mounted");

    snow.init(this.$el.getElementsByClassName('animation__canvas-effect')[0], 200);

    // Call it once for initialization
    this.updateResponsiveFactor();
    this.resizeObserver = new ResizeObserver(this.updateResponsiveFactor);
    this.resizeObserver.observe(this.$el);

    this.update();
  },
  unmounted() {
    this.resizeObserver.unobserve(this.$el);
  },
  watch: {
    inputs(dataNew, dataOld) {
      this.log("Watcher 'inputs' triggered");

      // We only need to reset if elements got added/removed,
      // not if their content changes
      if(dataNew.length !== this.inputsLengthOld) {
        this.update();
      }

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
      return {
        'animation': true,
        'paused': this.isPaused
      }
    },
    classesOverlay() {
      return {
        'animation__overlay': true,
        'animation__overlay--active': this.options.controlsEnable
      };
    },
    footerButtonIcon() {
      return this.isPaused ? 'play' : 'pause';
    },
    buttonFullscreenIcon() {
      return ['fas', this.options.playerFullscreen ? 'compress' : 'expand'];
    },
    isPaused() {
      if(!this.loaded) {
        return this.options.startPaused;
      }

      return this.timeline.paused || this.paused;
    },
    timelineProgress() {
      return this.isResetting
          ? this.resetState.progress
          : this.timeline ? this.timeline.progress : 0;
    },
  },
  methods: {
    play() {
      this.log("Playing timeline");

      this.timeline.play();
      this.paused = false;
    },
    pause() {
      this.log("Pausing timeline");

      this.timeline.pause();
      this.paused = true;
    },
    togglePlay() {
      this.log("Toggling timeline");

      if(this.timeline.paused) {
        this.play();
      } else {
        this.pause();
      }
    },
    toggleFullscreen() {
      this.log("Toggling fullscreen");

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

    createTimeline() {
      this.log("Creating new timeline");

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

      this.updateTimelineMarks();

      if(!this.loaded) {
        this.loaded = true;

        if(!this.options.startPaused) {
          this.play();
        }

      } else {
        if(this.resetState.currentTime !== null) {
          let value = Math.min(this.resetState.currentTime, this.timeline.duration);
          value = value ? value : 0;
          this.timeline.seek(value);
        }

        if(!this.resetState.paused) {
          this.play();
        }
      }

      this.updateResponsiveFactor();
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

    /**
     * Remove/dispose a timeline.
     * Anime.js API doesn't provide an intuitive way to dispose an animation.
     * @returns {Promise<unknown>}
     */
    removeTimeline() {
      this.log("Removing timeline");

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
    update() {
      this.log("Resetting timeline");

      if(this.isResetting) {
        this.log(
            "Called update() while already resetting! " +
            "If this keeps popping up and/or causes problems, debounce the update() function!"
        );

      } else {
        this.beforeUpdate();
        this.removeTimeline()
            .then(() => {
              this.createTimeline();
              this.afterUpdate();
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
        this.resetState.progress = this.timeline.progress;
        this.resetState.duration = this.timeline.duration;
        this.resetState.currentTime = this.timeline.currentTime;
        this.resetState.paused = this.isPaused;
      }
    },

    /**
     * Set state after updating/resetting the timeline.
     */
    afterUpdate() {
      this.isResetting = false;
      this.resetState = {};
    },

    updateTimelineMarks() {
      this.log("Updating timeline marks");

      const marks = {};

      let position = 0;
      let markIndex = 0;
      const markPosition = 'peak';
      let captureMark = false;


      // We have one in, one out and one for additional delay, therefore this is 3
      // TODO: Automatically set this depending on the used animation
      const targetsPerMark = 2;
      const childCount = this.timeline.children.length;
      const marksCount = (childCount - 2) / targetsPerMark;

      for(let childIndex = 0; childIndex < childCount; childIndex++) {
        switch(markPosition) {
          case 'start':
            captureMark = childIndex > 0 && childIndex < childCount - 1 && childIndex % targetsPerMark !== 0;
            break;

          case 'peak':
            captureMark = childIndex > 1 && childIndex < childCount - 1 && childIndex % targetsPerMark === 0;
            break;

          case 'end':
            captureMark = childIndex > 2 && childIndex && childIndex % targetsPerMark !== 0;
            break;
        }

        if(captureMark) {
          let label = position;

          if(this.timelineOptions.marksFormatter instanceof Function) {
            label = this.timelineOptions.marksFormatter(position, markIndex, marksCount);
          }

          // Add position and label
          marks[`${position}`] = {
            label: label
          };

          // Increment the displayed label index
          markIndex++;
        }

        // Increment afterwards
        position += this.timeline.children[childIndex].duration / this.timeline.duration * 100;
      }

      this.timelineOptions.marks = marks;
    },
    formatTime(value) {
      if(!this.timeline) {
        return '0s';
      }

      const normalized = value / 100;

      return `${Math.round(normalized * this.timeline.duration / 100) / 10}s`;
    },

    onTimelineSliderMouseDown() {
      this.timeline.pause();
    },
    onTimelineSliderMouseUp() {
      // The timeline is paused while dragging the slider,
      // but the animation is not paused.
      if(!this.paused) {
        this.timeline.play();
      }
    },
    onTimelineSliderInput(value, index) {
      value = this.timeline.duration * (value / 100);
      value = value ? value : 0;
      this.timeline.seek(value);
    },

    updateResponsiveFactor() {
      this.playerResponsiveFactor = this.$el.offsetWidth / 100;
    },
  },
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
                           :responsiveFactor="playerResponsiveFactor" />
        </div>

        <div :class="classesOverlay" v-on:click="onClickOverlay"></div>


        <div class="animation__footer" v-if="options.controlsEnable || options.playerFullscreen">
          <div class="animation__footer__inner">
            <vue-slider class="animation__timeline-slider"
                        :value="timelineProgress"
                        :marks="timelineOptions.marks"
                        :tooltip="options.timelineDecorations ? timelineOptions.tooltip : 'none'"
                        :tooltip-formatter="timelineOptions.tooltipFormatter"
                        :hide-label="!options.timelineDecorations"
                        :duration="0"
                        :drag-on-click="true"
                        v-on:drag-start="onTimelineSliderMouseDown"
                        v-on:drag-end="onTimelineSliderMouseUp"
                        v-on:change="onTimelineSliderInput"
                        v-if="options.timeline"/>

            <div class="animation__footer-button" v-on:click="togglePlay()">
              <font-awesome-icon :icon="footerButtonIcon" />
            </div>

            <div class="animation__footer-button" v-on:click="toggleFullscreen()">
              <font-awesome-icon :icon="buttonFullscreenIcon" />
            </div>
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

  // Footer depends on parent
  &:hover, &.paused {
    .animation__footer {
      opacity: 1;
      bottom: 0;
    }
  }

  &__timeline-slider {
    position: absolute !important;
    width: 100% !important;
    top: 0;
    left: 0;
    cursor: pointer;
    z-index: 1;
    margin: -11px auto 0 auto;

    .vue-slider-dot-handle {
      display: none;
    }

    .vue-slider-process {
      background-color: $playerSliderProgressColor;
    }

    .vue-slider-rail {
      background-color: $playerSliderRailColor;
    }
  }
}
</style>