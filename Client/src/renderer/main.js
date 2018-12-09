import Vue from 'vue'

import App from './App'
import router from './router/index'
import socket from './socket'

Vue.config.productionTip = false
socket.init()

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')
