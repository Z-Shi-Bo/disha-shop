import { computed, ref } from 'vue';
import $api from '@/axios/goods';
import { useToast, useMessageBox } from '@/utils/useMessage';
import { useArrayMoveUp, useArrayMoveDown, cartesianProductOf } from '@/utils/useCommonTools';
// 商品id
export const goodsId = ref(0);
// 规格设置表格数据
export const skuTableData = ref([]);

// 商品规格列表
export const goodsSkuList = ref([]);
// 初始化商品规格列表
export function initGoodsSkuList(res) {
  goodsSkuList.value = res.goodsSkusCard.map((o) => {
    o.text = o.name;
    o.loadling = false;
    o.goodsSkusCardValue.map((v) => {
      v.text = v.value || '属性值';
      return v;
    });
    return o;
  });
  skuTableData.value = res.goodsSkus;
}

// 添加商品规格
export const loadingBtn = ref(false);
export function addGoodsSku() {
  loadingBtn.value = true;
  $api
    .addGoodCard({ goods_id: goodsId.value, name: '规格名称', order: 50, type: 0 })
    .then((res) => {
      goodsSkuList.value.push({
        ...res,
        text: '规格名称',
        loading: false,
        goodsSkusCardValue: [],
      });
    })
    .finally(() => {
      loadingBtn.value = false;
    });
}

// 修改规格选项
export function updateGoodsSku(item) {
  item.loading = true;
  $api
    .updateGoodCard(item.id, { goods_id: item.goods_id, name: item.text, order: item.order, type: item.type })
    .then(() => {
      item.name = item.text;
    })
    .catch(() => {
      item.text = item.name;
    })
    .finally(() => {
      item.loading = false;
    });
}

// 删除规格选项
export function deleteGoodsSku(item) {
  useMessageBox('删除', '确定删除此商品规格选项么？', 'warning')
    .then((confirm) => {
      item.loading = true;
      $api
        .deleteGoodCard(item.id)
        .then(() => {
          useToast('成功删除商品规格选项');
          const index = goodsSkuList.value.findIndex((i) => i.id === item.id);
          if (index !== -1) {
            goodsSkuList.value.splice(index, 1);
          }
          watchTableSkuData();
        })
        .catch(() => {
          useToast('商品规格选项删除失败');
        })
        .finally(() => {
          item.loading = false;
        });
    })
    .catch((cancel) => {
      console.log(cancel);
    });
}

// 排序规格选项
export const bodyLoading = ref(false);
export function sortGoodsCard(action, index) {
  const oList = JSON.parse(JSON.stringify(goodsSkuList.value));
  const func = action === 'up' ? useArrayMoveUp : useArrayMoveDown;
  func(oList, index);
  bodyLoading.value = true;
  const sortdata = oList.map((o, i) => {
    return {
      id: o.id,
      order: i + 1,
    };
  });
  $api
    .sortGoodCard({ sortdata })
    .then((res) => {
      func(goodsSkuList.value, index);
      watchTableSkuData();
    })
    .finally(() => {
      bodyLoading.value = false;
    });
}

