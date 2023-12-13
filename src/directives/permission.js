import useUserStore from '@/stores/useUserStore';
// 判断权限是否存在
function hasPermission(el, value) {
  const store = useUserStore();
  const ruleName = store.userInfo?.ruleNames || [];
  if (!Array.isArray(value)) {
    throw new Error(`需要配置权限，例如 v-permission="['getStatistics3,GET']"`);
  }
  const hasAuth = value.findIndex((item) => ruleName.includes(item)) !== -1;
  if (el && !hasAuth) {
    el.parentNode && el.parentNode.removeChild(el);
  }
  return hasAuth;
}

export default {
  install(app) {
    app.directive('permission', {
      mounted(el, binding) {
        hasPermission(el, binding.value);
      },
    });
  },
};
