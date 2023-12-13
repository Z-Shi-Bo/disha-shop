<template>
  <div class="role" v-loading="loading">
    <el-card shadow="never">
      <list-header @create="handleCreate" @refresh="getData"></list-header>
      <div class="main">
        <el-table :data="tableData" stripe>
          <el-table-column label="角色名称" align="left" prop="name"> </el-table-column>
          <el-table-column label="角色描述" align="left" prop="desc"> </el-table-column>
          <el-table-column label="状态" align="center">
            <template #default="{ row }">
              <el-switch v-model="row.status" :disabled="row.name === '超级管理员' || row.name === '运营'" :loading="loadingSwitch" :active-value="1" :inactive-value="0" @change="updateStatus(row)" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="300">
            <template #default="{ row }">
              <div>
                <el-button type="primary" text size="small" @click="handlePermission(row)">配置权限</el-button>
                <el-button v-if="row.name !== '超级管理员' && row.name !== '运营'" type="primary" text size="small" @click="handleUpdate(row)">修改</el-button>
                <el-button v-if="row.name !== '超级管理员' && row.name !== '运营'" type="primary" text size="small" @click="handleDelete(row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination background layout="prev, pager, next" :current-page="currentPage" @current-change="handleCurrentChange" :page-size="10" :total="totalCount" />
      </div>
    </el-card>
    <!-- 新增侧边栏 -->
    <drawer-form :title="drawerFormTitle" ref="drawerFormRef" @submit="handleSubmit" @close="handleClose">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" :inline="false">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input v-model="form.desc" type="textarea" :rows="4" placeholder="请输入角色描述"> </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0"> </el-switch>
        </el-form-item>
      </el-form>
    </drawer-form>
    <!-- 权限侧边栏 -->
    <drawer-form title="权限配置" ref="drawerFormRoleRef" size="30%" @submit="handleSubmitRole" @close="handleCloseRef">
      <el-tree-v2
        ref="treeRef"
        :data="ruleList"
        :props="{ label: 'name', children: 'child' }"
        node-key="id"
        :check-strictly="checkStrictly"
        @check="handleNodeClick"
        show-checkbox
        :height="treeHeight">
        <template #default="{ node, data }">
          <div class="flex items-center">
            <el-tag v-if="data.menu" size="small">菜单</el-tag>
            <el-tag v-else type="info" size="small">权限</el-tag>
            <el-icon :size="16" v-if="data.menu" class="ml-2">
              <component :is="data.icon" />
            </el-icon>
            <span class="ml-2">{{ data.name }}</span>
          </div>
        </template>
      </el-tree-v2>
    </drawer-form>
  </div>
</template>

<script name="RoleList" setup>
import { ref, inject } from 'vue';
import drawerForm from '@/components/drawerForm.vue';
import listHeader from '@/components/listHeader.vue';
import { useToast } from '@/utils/useMessage';
import { useGetTableData, useInitForm } from '@/utils/useTableAndFormLogic';
const $api = inject('api');
const roles = ref([]);
const { totalCount, currentPage, tableData, loadingSwitch, loading, handleCurrentChange, getData, updateStatus, handleDelete } = useGetTableData({
  searchForm: {
    keyword: '',
  },
  getList: $api.roles.getRoleList,
  onGetListSuccess: (res) => {
    totalCount.value = res.totalCount;
    tableData.value = res.list;
    roles.value = res.roles;
  },
  updateStatus: $api.roles.updateRoleStatus,
  delete: $api.roles.deleteRole,
});
const { drawerFormTitle, form, formRef, drawerFormRef, rules, handleCreate, handleSubmit, handleClose, handleUpdate } = useInitForm({
  form: {
    name: '',
    desc: '',
    status: 1,
  },
  rules: {
    name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
  },
  update: $api.roles.updateRole,
  create: $api.roles.createRole,
  getData,
});

const drawerFormRoleRef = ref(null);
// 配置权限逻辑
// 获取权限列表
const treeRef = ref(null); // 权限树实例
const ruleList = ref([]); // 权限列表
const defaultExpandedKeys = ref([]); // 默认展开的节点
const defaultCheckedKeys = ref([]); // 默认选中的节点
const roleId = ref(0); // 当前配置的角色id
const checkStrictly = ref(false); // 父子节点是否关联
const treeHeight = ref(500); // 动态计算tree的高度
treeHeight.value = window.innerHeight - 170;
const getRuleList = (row) => {
  checkStrictly.value = true;
  $api.rules.getRuleList(1).then((res) => {
    loading.value = false;
    ruleList.value = res.list;
    defaultExpandedKeys.value = res.list.map((item) => item.id);
    defaultCheckedKeys.value = row.rules.map((item) => item.id);
    drawerFormRoleRef.value.open();
    setTimeout(() => {
      treeRef.value.setExpandedKeys(defaultExpandedKeys.value);
      treeRef.value.setCheckedKeys(defaultCheckedKeys.value);
      checkStrictly.value = false;
    });
  });
};
// 角色侧边栏点击事件
const handleNodeClick = (data, { checkedKeys, halfCheckedKeys }) => {
  defaultCheckedKeys.value = [...checkedKeys, ...halfCheckedKeys];
};
// 角色侧边栏提交事件
const handleSubmitRole = () => {
  $api.roles.setRules({ id: roleId.value, rule_ids: defaultCheckedKeys.value }).then((res) => {
    useToast('配置成功');
    getData();
    drawerFormRoleRef.value.close();
  });
};
const handlePermission = (row) => {
  loading.value = true;
  roleId.value = row.id;
  getRuleList(row);
};
// 监听侧边栏关闭事件
const handleCloseRef = () => {
  roleId.value = 0;
  defaultCheckedKeys.value = [];
  defaultExpandedKeys.value = [];
};
</script>
<style scoped>
.role .search {
  @apply flex justify-between items-center mb-4;
}
.role .search .search-input {
  width: 400px;
}
.role .page {
  @apply flex justify-center items-center mt-4;
}
</style>
