<template>
  <div class="setting bg-white p-4 rounded" v-loading="loading">
    <el-form :model="form" label-width="160px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="注册与访问" name="first">
          <el-form-item label="是否允许注册会员">
            <el-radio-group v-model="form.open_reg">
              <el-radio :label="0" border>关闭</el-radio>
              <el-radio :label="1" border>开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="注册类型">
            <el-radio-group v-model="form.reg_method">
              <el-radio label="username" border>普通注册</el-radio>
              <el-radio label="phone" border>手机注册</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="密码最小长度" class="w-1/2">
            <el-input v-model="form.password_min" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="强制密码复杂度">
            <el-checkbox-group v-model="form.password_encrypt">
              <el-checkbox label="0" border>数字</el-checkbox>
              <el-checkbox label="1" border>小写字母</el-checkbox>
              <el-checkbox label="2" border>大写字母</el-checkbox>
              <el-checkbox label="3" border>符号</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="上传设置" name="two">
          <el-form-item label="默认上传方式">
            <el-radio-group v-model="form.upload_method">
              <el-radio label="oss" border>对象存储</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Bucket" class="w-1/2">
            <el-input v-model="form.upload_config.Bucket" placeholder="Bucket"></el-input>
          </el-form-item>
          <el-form-item label="ACCESS_KEY" class="w-1/2">
            <el-input v-model="form.upload_config.ACCESS_KEY" placeholder="ACCESS_KEY" type="password"></el-input>
          </el-form-item>
          <el-form-item label="SECRET_KEY" class="w-1/2">
            <el-input v-model="form.upload_config.SECRET_KEY" placeholder="SECRET_KEY" type="password"></el-input>
          </el-form-item>
          <el-form-item label="空间域名" class="w-1/2">
            <el-input v-model="form.upload_config.http" placeholder="空间域名"></el-input>
            <small class="text-gray-500">请补全 http:// 或 https://</small>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="Api安全" name="three">
          <el-form-item label="是否开启API安全">
            <el-radio-group v-model="form.api_safe">
              <el-radio :label="0" border>关闭</el-radio>
              <el-radio :label="1" border>开启</el-radio>
            </el-radio-group>
            <small class="text-gray-500">api安全功能开启之后调用前端api需要传输签名串</small>
          </el-form-item>
          <el-form-item label="秘钥" class="w-3/4">
            <el-input v-model="form.api_secret" placeholder="秘钥"></el-input>
            <small class="text-gray-500">秘钥设置关系系统中api调用传输签名串的编码规则，以及会员token解析，请慎重设置，注意设置之后对应会员要求重新登录获取token</small>
          </el-form-item>
        </el-tab-pane>
        <el-form-item>
          <el-button type="primary" @click="submit">保存</el-button>
        </el-form-item>
      </el-tabs>
    </el-form>
  </div>
</template>

<script name="SettingBase" setup>
import { ref, inject, reactive } from 'vue';
import { useToast, useMessageBox, usePrompt } from '@/utils/useMessage';
const $api = inject('api');
// 获取数据
const activeName = ref('first');
const form = reactive({
  open_reg: 1,
  reg_method: '',
  password_min: 7,
  password_encrypt: [],
  upload_method: 'oss',
  upload_config: {
    Bucket: '',
    ACCESS_KEY: '',
    SECRET_KEY: '',
    http: '',
  },
  api_safe: 1,
  api_secret: '',
});
const loading = ref(false);
const getData = () => {
  loading.value = true;
  $api.settings
    .getSystemSettings()
    .then((res) => {
      for (const key in form) {
        if (Object.hasOwnProperty.call(form, key)) {
          if (key === 'password_encrypt') {
            form[key] = res[key].split(',');
          } else {
            form[key] = res[key];
          }
        }
      }
    })
    .finally(() => {
      loading.value = false;
    });
};
getData();

// 修改数据
const submit = () => {
  loading.value = true;
  const param = JSON.parse(JSON.stringify(form));
  param.password_encrypt = param.password_encrypt.join(',');
  $api.settings
    .updateSystemSettings(param)
    .then((res) => {
      useToast('修改成功');
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
