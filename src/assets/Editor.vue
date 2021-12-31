<script>
/* Components */
import EditorInputComponent from "./EditorInput";
import EditorButtonComponent from "./EditorButton";
import SharerComponent from './Sharer.vue';

/* Modules */
import Api from "./js/api.js";

/* Type Definitions */
import EditorInputData from "./js/types/editor-input-data.js";

export default {
  components: {
    'editor-input': EditorInputComponent,
    'editor-button': EditorButtonComponent,
    'sharer': SharerComponent
  },
  data() {
    return {
      activeInput: null,
      uid: null
    }
  },
  props: {
    inputs: Array,
    options: Object
  },
  mounted: function() {
    this.$log("Mounted");
  },
  watch: {

  },
  computed: {
    hasMinInputs() {
      return this.inputs.length === 1;
    },
    hasMaxInputs() {
      if(this.options.maxLayers) {
        return this.inputs.length === this.options.maxLayers;
      }

      return false;
    },
    hasInputValues() {
      for(let i = 0; i < this.inputs.length; i++) {
        if(this.inputs[i] && this.inputs[i].value !== '') {
          return true;
        }
      }
      return false;
    },
    getPlayerLink() {
      if(!this.uid) {
        return null;
      }

      const url = new URL(this.options.playerUrl, this.options.baseUrl);
      url.searchParams.append("greetings", this.uid);

      return url.href;
    },
    getApiLink() {
      return new URL('wp-json/greetings/v1/link', this.options.baseUrl).href;
    }
  },
  methods: {
    addInput() {
      this.$log(`Adding input`);

      if(!this.hasMaxInputs) {
        this.inputs.push(this.getNewInput(this.inputs.length))
      }
      this.uid = null;
    },

    updateInput(index, value) {
      this.$log(`Updating input`, index, value);

      this.inputs[index].value = value;
      this.uid = null;
      this.updatePlayer();
    },

    /**
     * Clear the input value
     * @param index
     */
    resetInput(index) {
      this.$log(`Clearing input`, index);
      this.$set(this.inputs, index, this.getNewInput(index, false));
    },

    /**
     * Removes the input from the collection
     * @param index
     */
    deleteInput(index) {
      this.$log(`Deleting input`, index);

      if(this.activeInput === index) {
        this.setActiveInput(null)
      }

      this.inputs.splice(index, 1);
    },

    /**
     * Remove or cl
     * @param index
     */
    removeInput(index) {
      if(this.hasMinInputs) {
        this.resetInput(0);
      } else {
        this.deleteInput(index);
      }
      this.uid = null;
    },

    setActiveInput(index) {
      this.$log(`Setting active input`, index);

      this.activeInput = index;
    },

    updatePlayer() {
      this.$log(`Triggering 'update' event`);
      this.$emit('update');
    },

    generateLink() {
      this.$log(`Generating link`);

      Api.generateLink(this.getApiLink, this.inputs)
        .then((uid) => {
          this.uid = uid;
          this.$log({
            uid: uid,
            link: this.getPlayerLink
          });
        })
        .catch(err => {
          this.$log(err);
        });
    },

    reset() {
      this.$log(`Resetting`);

      const inputs = [];

      for(let i = 0; i < this.options.defaultLayers; i++) {
        inputs.push(this.getNewInput(i));
      }

      this.inputs = inputs;
    },

    getNewInput(index, populateValue = true) {
      const inputValue = populateValue
          ? EditorInputData.fillPlaceholderString(this.options.defaultValue, index + 1)
          : '';

      return EditorInputData.createInstance(inputValue);
    },
  },
  i18n: { // `i18n` option, setup locale info for component
    messages: {
      de: {
        // headerLayers: 'Schritt 1: Schreibe deine Grüße',
        step: 'Schritt',
        headerLayers: 'Grüße schreiben',
        textLayers: 'Geben Sie hier Zeile für Zeile Ihre Grüße ein.',
        headerLink: 'Link teilen',
        textLink: '„Zerlegen“ Sie Ihren Grußtext in Wortgruppen. Am besten lässt sich das Ergebnis lesen, wenn es im Durchschnitt zwei bis maximal vier Wörter pro Textzeile sind und die Wortgruppen in sich eine inhaltlich sinnvolle Einheit bilden. <a href="/generator-tipps" target="_blank">Hier</a> finden Sie paar weitere Tipps dazu.',
        // textLink: 'Klicken Sie auf "Link generieren" und teilen Sie ihn anschließend mit Freunden, der Familie oder Ihren Lieblings-Kollegen!',
        textLinkAfter: 'Sie können den Link jetzt kopieren oder ihn direkt über die verschiedenen Sozialen Netzwerke teilen.',
        maximumReached: 'Maximum erreicht',
        inputPlaceholder: 'Schreibe etwas'
      },
      en: {
        headerLayers: 'Step 1: Write your greetings',
        textLayers: 'Enter your greetings line by line.',
        headerLink: 'Step 2: Share your link',
        textLink: 'Click "Generate link" and then send your personal link to friends, family or your favorite colleagues!',
        maximumReached: 'Maximum reached',
        inputPlaceholder: 'Write something'
      }
    }
  }
};

