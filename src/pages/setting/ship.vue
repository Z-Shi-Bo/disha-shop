<template>
  <div class="bg-white p-4 rounded" v-loading="loading">
    <el-form :model="form" label-width="160px">
      <el-form-item label="物流查询key" class="w-1/2">
        <el-input v-model="form.ship" placeholder="物流查询key"></el-input>
        <small class="text-gray-500">用于查询物流信息，接口申请（仅供参考）</small>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script name="SettingShip" setup>
import { ref, inject, reactive } from 'vue';
import { useToast } from '@/utils/useMessage';
const $api = inject('api');
// 获取数据
const form = reactive({
  ship: '',
});
const loading = ref(false);
const getData = () => {
  loading.value = true;
  $api.settings
    .getSystemSettings()
    .then((res) => {
      form.ship = res.ship;
    })
    .finally(() => {
      loading.value = false;
    });
};
getData();

// 修改数据
const submit = () => {
  loading.value = true;
  $api.settings
    .updateSystemSettings(form)
    .then((res) => {
      useToast('修改成功');
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
