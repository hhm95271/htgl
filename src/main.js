import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/plugins/css/index.less';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import VXETable from 'vxe-table';
import 'vxe-table/lib/index.css';
import 'xe-utils';

Vue.use(VXETable);

Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
