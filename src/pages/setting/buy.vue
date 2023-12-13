<template>
  <div class="bg-white p-4 rounded" v-loading="loading">
    <el-form :model="form" label-width="160px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="支付设置" name="first">
          <el-table :data="tableData" border stripe>
            <el-table-column label="支付方式" align="left">
              <template #default="{ row }">
                <div class="flex">
                  <el-image :src="row.img" fit="fill" style="width: 40px; height: 40px"></el-image>
                  <div class="ml-2">
                    <p>{{ row.name }}</p>
                    <small>{{ row.desc }}</small>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120">
              <template #default="{ row }">
                <el-button type="primary" size="small" text @click="handleSetting(row.key)">配置</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="购物设置" name="two">
          <el-form-item label="未支付订单" class="w-1/2">
            <el-input v-model="form.close_order_minute" placeholder="未支付订单">
              <template #append>分钟后自动关闭</template>
            </el-input>
            <small class="text-gray-500">订单下单未付款，n分钟后自动关闭，设置0不自动关闭</small>
          </el-form-item>
          <el-form-item label="已发货订单" class="w-1/2">
            <el-input v-model="form.auto_received_day" placeholder="已发货订单">
              <template #append>天后自动确认收货</template>
            </el-input>
            <small class="text-gray-500">如果在期间未确认收货，系统自动完成收货，设置0不自动收货</small>
          </el-form-item>
          <el-form-item label="已完成订单" class="w-1/2">
            <el-input v-model="form.after_sale_day" placeholder="已完成订单">
              <template #append>天内允许申请售后</template>
            </el-input>
            <small class="text-gray-500">订单完成后，用户在n天内可以发起售后申请，设置0不允许申请售后</small>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">保存</el-button>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <!-- 新增侧边栏 -->
    <drawer-form title="配置" destroyOnClose ref="drawerFormRef" @submit="submit">
      <el-form v-if="drawerType === 'alipay'" :model="form" label-width="120">
        <el-form-item label="app_id" prop="name" class="w-[90%]">
          <el-input v-model="form.alipay.app_id"></el-input>
        </el-form-item>
        <el-form-item label="ali_public_key" prop="order" class="w-[90%]">
          <el-input v-model="form.alipay.ali_public_key" type="textarea" rows="4"></el-input>
        </el-form-item>
        <el-form-item label="private_key" prop="status" class="w-[90%]">
          <el-input v-model="form.alipay.private_key" type="textarea" rows="4"></el-input>
        </el-form-item>
      </el-form>
      <el-form v-else :model="form" label-width="120">
        <el-form-item label="公众号 APPID" prop="name" class="w-[90%]">
          <el-input v-model="form.wxpay.app_id"></el-input>
        </el-form-item>
        <el-form-item label="小程序 APPID" prop="order" class="w-[90%]">
          <el-input v-model="form.wxpay.miniapp_id"></el-input>
        </el-form-item>
        <el-form-item label="小程序secret" prop="status" class="w-[90%]">
          <el-input v-model="form.wxpay.secret"></el-input>
        </el-form-item>
        <el-form-item label="appid" prop="status" class="w-[90%]">
          <el-input v-model="form.wxpay.appid"></el-input>
        </el-form-item>
        <el-form-item label="商户号" prop="status" class="w-[90%]">
          <el-input v-model="form.wxpay.mch_id"></el-input>
        </el-form-item>
        <el-form-item label="API 密钥" prop="status" class="w-[90%]">
          <el-input v-model="form.wxpay.key"></el-input>
        </el-form-item>
        <el-form-item label="cert_client" prop="status" class="w-[90%]">
          <el-upload
            action="/api/sysconfig/upload"
            :limit="1"
            :headers="{ token }"
            accept=".pem"
            :on-success="handleSuccessClient"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="text-rose-500">
                {{ form.wxpay.cert_client ? form.wxpay.cert_client : '请上传'}}
              </div>
              <div class="text-gray-400">
                例如：apiclient_cert.pem
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="cert_key" prop="status" class="w-[90%]">
          <el-upload
            action="/api/sysconfig/upload"
            :limit="1"
            :headers="{ token }"
            accept=".pem"
            :on-success="handleSuccessKey"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="text-rose-500">
                {{ form.wxpay.cert_key ? form.wxpay.cert_key : '请上传'}}
              </div>
              <div class="text-gray-400">
                例如：apiclient_key.pem
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
    </drawer-form>
  </div>
</template>

<script name="SettingBase" setup>
import { ref, inject, reactive } from 'vue';
import { getCookies } from '@/utils/useCookies';
import { useToast, useMessageBox, usePrompt } from '@/utils/useMessage';
import drawerForm from '@/components/drawerForm.vue';
const $api = inject('api');
const token = getCookies();
// 获取数据
const activeName = ref('first');
const form = reactive({
  close_order_minute: 0,
  auto_received_day: 0,
  after_sale_day: 0,
  alipay: {
    app_id: '',
    ali_public_key: '',
    private_key: '',
  },
  wxpay: {
    app_id: '', // 公众号 APPID
    miniapp_id: '', // 小程序 APPID
    secret: '', // 小程序secret
    appid: '', // appid
    mch_id: '', // 商户号
    key: '', // API 密钥
    cert_client: '',
    cert_key: '',
  },
});
const loading = ref(false);
const tableData = ref([
  {
    name: '支付宝支付',
    desc: '该系统支持即时到账接口',
    img: '/alipay.png',
    key: 'alipay',
  },
  {
    name: '微信支付',
    desc: '该系统支持微信网页支付和扫码支付',
    img: '/wepay.png',
    key: 'wepay',
  },
]);
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
  $api.settings
    .updateSystemSettings(form)
    .then((res) => {
      useToast('修改成功');
    })
    .finally(() => {
      loading.value = false;
    });
};

// 侧边栏详情实例
const drawerType = ref('');
const drawerFormRef = ref(null);
// 查看详情
const handleSetting = (key) => {
  drawerType.value = key;
  drawerFormRef.value.open();
};

// 文件上传成功
const handleSuccessClient = (response) => {
  form.wxpay.cert_client = response.data;
}
const handleSuccessKey = (response) => {
  form.wxpay.cert_key = response.data;
}
</script>
