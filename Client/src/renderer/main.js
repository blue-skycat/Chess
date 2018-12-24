import Vue from 'vue'
import App from './App'
import router from './router/index'
import { socket } from './socket'


Vue.config.productionTip = false
Vue.prototype.$socket =  socket;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  render: h => h(App)
})
