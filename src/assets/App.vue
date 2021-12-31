<script>
import EditorComponent from "./Editor";
import PlayerComponent from "./Player";
import PanelComponent from "./Panel";
import TransitionPanelComponent from "./TransitionPanel";
import TransitionPanelContainerComponent from "./TransitionPanelContainer";
import LocaleChangerComponent from "./LocaleChanger";

import EditorInputData from "./js/types/editor-input-data.js";

export default {
  components: {
    'editor': EditorComponent,
    'player': PlayerComponent,
    'panel': PanelComponent,
    'transition-panel': TransitionPanelComponent,
    'transition-panel-container': TransitionPanelContainerComponent,
    'locale-changer': LocaleChangerComponent,
  },
  // props: {
  //   demo: {
  //     type: Boolean,
  //     default: false
  //   },
  //   editor: {
  //     type: Boolean,
  //     default: false
  //   },
  //   player: {
  //     type: Boolean,
  //     default: true
  //   },
  //
  //   editorShow:  {
  //     type: Boolean,
  //     default: true
  //   }, // STATE
  //   playerShow:  {
  //     type: Boolean,
  //     default: true
  //   }, // STATE
  //
  //   baseUrl: {
  //     type: String,
  //     default: 'http://localhost:8080'
  //   },
  //   playerUrl: {
  //     type: String,
  //     default: 'player'
  //   },
  //   startPaused: {
  //     type: Boolean,
  //     default: false
  //   },
  //   controlsEnable: {
  //     type: Boolean,
  //     default: true
  //   }, // STATE
  //   logging: {
  //     type: Boolean,
  //     default: true
  //   },
  //
  //   defaultValue: {
  //     type: String,
  //     default: 'Textzeile {i}'
  //   },
  //   defaultLayers: {
  //     type: Number,
  //     default: 3
  //   },
  //   maxLayers: {
  //     type: [Boolean, Number],
  //     default: false
  //   },
  //   maxLength: {
  //     type: [Boolean, Number],
  //     default: false
  //   },
  //
  //   sharerTitle: {
  //     type: String,
  //     default: 'Weihnachtsgrüße mit Webcoached:'
  //   },
  //   sharerHashtags:{
  //     type: Array,
  //     default: ['Christmas', 'Webcoached']
  //   },
  //
  //   buttonClasses: {
  //     type: String,
  //     default: ''
  //   }
  // },
  data() {
    return {
      /**
       * Application options
       * Default values are showing the player and hiding the editor.
       * FIXME: These options are partly used as state (show, controlsEnable) but should be treated as "readonly"
       */
      options: {
        demo: false,                                      // {Boolean} Enable the demo panel
        editor: false,                                    // {Boolean} Enable the editor panel
        player: true,                                     // {Boolean} Enable the player panel

        baseUrl: 'http://localhost:8080',                 // {String} URL used by the app
        playerUrl: 'player',                              // {String} Page URL for "Generate link"
        editorUrl: 'editor',                              // {String} Page URL for "Open generator"
        watermark: false,                                 // {String} URL for watermark image
        startPaused: false,                               // {Boolean} Pause or play on load
        allowInputOptions: false,                         // {Boolean} Allow opening advanced input options on focus
        showOpenGeneratorPanel: true,
        logging: true,                                    // {Boolean} Enable logging

        // New options for default animation timings, not connected yet
        durationBefore: 0,                                // {Number} Wait before starting the animation
        durationAfter: 0,                                 // {Number} Wait after ending the animation
        delayEnter: 0,                                    // {Number} Wait before fading in each animation layer
        durationEnter: 0,                                 // {Number} Duration for fading in each animation layer
        delayLeave: 0,                                    // {Number} Wait before fading out each animation layer
        durationLeave: 0,                                 // {Number} Duration for fading out each animation layer

        advancedHeader: true,                             // {Boolean} Experimental: Enable headers with separate step
        timeline: true,                                   // {Boolean} Enable timeline
        timelineDecorations: false,                       // {Boolean} Enable timeline marks and tooltip

        defaultValue: 'Textzeile {i}',                    // {String} Layer default value; Replacements: {i} = current
        defaultLayers: 3,                                 // {Number} Number of example layers to be added on empty data
        maxLayers: false,                                 // {Boolean|Number} Disable with false, or limit with a number
        maxLength: false,                                 // {Boolean|Number} Disable with false, or limit with a number

        sharerSubject: 'Weihnachtsgrüße mit Improved Reading',   // {String} Text used by the social sharing buttons
        sharerTitle: 'Zu den Weihnachtsgrüßen mit Improved Reading:',   // {String} Text used by the social sharing buttons
        sharerHashtags: ['Christmas2021', 'ImprovedReading'],      // {String[]} Hashtags used by the social sharing buttons

        buttonClasses: '',                                // {String} Additional CSS classes for site specific styling

        editorShow: true,                                 // {Boolean} STATE Set to current editor opened state.
        playerShow: true,                                 // {Boolean} STATE Set to current player opened state.
        controlsEnable: true,                             // {Boolean} STATE Always same as editorShow, can be removed
        playerFullscreen: false,                          // {Boolean} STATE Set to current "fullscreen" state.

      },

      /**
       * Collection of inputs used by the editor and player
       * TODO: Rename to layers??
       */
      inputs: []
    }
  },
  i18n: {
    messages: {
      de: {
        showEditor: "Editor einblenden",
        hideEditor: "Editor ausblenden",
        showPlayer: "Player einblenden",
        hidePlayer: "Player ausblenden",
        headerDemo: 'Demo Einstellungen',
        openGeneratorText:
            'Sie möchten auch Ihre Familie oder Freunde auf diese Weise Grüßen?\n' +
            'Nutzen Sie unseren Grüße-Generator und verschicken Sie Ihren individuellen Link zu Ihren persönlichen Grüßen.'
      },
      en: {
        showEditor: "Show editor",
        hideEditor: "Hide editor",
        showPlayer: "Show player",
        hidePlayer: "Hide player",
        headerDemo: 'Demo settings',
        openGeneratorText:
            'You also want to greet your family or friends in this way?\n' +
            'Use our greetings generator and send your individual link to your personal greetings.'
      }
    }
  },
  beforeMount: function() {
    this.$log("BeforeMounted");
    this.loadOptions();
    this.loadData();
  },
  mounted: function() {
    this.$log("Mounted");
  },
  watch: {
    'options.editorShow'(newValue, oldValue) {
      // Enable player controls if the editor is visible
      // this.options.player.controlsEnable = newValue;
      this.options.controlsEnable = newValue;
    }
  },
  computed: {
    generatorUrl() {
      return new URL(this.options.editorUrl, this.options.baseUrl);
    }
  },
  methods: {
    loadOptions() {
      this.$log("Loading options...");

      /* global animatedGreetingsOptions */
      if(typeof animatedGreetingsOptions !== 'undefined') {
        this.$log('Found options!', animatedGreetingsOptions);

        for(const key in this.options) {
          if(animatedGreetingsOptions.hasOwnProperty(key)) {
            this.options[key] = animatedGreetingsOptions[key];
          }
        }
      }

      this.options.editorShow = this.options.editor;
      this.options.playerShow = this.options.player;

      this.options.controlsEnable = this.options.editorShow;
    },

    loadData() {
      this.$log("Loading data...");

      /* global animatedGreetingsData */
      if(typeof animatedGreetingsData !== 'undefined') {
        this.$log('Found data!', animatedGreetingsData);

        this.$data.inputs = animatedGreetingsData?.inputs ?? [];
      }

      // Load dummy data defined by options if nothing was loaded from animatedGreetingsData
      if(!this.inputs.length) {
        for(let i = 0; i < this.options.defaultLayers; i++) {
          const inputValue = EditorInputData.fillPlaceholderString(this.options.defaultValue, this.inputs.length + 1);
          this.inputs.push(EditorInputData.createInstance(inputValue));
        }

        this.$log('Created dummy data:', this.inputs);

      }

    },

    updatePlayer() {
      if(this.$refs.player) {
        this.$refs.player.update();
      }
    },

    /**
     * TODO: Just some testing to open the editor via external JS, not from within the component
     * @param tryOpenInline
     * @param newTab
     */
    onClickGoToGeneratorExternal(tryOpenInline, newTab = false) {
      var editorOpened = false;

      // Try to open the editor from the player that is loaded on the page
      if(tryOpenInline && window.AnimatedGreetings) {
        window.AnimatedGreetings.$children[0].options.editor = true;
        window.AnimatedGreetings.$children[0].options.editorShow = true;
        editorOpened = true;
      }

      if(!editorOpened) {
        var url = new URL(this.options.editorUrl , this.options.baseUrl);

        if(newTab) {
          window.open(url);
        } else {
          window.location = url;
        }
      }

    }
  }
};

