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

// Setup Firebase
const firebase = require('firebase/app');

// Require For Side Effect.
require('firebase/firestore');
require("firebase/auth");

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
