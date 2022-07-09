import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../views/layout/layout.vue'),
    redirect: '/home',
    children: [
      {
        // path: '' // 默认子路由，只能有1个
        path: 'home',
        name: 'home',
        component: () => import('../views/home/home.vue')
      },
      {
        path: 'qa',
        name: 'qa',
        component: () => import('../views/qa/qa.vue')
      },
      {
        path: 'video',
        name: 'video',
        component: () => import('../views/video/video.vue')
      },
      {
        path: 'my',
        name: 'my',
        component: () => import('../views/my/my.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/login.vue') // 懒加载
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/search/search.vue')
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('../views/article/article.vue'),
    props: true // 开启 Props 传参，把路由参数映射到组件的 props 数据中
  },
  {
    path: '/user',
    component: () => import('../views//user-profile/user-profile.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
