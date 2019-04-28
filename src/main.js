import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Import moment.js
const moment = require('moment');

// lodash
var lodash = require('lodash');

// Import Vue Bootstrap
import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Require Froala Editor js file.
require('froala-editor/js/froala_editor.pkgd.min.js')

// Require Froala Editor css files.
require('froala-editor/css/froala_editor.pkgd.min.css')
require('font-awesome/css/font-awesome.css')
require('froala-editor/css/froala_style.min.css')

// Import and use Vue Froala lib.
import VueFroala from 'vue-froala-wysiwyg'
Vue.use(VueFroala)

// Setup Firebase
const firebase = require('firebase/app');

// Require For Side Effect.
require('firebase/firestore');
require('firebase/auth');
require('firebase/storage');
require('firebase/functions');
require('firebase/messaging');

firebase.initializeApp({
  apiKey: "AIzaSyDyaNjLk9bspxD073OOeOd4oZe1mpk1RAY",
  authDomain: "software-studio-mid-project.firebaseapp.com",
  databaseURL: "https://software-studio-mid-project.firebaseio.com",
  projectId: "software-studio-mid-project",
  storageBucket: "software-studio-mid-project.appspot.com",
  messagingSenderId: "530399913400"
});

// Add Firebase to vue instance.
Vue.prototype.$firebase = firebase;
Vue.prototype.$db = firebase.firestore();
Vue.prototype.$storage = firebase.storage();
Vue.prototype.$functions = firebase.functions();

// Detect If Browser Support
Vue.prototype.$isSupportMessaging = true;
try {
  firebase.messaging().usePublicVapidKey('BPifN0uvgDOvF2PSnf-QwkS1Sz_IFOA68nNhHGPZt6fmZbEknTFU6i2wN_mpPguLhpJgdCkC_4_6EQaTqfwYjys');
} catch (err) {
  Vue.prototype.$isSupportMessaging = false;
}

// Add moment
Vue.prototype.$moment = moment;

// Add lodash
Vue.prototype.$lodash = lodash;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
