import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import useUserStore from "@/stores/useUserStore";
import { useToast, useMessageBox } from "@/utils/useMessage";
import { removeCookies } from "@/utils/useCookies";
import $api from "@/axios";

export function useRepassword () {
  const store = useUserStore();
  const userInfo = computed(() => store.userInfo);
  const router = useRouter();
  const drawerBoxRef = ref(null);
  const drawerFormRef = ref(null);
  const loadingBtn = ref(false);
  const form = reactive({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const rules = {
    oldPassword: { required: true, message: "原密码不能为空", trigger: "blur", },
    newPassword: { required: true, message: "新密码不能为空", trigger: "blur", },
    confirmPassword: { required: true, message: "确认密码不能为空", trigger: "blur", },
  };
  // 提交事件
  const onSubmit = () => {
    if (form.oldPassword && form.newPassword && (form.oldPassword === form.newPassword)) {
      useToast("两次密码相同", "warning");
      return;
    } else if (form.newPassword !== form.confirmPassword) {
      useToast("输入的密码不相同", "warning");
      return;
    };
    drawerFormRef.value?.validate((result) => {
      if (result) {
        loadingBtn.value = true;
        const params = {
          oldpassword: form.oldPassword,
          password: form.newPassword,
          repassword: form.confirmPassword,
        };
        $api.common.updatePassword(params).then(res => {
          useToast("修改成功，请重新登录！", "success");
          store.removeCancel();
          router.push("/login");
        }).catch(err => useToast("修改失败", "error")).finally(() => loadingBtn.value = false);
      } else {
        useToast("密码修改未通过", "error");
      }
    });
  };
  // 取消事件
  const onClose = () => {
    for (const key in form) {
      if (Object.hasOwnProperty.call(form, key)) {
        form[key] = "";
      };
    };
    drawerFormRef.value?.resetFields();
  };
  // 控制侧边栏的展示隐藏
  const collapseChange = () => {
    store.collapseChange();
  };
  const open = () => drawerBoxRef.value?.open();

  return {
    userInfo,
    form,
    rules,
    loadingBtn,
    drawerBoxRef,
    drawerFormRef,
    store,
    onSubmit,
    onClose,
    collapseChange,
    open,
  }
};

export function useLogout () {
  const store = useUserStore();
  const router = useRouter();
  const logout = () => {
    useMessageBox("删除", "确定删除XXXX么？", "warning").then(res => {
      store.logout().then(res => {
        useToast(res, "success");
        removeCookies();
        router.push("/login");
      });
    }).catch(res => {
      useToast("取消操作", "info");
    });
  };
  return { logout };
}