<template>
  <el-row :gutter="24" class="login-container">
    <el-col :md="12" :lg="16" class="left">
      <div class="description">
        <h1 class="welcome">欢迎光临</h1>
        <p>此站点是《Vue3实战商城后台管理系统开发》视频课程的演示地址， 点击立即学习</p>
      </div>
    </el-col>
    <el-col :md="12" :lg="8" class="right">
      <h2 class="welcome-back">欢迎回来</h2>
      <div class="user-password">
        <span class="user-password-common"></span>
        <span class="px-2">账号密码登录</span>
        <span class="user-password-common"></span>
      </div>
      <el-form ref="formRef" :model="model" :rules="rules" class="w-60">
        <el-form-item prop="username" label="账号">
          <el-input v-model="model.username" placeholder="请输入账号">
            <template #prefix>
              <el-icon class="el-input__icon"><i-ep-user /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="model.password" show-password placeholder="请输入密码" type="password">
            <template #prefix>
              <el-icon class="el-input__icon"><i-ep-lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-button round color="#6366f1" class="w-60 tracking-0.5rem" :loading="loadingBtn" @click="handleValidateClick">
          登录
        </el-button>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup name="login">
import { reactive, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "@/utils/useMessage";
import useUserStore from "@/stores/useUserStore";

// 钩子函数
onMounted(() => {
  document.addEventListener("keyup", enterClick);
});
onUnmounted(() => {
  document.removeEventListener("keyup", enterClick);
});
const store = useUserStore();
const router = useRouter();
const model = reactive({
  username: "",
  password: "",
});
const rules = {
  username: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};
const formRef = ref(null);
const loadingBtn = ref(false);
const handleValidateClick = (e) => {
  e.preventDefault();
  formRef.value?.validate((result) => {
    if (result) {
      login();
    } else {
      useToast(result, "error");
    }
  });
};
// 登录
const login = () => {
  loadingBtn.value = true;
  const params = {
    username: model.username,
    password: model.password,
  };
  store.login(params).then(res => {
    useToast("登录成功", "success");
    router.push("/");
  }).finally(() => {
    loadingBtn.value = false;
  });
};

// 键盘回车事件
const enterClick = (e) => {
  if (e.keyCode === 13) {
    login();
  };
};

</script>

<style scoped>
.login-container {
  margin: 0 !important;
  @apply min-h-full bg-indigo-500;
}

.login-container .left,
.login-container .right {
  @apply flex flex-col justify-center items-center;
}

.login-container .right {
  @apply bg-light-50;
}

.login-container .left .description {
  @apply text-light-50;
}

.login-container>.left>.description>.welcome {
  @apply text-4xl mb-4 font-bold;
}

.login-container .right .welcome-back {
  @apply text-3xl font-bold mb-6;
}

.login-container .right .user-password {
  @apply flex items-center text-gray-300 mb-8;
}

.login-container .right .user-password .user-password-common {
  @apply inline-block h-px w-16 bg-gray-300;
}
</style>