</script>

<template>
  <div class="animated-greetings">

    <panel v-if="options.demo">
      <h3>{{ $t('headerDemo') }}</h3>
      <div class="align-center">
        <button :class="['editor__button', ...options.buttonClasses]" v-on:click="options.editorShow = !options.editorShow" v-if="options.editor">{{ $t(options.editorShow ? 'hideEditor' : 'showEditor' ) }}</button>
        <button :class="['editor__button', ...options.buttonClasses]" v-on:click="options.playerShow = !options.playerShow" v-if="options.player">{{ $t(options.playerShow ? 'hidePlayer' : 'showPlayer' ) }}</button>
        <locale-changer/>
      </div>
    </panel>

    <transition-panel-container :has-gap="options.editorShow && options.playerShow && !options.playerFullscreen">
      <transition-panel v-if="options.editor" :show="options.editorShow" :colored="true">
        <editor
            ref="editor"
            :inputs="inputs"
            :options="options"
            v-on:update="updatePlayer"/>
      </transition-panel>

      <transition-panel v-if="options.player" :show="options.playerShow" :colored="options.editorShow" v-on:after-enter="updatePlayer">
          <player
              key="player"
              ref="player"
              :inputs="inputs"
              :options="options"
              :standalone="!options.editorShow"/>
      </transition-panel>

    </transition-panel-container>

    <div class="align-center" style="padding: 0 1.5rem;" v-if="options.showOpenGeneratorPanel && !options.editorShow && !this.options.playerFullscreen">
