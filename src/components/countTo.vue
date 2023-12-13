<template>
  <div class="count-to">
    {{ output.toFixed(0) }}
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { TransitionPresets, useTransition } from "@vueuse/core";
const props = defineProps({
  value: {
    type: Number
  }
});
let source = ref(0);

const output = useTransition(source, {
  duration: 1000,
  transition: TransitionPresets.easeInOutCubic,
});
watch(() => props.value, (newVal) => {
  source.value = newVal
}, { immediate: true });
</script>

<style scoped></style>