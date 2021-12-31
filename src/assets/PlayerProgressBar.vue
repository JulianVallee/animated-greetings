<script>
import {progressAsSecondsFormatter} from './js/formatters';

// const marksFormatter = (markIndex, marksCount, labelLast) => {
//   let index = markIndex + 1;
//
//   if(labelLast && index === marksCount) {
//     return labelLast;
//   }
//
//   return index;
//   // return index < marksCount
//   //     ? index
//   //     : this.$t(labelLast);
// };

export default {
  props: {
    timeline: {
      type: Object|null,
      default: false,
      required: true
    },
    isResetting: {
      type: Boolean,
      default: false,
      required: true
    },
    // isPaused: {
    //   type: Boolean,
    //   default: false,
    //   required: false
    // },
    showMarkLabels: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      tooltip: 'always',
      marksLabels: true,

      marks: {},
      statePrevious: {
        progress: null
      },
    }
  },
  i18n: {
    messages: {
      de: {
        end: 'Ende'
      },
      en: {
        end: 'End'
      }
    }
  },
  mounted() {
    this.$log("Mounted");
  },
  computed: {
    progress() {
      return this.isResetting
          ? this.statePrevious.progress
          : this?.timeline?.progress ?? 0;
    }
  },
  watch: {
    timeline() {
      this.updateMarks();

    },
    isResetting(newVal, oldVal) {
      if(newVal && newVal !== oldVal) {
        this.statePrevious.progress = this?.timeline?.progress || 0;
      }
    }
  },
  methods: {
    updateMarks() {
      this.$log("Updating timeline marks");

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

          if(this.marksFormatter instanceof Function) {
            label = this.marksFormatter(position, markIndex, marksCount);
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

      this.marks = marks;
    },

    // onTimelineSliderMouseDown() {
    //   this.timeline.pause();
    // },
    //
    // onTimelineSliderMouseUp() {
    //   // The timeline is paused while dragging the slider,
    //   // but the animation is not paused.
    //   if(!this.isPaused) {
    //     this.timeline.play();
    //   }
    // },
    //
    // /**
    //  * @param {number} value A number between 0 and 100
    //  * @param index
    //  */
    // onTimelineSliderInput(value, index) {
    //   value = this.timeline.duration * (value / 100);
    //   this.timeline.seek(value ? value : 0);
    // },
    //
    // seekPercentage(value, index) {
    //   this.timeline.seek(((value / 100) * this.timeline.duration) || 0);
    // },

    marksFormatter(value, markIndex, marksCount) {
      let index = markIndex + 1;

      if(index === marksCount) {
        return this.$t('end');
      }

      return index;
    },

    tooltipFormatter(value) {
      return progressAsSecondsFormatter(value, this?.timeline?.duration || 0);
    }

  }
};
</script>

<template>
  <vue-slider class="player__progress-bar"
              :value="progress"
              :marks="marks"
              :tooltip="tooltip"
              :tooltip-formatter="tooltipFormatter"
              :hide-label="!marksLabels"
              :duration="0"
              :drag-on-click="true"
              v-on:drag-start="$emit('drag-start')"
              v-on:drag-end="$emit('drag-end')"
              v-on:change="(value) => $emit('change', value)"/>
<!--              v-on:drag-start="onTimelineSliderMouseDown"-->
<!--              v-on:drag-end="onTimelineSliderMouseUp"-->
<!--              v-on:change="onTimelineSliderInput"/>-->
</template>

<style lang="scss">
@import 'css/default.scss';
@import 'css/vue-slider.scss';
@import 'css/effects/snow.scss';

.player {
  &__progress-bar {
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