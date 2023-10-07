<script setup>
import EntryPreview from "@/views/EntryPreview.vue";

const props = defineProps(['entries'])
</script>

<template>
<div class="toolboxPreview">
  <EntryPreview :entry="props.entries[0]"></EntryPreview>
</div>
</template>

<style scoped>

</style>