// 选择设置商品规格值
export function handleChooseGoodsSkuValue(id, data) {
  const item = goodsSkuList.value.find((item) => item.id === id);
  item.loading = true;
  $api
    .setGoodCardValue(id, data)
    .then((res) => {
      item.value = item.text = res.goods_skus_card.name;
      item.goodsSkusCardValue = res.goods_skus_card_value.map((o) => {
        o.text = o.value || '属性值';
        return o;
      });
      watchTableSkuData();
    })
    .finally(() => {
      item.loading = false;
    });
}
// 初始化商品规格属性值
export function initGoodsSkuValue(id) {
  const inputValue = ref('');
  const inputVisible = ref(false);
  const InputRef = ref();
  const item = goodsSkuList.value.find((item) => item.id === id);
  const loading = ref(false);

  const handleClose = (tag) => {
    loading.value = true;
    $api
      .deleteGoodCardValue(tag.id)
      .then((res) => {
        const index = item.goodsSkusCardValue.findIndex((i) => i.id === tag.id);
        if (index !== -1) {
          item.goodsSkusCardValue.splice(index, 1);
        }
        watchTableSkuData();
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const showInput = () => {
    inputVisible.value = true;
    nextTick(() => {
      InputRef.value.input.focus();
    });
  };

  const handleInputConfirm = () => {
    if (!inputValue.value) {
      inputVisible.value = false;
      return;
    }
    loading.value = true;
    $api
      .addGoodCardValue({ goods_skus_card_id: id, value: inputValue.value, name: item.name, order: 50 })
      .then((res) => {
        item.goodsSkusCardValue.push({
          ...res,
          text: inputValue.value,
        });
        watchTableSkuData();
      })
      .finally(() => {
        loading.value = false;
        inputVisible.value = false;
        inputValue.value = '';
      });
  };

  // 修改属性的值
  const handleChange = (tag) => {
    loading.value = true;
    $api
      .updateGoodCardValue(tag.id, { goods_skus_card_id: tag.goods_skus_card_id, value: tag.text, name: tag.name, order: tag.order })
      .then(() => {
        tag.value = tag.text;
        watchTableSkuData();
      })
      .catch(() => {
        tag.text = tag.value;
      })
      .finally(() => {
        loading.value = false;
      });
  };
  return {
    item,
    inputValue,
    inputVisible,
    InputRef,
    handleClose,
    showInput,
    handleInputConfirm,
    loading,
    handleChange,
  };
}

// 初始化规格设置表格
export function initGoodsSkuTableList() {
  const skuLabels = computed(() => goodsSkuList.value.filter((item) => item.goodsSkusCardValue.length > 0));

  // 获取表头
  const tableHeader = computed(() => {
    const length = skuLabels.value.length;
    return [
      {
        label: '商品规格',
        rowspan: length > 0 ? 1 : 2,
        colspan: length,
      },
      {
        label: '销售价',
        width: '100',
        rowspan: 2,
      },
      {
        label: '市场价',
        width: '100',
        rowspan: 2,
      },
      {
        label: '成本价',
        width: '100',
        rowspan: 2,
      },
      {
        label: '库存',
        width: '100',
        rowspan: 2,
      },
      {
        label: '体积',
        width: '100',
        rowspan: 2,
      },
      {
        label: '重量',
        width: '100',
        rowspan: 2,
      },
      {
        label: '编码',
        width: '100',
        rowspan: 2,
      },
    ];
  });
  return {
    skuTableData,
    skuLabels,
    tableHeader,
  };
}

// 动态监听表格数据变化
function watchTableSkuData() {
  setTimeout(() => {
    if (goodsSkuList.value.length === 0) return;
    let list = [];
    goodsSkuList.value.map((o) => {
      if (o.goodsSkusCardValue && o.goodsSkusCardValue.length > 0) {
        list.push(o.goodsSkusCardValue);
      }
    });
    if (list.length === 0) {
      return [];
    }

    const arr = cartesianProductOf(...list);
    // 获取之前的规格列表
    let beforeSkuList = JSON.parse(JSON.stringify(skuTableData.value)).map((o) => {
      // 把对象转为数组
      if (!Array.isArray(o.skus)) {
        o.skus = Object.keys(o.skus).map((k) => o.skus[k]);
      }
      // 先把数组排序，然后把id拼接成字符串
      o.skuId = o.skus
        .sort((a, b) => a.id - b.id)
        .map((s) => s.id)
        .join(',');
      return o;
    });
    skuTableData.value = [];
    skuTableData.value = arr.map((item) => {
      const o = getBeforeSkuData(JSON.parse(JSON.stringify(item)), beforeSkuList);
      return {
        image: '',
        pprice: o?.pprice || 0,
        oprice: o?.oprice || 0,
        cprice: o?.cprice || 0,
        stock: o?.stock || 0,
        volume: o?.volume || 0,
        weight: o?.weight || 0,
        code: o?.code || '',
        goods_id: goodsId.value,
        skus: item,
      };
    });
  }, 200);
}

// 获取之前的缓存数据
function getBeforeSkuData(skus, beforeSkuList) {
  const skuId = skus
    .sort((a, b) => a.id - b.id)
    .map((s) => s.id)
    .join(',');
  return beforeSkuList.find((o) => {
    if (skus.length > o.skus.length) {
      return skuId.indexOf(o.skuId) !== -1;
    }
    return o.skuId.indexOf(skuId) !== -1;
  });
}
