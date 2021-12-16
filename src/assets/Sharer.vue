<script>
import InputClipboardComponent from "./InputClipboard";
import EditorButtonComponent from "./EditorButton";
import SharerSocialButtonComponent from './SharerSocialButton.vue';

export default {
  components: {
    'input-clipboard': InputClipboardComponent,
    'editor-button': EditorButtonComponent,
    'sharer-social-button': SharerSocialButtonComponent
  },
  data() {
    return {
      // options: {
      //   logging: {
      //     enabled: true,
      //     name: "Sharer"
      //   }
      // }
    }
  },
  props: {
    url: String,
    title: String,
    hashtags: Array,
    options: Object
  },
  i18n: {
    messages: {
      de: {
        generateLink: 'Link generieren',
        sharerText: 'Oder teile deinen Link in verschiedenen Messengern und Sozialen Netzwerken.'
      },
      en: {
        generateLink: 'Generate link',
        sharerText: ''
      }
    }
  },
  methods: {
    copyLink() {
      this.log(`Copying link to clipboard`);
      navigator.clipboard.writeText(this.url);
    },
  },
};
</script>

<template>
  <div class="sharer">
    <editor-button :class="options.buttonClasses" v-on:click="$emit('click-generate')" v-if="!url">
      {{ $t("generateLink") }}
    </editor-button>

    <template v-else>
      <input-clipboard placeholder="Share Link" :value="url" v-on:click="copyLink"/>

      <p>
        Direkt teilen:
      </p>

      <div class="sharer__social-button-container">
        <sharer-social-button
            :sharer="'email'"
            :subject="title"
            :title="title"
            :url="url">
          <font-awesome-icon :icon="['far', 'envelope']" size="2x"/>
        </sharer-social-button>
        <sharer-social-button
            :sharer="'whatsapp'"
            :title="title"
            :url="url"
            :web="true">
          <font-awesome-icon :icon="['fab', 'whatsapp']" size="2x" style="color: #25D366;"/>
        </sharer-social-button>
        <sharer-social-button
            :sharer="'linkedin'"
            :url="url">
          <font-awesome-icon :icon="['fab', 'linkedin']" size="2x" style="color: #0e76a8;"/>
        </sharer-social-button>
        <sharer-social-button
            :sharer="'xing'"
            :url="url">
          <font-awesome-icon :icon="['fab', 'xing-square']" size="2x" style="color: #026466;"/>
        </sharer-social-button>
        <sharer-social-button
            :sharer="'facebook'"
            :hashtag="hashtags[0]"
            :title="title"
            :url="url">
          <font-awesome-icon :icon="['fab', 'facebook']" size="2x" style="color: #4267B2;"/>
        </sharer-social-button>
        <sharer-social-button
            :sharer="'twitter'"
            :hashtags="hashtags"
            :title="title"
            :url="url">
          <font-awesome-icon :icon="['fab', 'twitter']" size="2x" style="color: #1DA1F2;"/>
        </sharer-social-button>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
@import 'css/default.scss';

.sharer {
  //display: flex;
  //flex-direction: column;
  //grid-gap: $gridGap;

  &__social-button-container {
    display: flex;
    justify-content: center;
    grid-gap: 1rem;
  }
}
</style>