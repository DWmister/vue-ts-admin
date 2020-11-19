import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout/index.vue'

Vue.use(Router)

/*
  name:'router-name'             the name field is required when using <keep-alive>, it should also match its component's name property
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    hidden: true                 if true, this route will not show in the sidebar (default is false)
    noCache: true                if true, the page will not be cached (default is false)
    affix: true                  if true, the tag will affix in the tags-view
  }
*/

export default new Router({
  // mode: 'history',  // Enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/redirect',
      component: Layout,
      meta: { hidden: true },
      children: [
        {
          path: '/redirect/:path(.*)',
          component: () => import(/* webpackChunkName: "redirect" */ '@/views/redirect/index.vue')
        }
      ]
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
      meta: { hidden: true }
    },
    {
      path: '/404',
      component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
      meta: { hidden: true }
    },
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
          name: 'Dashboard',
          meta: {
            title: 'dashboard',
            icon: 'dashboard',
            affix: true
          }
        }
      ]
    },
    {
      path: '/article',
      component: Layout,
      redirect: '/article/list',
      name: 'Article',
      meta: {
        title: 'article',
        icon: 'example'
      },
      children: [
        {
          path: 'create',
          component: () => import(/* webpackChunkName: "article-create" */ '@/views/article/create.vue'),
          name: 'CreateArticle',
          meta: {
            title: 'createArticle',
            icon: 'edit',
            noCache: true
          }
        },
        {
          path: 'edit/:id(\\d+)',
          component: () => import(/* webpackChunkName: "article-edit" */ '@/views/article/edit.vue'),
          name: 'EditArticle',
          meta: {
            title: 'editArticle',
            activeMenu: '/article/list',
            hidden: true,
            noCache: true
          }
        },
        {
          path: 'list',
          component: () => import(/* webpackChunkName: "article-list" */ '@/views/article/list.vue'),
          name: 'ArticleList',
          meta: {
            title: 'articleList',
            icon: 'list'
          }
        }
      ]
    },
    {
      path: '*',
      redirect: '/404',
      meta: { hidden: true }
    }
  ]
})
