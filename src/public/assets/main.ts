/**
 * Core libraries
 */
import Vue from "vue";
import VueI18n from 'vue-i18n';
import VueSlider from 'vue-slider-component';

/**
 * Source
 */
import App from "./../../assets/App.vue";
import LoggerPlugin from './../../assets/js/logger';

/**
 * Setup FontAwesome core, icons and Vue component
 */
import { library as faLibrary } from '@fortawesome/fontawesome-svg-core';
import { faWhatsapp, faFacebook, faTwitter, faLinkedin, faXingSquare } from '@fortawesome/free-brands-svg-icons';
import { faPlus, faEdit, faPlay, faPause, faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt, faCopy, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

faLibrary.add(faPlus);
faLibrary.add(faEdit);
faLibrary.add(faTrashAlt);
faLibrary.add(faCopy);
faLibrary.add(faPlay);
faLibrary.add(faPause);
faLibrary.add(faExpand);
faLibrary.add(faCompress);
faLibrary.add(faEnvelope);
faLibrary.add(faWhatsapp);
faLibrary.add(faLinkedin);
faLibrary.add(faXingSquare);
faLibrary.add(faFacebook);
faLibrary.add(faTwitter);

Vue.config.productionTip = false

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('vue-slider', VueSlider);

Vue.use(VueI18n);
Vue.use(LoggerPlugin);

/* @ts-ignore */
window.AnimatedGreetings = new Vue({
    /* @ts-ignore */
    logger: {
        enabled: true
    },
    i18n: new VueI18n({
        locale: 'de'
    }),
    render: (h) => h(App, {}),
}).$mount("#animated-greetings-container");