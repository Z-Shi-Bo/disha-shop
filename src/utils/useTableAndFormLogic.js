import { ref, reactive } from 'vue';
import { useToast, useMessageBox } from '@/utils/useMessage';

// 表格的逻辑  列表  分页  搜索  删除
export function useGetTableData(opt = {}) {
  let searchForm = null;
  let resetSearchForm = null;
  let totalCount = ref(0);
  let currentPage = ref(1);
  const tableData = ref([]);
  let loading = ref(false);
  let loadingSwitch = ref(false);
  // 初始值渲染和重置
  if (opt.searchForm) {
    searchForm = reactive({ ...opt.searchForm });
    resetSearchForm = () => {
      for (const key in opt.searchForm) {
        if (Object.hasOwnProperty.call(opt.searchForm, key)) {
          searchForm[key] = opt.searchForm[key];
        }
      }
      getData();
    };
  }
  // 获取管理员列表
  const getData = () => {
    loading.value = true;
    opt
      .getList(currentPage.value, searchForm)
      .then((res) => {
        if (opt.onGetListSuccess && typeof opt.onGetListSuccess === 'function') {
          opt.onGetListSuccess(res);
        } else {
          totalCount.value = res.totalCount;
          tableData.value = res.list;
        }
      })
      .finally(() => {
        loading.value = false;
      });
  };
  // 分页
  const handleCurrentChange = (val) => {
    currentPage.value = val;
    getData();
  };

  // 监听管理员状态的改变
  const updateStatus = (row) => {
    loadingSwitch.value = true;
    opt
      .updateStatus(row.id, { status: row.status })
      .then((res) => {
        useToast('修改状态成功');
      }).catch((err) => {
        row.status = row.status === 1 ? 0 : 1;
      })
      .finally(() => {
        loadingSwitch.value = false;
      });
  };
  // 删除
  const handleDelete = ({ id }) => {
    useMessageBox('删除', '确定删除么？', 'warning')
      .then((confirm) => {
        opt.delete(id).then((res) => {
          useToast('删除成功');
          getData();
        });
      })
      .catch((cancel) => {
        console.log(cancel);
      });
  };

  const ids = ref([]);
  // 复选框选中事件
  const handleSelectionChange = (val) => {
    ids.value = val.map((item) => item.id);
  };
  // 批量删除操作
  const handleDeleteAll = () => {
    if (ids.value.length > 0) {
      handleDelete({ id: ids.value });
    } else {
      useToast('请选择要删除选项', 'error');
    }
  };

  // 批量删除操作
  const handleStatusChange = (status) => {
    const tip = status === 1 ? '上架' : '下架';
    if (ids.value.length > 0) {
      opt
        .updateStatus(ids.value, status)
        .then((res) => {
          useToast(tip + '成功');
          getData();
        })
        .catch((cancel) => {
          console.log(cancel);
        });
    } else {
      useToast('请选择要' + tip + '的选项', 'error');
    }
  };
  getData();
  return {
    searchForm,
    totalCount,
    currentPage,
    tableData,
    loadingSwitch,
    loading,
    ids,
    handleCurrentChange,
    getData,
    resetSearchForm,
    updateStatus,
    handleDelete,
    handleSelectionChange,
    handleDeleteAll,
    handleStatusChange,
  };
}

// 表单的逻辑  新增  修改
export function useInitForm(opt = {}) {
  const editId = ref(-1);
  const drawerFormTitle = computed(() => (editId.value > -1 ? '修改' : '新增'));
  const form = reactive({ ...opt.form });
  const formRef = ref(null);
  const drawerFormRef = ref(null);
  const rules = opt.rules || {};
  // 打开新增管理员弹框
  const handleCreate = () => {
    resetForm(opt.form);
    editId.value = -1;
    drawerFormRef.value.open();
  };

  // 提交
  const handleSubmit = () => {
    formRef.value.validate((valid) => {
      if (!valid) return;
      // 提交之前的拦截  处理参数
      let body = {};
      if (opt.beforeSubmit && typeof opt.beforeSubmit === 'function') {
        body = opt.beforeSubmit({ ...form });
      } else {
        body = form;
      }
      (editId.value > -1 ? opt.update(editId.value, body) : opt.create(body)).then((res) => {
        useToast(editId.value > -1 ? '修改成功' : '新增成功');
        drawerFormRef.value.close();
        opt.getData();
      });
    });
  };
  // 修改
  const handleUpdate = (row) => {
    for (const key in form) {
      if (Object.hasOwnProperty.call(form, key)) {
        form[key] = row[key];
      }
    }
    editId.value = row.id;
    drawerFormRef.value.open();
  };
  // 重置表单数据
  const resetForm = (source) => {
    for (const key in form) {
      if (Object.hasOwnProperty.call(source, key)) {
        form[key] = source[key];
      } else {
        delete form[key];
      }
    }
  };
  // 点击取消清除验证规则
  const handleClose = () => {
    editId.value = -1;
    resetForm(opt.form);
    if (formRef.value) {
      formRef.value.clearValidate();
    }
  };
  return {
    drawerFormTitle,
    form,
    formRef,
    drawerFormRef,
    rules,
    handleCreate,
    handleSubmit,
    handleClose,
    handleUpdate,
  };
}
