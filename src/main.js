import { createApp } from 'vue';
import 'normalize.css';
import '@/assets/style/common.css';
import 'virtual:windi.css';
import App from './App.vue';
import router from './router';
import commonApi from '@/axios';
import store from './stores';
import 'nprogress/nprogress.css';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import permission from '@/directives/permission.js';
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.provide('api', commonApi);
app.use(store);
app.use(router);
app.use(permission);
app.mount('#app');