<!--        <span>-->
<!--          {{ $t('openGeneratorText') }}-->
<!--        </span>-->
        <span>
          Sie möchten auch Ihre Familie oder Freunde auf diese Weise grüßen? Nutzen Sie unseren kostenlosen Generator,
          geben Sie Ihren Text ein und verschicken anschließend einfach nur einen Link zu Ihren persönlichen Grüßen.
          Kein Registrieren, keine Passwörter. Einfach so, weil es Spaß macht!
        </span>
      <a :class="['editor__button', ...options.buttonClasses]" :href="generatorUrl" target="_blank">Zum Generator</a>
    </div>

  </div>
</template>

<style lang="scss">
@import 'css/default.scss';
@import 'css/vue-slider.scss';


.advanced-header {
  display: block;
  margin-bottom: 1rem;

  &__secondary {
    color: #333;
    font-weight: 700;
  }

  &__primary {
    margin: 0;
    line-height: 1em;
  }
}

.animated-greetings {
  display: flex;
  flex-direction: column;
  width: 100%;
  grid-gap: $gridGap;

  font-family: 'Source Sans Pro', sans-serif;

  h1, h2, h3, h4, h5, h6, p {
    margin: 0 0 1rem 0;
  }

  .margin-none {
    margin: 0;
  }

  .align-center {
    display: flex;
    align-items: center;
    grid-gap: $gridGap;

    @media screen and (max-width: $medium) {
      flex-direction: column;
      align-items: stretch;
    }
  }
}
</style>