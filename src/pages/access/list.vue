<template>
  <div class="access" v-loading="loading">
    <el-card shadow="never">
      <list-header @create="handleCreate" @refresh="getData"></list-header>
      <div class="main">
        <el-tree :data="tableData" node-key="id" highlight-current :default-expanded-keys="defaultExpandedKeys" :expand-on-click-node="false" :props="{ label: 'name', children: 'child' }">
          <template #default="{ node, data }">
            <div class="w-full py-2 flex justify-between items-center">
              <p class="flex items-center">
                <el-tag v-if="data.menu" size="small">菜单</el-tag>
                <el-tag v-else type="info" size="small">权限</el-tag>
                <el-icon :size="16" v-if="data.menu" class="ml-2">
                  <component :is="data.icon" />
                </el-icon>
                <span class="ml-2">{{ data.name }}</span>
              </p>
              <p>
                <el-switch v-model="data.status" :loading="loadingSwitch" :active-value="1" :inactive-value="0" @change="updateStatus(data)"></el-switch>
                <el-button type="primary" size="small" text @click="handleUpdate(data)">修改</el-button>
                <el-button type="primary" size="small" text @click="addChild(data.id)">增加</el-button>
                <el-button type="primary" size="small" text @click="handleDelete(data)">删除</el-button>
              </p>
            </div>
          </template>
        </el-tree>
      </div>
      <drawer-form :title="drawerFormTitle" ref="drawerFormRef" @submit="handleSubmit" @close="handleClose">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
          <el-form-item label="上级菜单" prop="rule_id">
            <el-cascader v-model="form.rule_id" :options="menuList" :props="{ label: 'name', value: 'id', children: 'child', checkStrictly: true, emitPath: false }" placeholder="请选择上级菜单" />
          </el-form-item>
          <el-form-item label="菜单/规则" prop="menu">
            <el-radio-group v-model="form.menu">
              <el-radio :label="1" border>菜单</el-radio>
              <el-radio :label="0" border>规则</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item label="菜单图标" prop="icon" v-if="form.menu">
            <icon-select v-model="form.icon" />
          </el-form-item>
          <el-form-item label="前端路由" prop="frontpath" v-if="form.menu && form.rule_id > 0">
            <el-input v-model="form.frontpath" placeholder="前端路由"></el-input>
          </el-form-item>
          <el-form-item label="后端规则" prop="condition" v-if="form.menu === 0">
            <el-input v-model="form.condition" placeholder="后端规则"></el-input>
          </el-form-item>
          <el-form-item label="请求方式" prop="method" v-if="form.menu === 0">
            <el-select v-model="form.method">
              <el-option v-for="item in ['GET', 'POST', 'PUT', 'DELETE']" :key="item" :label="item" :value="item"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="order">
            <el-input-number v-model="form.order" :min="1" :max="1000" />
          </el-form-item>
        </el-form>
      </drawer-form>
    </el-card>
  </div>
</template>
<script name="AccessList" setup>
import { ref, inject } from 'vue';
import drawerForm from '@/components/drawerForm.vue';
import listHeader from '@/components/listHeader.vue';
import iconSelect from '@/components/iconSelect.vue';
import { useGetTableData, useInitForm } from '@/utils/useTableAndFormLogic';
const $api = inject('api');
const defaultExpandedKeys = ref([]); // 展开的节点
const menuList = ref([]); // 菜单列表
const { tableData, loading, getData, loadingSwitch, updateStatus, handleDelete } = useGetTableData({
  getList: $api.rules.getRuleList,
  onGetListSuccess: (res) => {
    tableData.value = res.list;
    defaultExpandedKeys.value = res.list.map((item) => item.id);
    menuList.value = res.rules;
  },
  updateStatus: $api.rules.updateRuleStatus,
  delete: $api.rules.deleteRule,
});
const { drawerFormTitle, form, formRef, drawerFormRef, rules, handleCreate, handleSubmit, handleClose, handleUpdate } = useInitForm({
  form: {
    rule_id: 0,
    menu: 0,
    name: '',
    condition: '',
    method: 'GET',
    status: 1,
    order: 50,
    icon: '',
    frontpath: '',
  },
  rules: {},
  update: $api.rules.updateRule,
  create: $api.rules.createRule,
  getData,
});
// 新增子菜单
const addChild = (id) => {
  handleCreate();
  form.rule_id = id;
};
</script>
<style>
.el-tree-node__content {
  padding: 20px 0;
}
</style>
