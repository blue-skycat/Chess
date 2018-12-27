import Vue from 'vue'
import Router from 'vue-router'

const chess = () => import('@/components/chess.vue')
const try2 = () => import('@/components/try2.vue')
const hello = () => import('@/components/hello.vue')
const hall = () => import('@/components/hall.vue')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/hello',
    },
    {
      path: '/hello',
      component: hello
    },
    {
      path: '/hall',
      component: hall
    },
    {
      path: '/chess',
      component: chess
    },
    {
      path: '/try2',
      component: try2
    },
  ]
})
