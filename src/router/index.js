import Vue from 'vue'
import VueRouter from 'vue-router'
import CanvasPage from "@/pages/CanvasPage";
import AboutPage from "@/pages/AboutPage";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'CanvasPage',
    component: CanvasPage
  },
  {
    path: '/about',
    name: 'AboutPage',
    component: AboutPage,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