</script>

<template>
    <div class="editor">
      <section>
        <div class="advanced-header" v-if="options.advancedHeader">
          <span class="advanced-header__secondary">{{ $t("step") }} 1</span>
          <h3 class="advanced-header__primary">{{ $t("headerLayers") }}</h3>
        </div>
        <h3 v-else>{{ $t("step") }} 1: {{ $t("headerLayers") }}</h3>

        <p>
          „Zerlegen“ Sie Ihren Grußtext in Wortgruppen.
          Am besten lässt sich das Ergebnis lesen, wenn
          es im Durchschnitt zwei bis maximal vier Wörter pro Textzeile
          sind und die Wortgruppen in sich eine inhaltlich sinnvolle Einheit bilden.
          <a href="/generator-tipps">Hier</a> finden Sie paar weitere Tipps dazu.
        </p>

        <editor-input v-for="(input, key) in inputs"
                      v-on:input="updateInput"
                      v-on:focus="setActiveInput"
                      v-on:change="updatePlayer"
                      v-on:click-delete="removeInput"
                      v-on:settings-close="setActiveInput(null)"
                      :allow-input-options="options.allowInputOptions"
                      :max-length="options.maxLength"
                      :selected="activeInput === key"
                      :placeholder="$t('inputPlaceholder')"
                      :value="inputs[key]"
                      :key="key" />

        <editor-button :class="['editor__button--dashed editor__button--fullwidth margin-none', ...options.buttonClasses]" :disabled="hasMaxInputs" v-on:click="addInput">
          <span v-if="hasMaxInputs">{{ $t("maximumReached") }}</span>
          <span v-else><font-awesome-icon icon="plus"/></span>
        </editor-button>
      </section>

      <section>
        <div class="advanced-header" v-if="options.advancedHeader">
          <span class="advanced-header__secondary">{{ $t("step") }} 2</span>
          <h3 class="advanced-header__primary">{{ $t("headerLink") }}</h3>
        </div>
        <h3 v-else>{{ $t("step") }} 2: {{ $t("headerLink") }}</h3>

<!--        <p>{{ $t(this.uid ? 'textLinkAfter' : 'textLink') }}</p>-->
        <p>
          Klicken Sie auf "Link generieren" und teilen Sie
          diesen individuellen Link anschließend mit Freunden,
          der Familie oder Ihren Lieblings-Kolleg*innen!
        </p>

        <sharer :url="getPlayerLink"
                :subject="options.sharerSubject"
                :title="options.sharerTitle"
                :hashtags="options.sharerHashtags"
                :options="options"
                v-on:click-generate="generateLink"/>
      </section>
    </div>
</template>

<style lang="scss">
@import 'css/default.scss';
@import 'css/vue-slider.scss';

.editor {
  display: flex;
  flex-direction: column;
  grid-gap: $gridGap;
}
</style>