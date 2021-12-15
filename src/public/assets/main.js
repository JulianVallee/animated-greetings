/**
 * Core libraries
 */
import Vue from "vue";
import VueI18n from 'vue-i18n'
import VueSlider from 'vue-slider-component'

/**
 * Source
 */
import App from "./../../assets/App.vue";
import LoggerMixin from "./../../assets/js/mixins/logger.js";

/**
 * Setup FontAwesome core, icons and Vue component
 */
import { library as faLibrary } from '@fortawesome/fontawesome-svg-core';
import { faWhatsapp, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faPlus, faEdit, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt, faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

faLibrary.add(faPlus);
faLibrary.add(faEdit);
faLibrary.add(faTrashAlt);
faLibrary.add(faCopy);
faLibrary.add(faPlay);
faLibrary.add(faPause);
faLibrary.add(faWhatsapp);
faLibrary.add(faFacebook);
faLibrary.add(faTwitter);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('vue-slider', VueSlider);

Vue.use(VueI18n);
Vue.mixin(LoggerMixin);

// TODO: App options should come via props
const props = {

};

window.AnimatedGreetings = new Vue({
    i18n: new VueI18n({
        locale: 'de'
    }),
    render: (h) => h(App, {props}),
}).$mount("#animated-greetings-container");