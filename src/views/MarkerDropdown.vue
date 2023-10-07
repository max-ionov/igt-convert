<script setup>

const props = defineProps(['placeholder', 'entry', 'modelValue'])
defineEmits(['update:modelValue'])
</script>

<template>
  <select class="form-select form-select-sm w-auto d-inline-block"
          aria-label="{{ props.placeholder }}"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)">
    <option value="" disabled selected>{{ props.placeholder }}</option>
    <option value=""></option>
    <option v-for="(val, key, index) in props.entry" :value="key" :key="index">{{ val }} ({{ key }})</option>
  </select>
</template>

<style scoped>
select {
  max-width: 500px;
}
</style>