import Vue from "vue";
import Router from "vue-router";

import guest from "./middlewares/guest";
import user from "./middlewares/user";
import admin from "./middlewares/admin";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),

    children: [
      {
        path: "",
        component: () => import("pages/Index.vue"),
        meta: {
          middleware: [guest]
        }
      },
      {
        path: "todos",
        component: () => import("pages/TodoList.vue"),
        meta: {
          middleware: [user]
        }
      },
      {
        path: "users",
        component: () => import("pages/UserList.vue"),
        meta: {
          middleware: [admin]
        }
      },
      {
        path: "user/:id",
        component: () => import("pages/UserTodos.vue"),
        meta: {
          middleware: [admin]
        }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
