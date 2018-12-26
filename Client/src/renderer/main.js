import Vue from 'vue'
import App from './App'
import router from './router/index'
import { socket } from './socket'
import elementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = true;
Vue.prototype.$socket =  socket;
Vue.use(elementUi);

/*router.beforeEach((to, from, next) => {
  if (to.path === '/hello') {
    sessionStorage.removeItem("userName");
  } else if (sessionStorage.userName) {
    next({path: '/hello'})
  }
  next()
})*/

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  render: h => h(App)
})
