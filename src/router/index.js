import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Login from '@/views/Login.vue';

// import { Loading } from 'element-ui';
// import { Message } from 'element-ui';
Vue.use(VueRouter);
/**
 * 静态路由表
 */
export const routes = [
  {
    name: 'default',
    path: '/',
    redirect: {
      path: 'login',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: {
      path: '/welcome',
    },
    children: [
      // 欢迎界面
      {
        path: '/welcome',
        name: 'Welcome',

        component: () =>
          import(/* webpackChunkName:"group-foo" */ '../views/welcome.vue'),
      },
      // 用户列表
      {
        path: 'users/users',
        name: 'users',
        component: (resolve) => require(['../views/users/users.vue'], resolve),
      },
      // 权限列表
      {
        path: 'rights/rights',
        name: 'rights',
        component: (resolve) =>
          require(['../views/rights/rights.vue'], resolve),
      },
      // 角色列表
      {
        path: 'rights/roles',
        name: 'roles',
        component: (resolve) => require(['../views/rights/roles.vue'], resolve),
      },
      // 数据报表
      {
        path: 'reports/reports',
        name: 'reports',
        component: (res) => require(['../views/reports/reports'], res),
      },
      // 订单管理
      {
        path: 'orders/orders',
        name: 'orders',
        component: (res) => require(['../views/orders/orders.vue'], res),
      },
      // 订单详情
      {
        path: 'orders/particulars',
        name: 'particulars',
        component: (res) => require(['../views/orders/particulars.vue'], res),
      },
      // goods列表页 ==>> goods/params/categories
      {
        path: 'goods/goods',
        name: '_goods',
        component: (resolve) => require(['../views/goods/goods.vue'], resolve),
      },
      {
        path: 'goods/shopping',
        name: 'goods_shopping',
        component: (resolve) =>
          require(['../components/goods/shopping.vue'], resolve),
      },
      {
        path: 'goods/params',
        name: '_params',

        component: (resolve) => require(['../views/goods/params.vue'], resolve),
      },
      {
        path: 'goods/categories',
        name: '_categories',

        component: (resolve) =>
          require(['../views/goods/categories.vue'], resolve),
      },
    ],
  },
];
/**
 * 动态路由表
 */
export const asyncRoutes = [];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes,
  asyncRoutes,
});
router.beforeEach((to, from, next) => {
  // 页面加载延迟
  // let loadingInstance = Loading.service({
  //   fullscreen: true,
  //   lock: true,
  //   text: '加载页面中...',
  // });
  // setTimeout(() => {
  //   loadingInstance.close();
  // }, 2000);

  var token = sessionStorage.getItem('super_user_ttzy');
  if (to.path === '/login' || token) {
    next();
  } else next('/');
});

export default router;
