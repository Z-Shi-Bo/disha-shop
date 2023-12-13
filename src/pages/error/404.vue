<template>
  <el-result title="404" sub-title="Sorry, request error">
    <template #icon>
      <el-image
        :src="imgUrl"
      />
    </template>
    <template #extra>
      <router-link to="/"><el-button type="primary">返回首页</el-button></router-link>
    </template>
  </el-result>
</template>

<script setup name="NotFound">
import { requireAssetsImg } from "@/utils/useCommonTools";
const imgUrl = requireAssetsImg("404.gif");
</script>

<style scoped></style>
