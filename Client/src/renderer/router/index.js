import Vue from 'vue'
import Router from 'vue-router'

const try1 = () => import('@/components/try1.vue')
const try2 = () => import('@/components/try2.vue')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/try1'
    },
    {
      path: '/try1',
      component: try1
    },
    {
      path: '/try2',
      component: try2
    }
  ]
})
