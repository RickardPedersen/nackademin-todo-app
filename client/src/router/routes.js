import Vue from 'vue'
import Router from 'vue-router'


import auth from './middlewares/auth'
//import isSubscribed from './middleware/isSubscribed'

import guest from './middlewares/guest'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue'),
        meta: {
          middleware: [
              guest
          ]
        }
      },
      {
        path: 'todos',
        component: () => import('pages/TodoList.vue'),
        meta: {
          middleware: [
              auth
          ]
        }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
