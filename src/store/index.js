import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  // 刷新保存vuex中数据
  state: sessionStorage.getItem('state')
    ? JSON.parse(sessionStorage.getItem('state'))
    : {
        // 登陆成功后的用户信息
        user: {},
        // 登陆成功后获取的路由
        menu: [],
        path: [],
        // 登陆成功后获取的按钮权限
        auth_btn: [],
        // 订单详情数据
        particulars: {},
      },
  getters: {},
  mutations: {},
  actions: {},
});

export default store;
