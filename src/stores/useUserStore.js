import { defineStore } from 'pinia';
import { setCookies, removeCookies } from '@/utils/useCookies';
import $api from '@/axios';

const store = defineStore('user', {
  state: () => {
    return {
      userInfo: {}, // 用户信息
      isCollapse: false, // 控制侧边栏菜单的显隐
    };
  },
  actions: {
    // 用户登录
    login(params) {
      return new Promise((resolve, reject) => {
        $api.common
          .login(params)
          .then(res => {
            // 存储token
            setCookies(res.token);
            resolve(res.token);
          })
          .catch(err => reject(err));
      });
    },
    // 获取用户信息
    getUserInfo() {
      return new Promise((resolve, reject) => {
        $api.common
          .getUserInfo()
          .then(res => {
            this.setUserInfo(res);
            resolve(res);
          })
          .catch(err => reject(err));
      });
    },
    // 设置用户信息
    setUserInfo(info) {
      this.userInfo = info;
    },
    // 退出登录
    logout() {
      return new Promise((resolve, reject) => {
        $api.common
          .logout()
          .then(res => {
            resolve(res);
            this.removeCancel();
          })
          .catch(err => reject(err));
      });
    },
    // 清除缓存
    removeCancel() {
      this.userInfo = {};
      localStorage.removeItem('userInfo');
      sessionStorage.removeItem('tab-list');
      removeCookies();
      location.href = '';
    },
    // 切换侧边栏的显隐
    collapseChange() {
      this.isCollapse = !this.isCollapse;
    },
  },
  persist: {
    key: 'userInfo',
    paths: ['userInfo'],
  },
});

export default store;
