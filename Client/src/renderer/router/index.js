import Vue from 'vue'
import Router from 'vue-router'

const chess = () => import('@/components/chess.vue')
const try2 = () => import('@/components/try2.vue')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/chess'
    },
    {
      path: '/chess',
      component: chess
    },
    {
      path: '/try2',
      component: try2
    }
  ]
})
