<template>
  <el-tag v-for="tag in dynamicTags" :key="tag" class="mx-1" closable :disable-transitions="false" @close="handleCloseTag(tag)">
    {{ tag }}
  </el-tag>
  <div class="ml-1 w-20">
    <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" size="small" @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
    <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput"> + 添加值 </el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
  modelValue: {
    type: String,
  },
})
const emit = defineEmits(['update:modelValue']);
//侧边栏新增规格值操作
const inputValue = ref('');
const inputVisible = ref(false);
const dynamicTags = ref(props.modelValue ? props.modelValue.split(',') : []);
const InputRef = ref();

const handleCloseTag = (tag) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1);
  emit('update:modelValue', dynamicTags.value.join(','));
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value.input.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value);
    emit('update:modelValue', dynamicTags.value.join(','));
  }
  inputVisible.value = false;
  inputValue.value = '';
};
</script>
