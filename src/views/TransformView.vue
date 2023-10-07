<script setup>
import { useIGTStore } from "@/stores/igt";
import EntryPreview from "@/views/EntryPreview.vue";
import {ref} from "vue";

const store = useIGTStore()
let curEntry = ref(0)
</script>
<template>
  <main>
    <div v-if="store.files.length > 0">
      <div class="loading" v-if="store.loading">Loading...</div>
      <div class="error" v-else-if="store.errors.length > 0">Error parsing one of the files: <pre>{{ store.errors }}</pre></div>
      <div v-else>
        <EntryPreview :entry="store.selectedFile.parsed.entries[curEntry]"/>
        <button class="btn btn-secondary" @click="curEntry-= curEntry > 0 ? 1 : 0">« Prev</button>
        <button class="btn btn-secondary" @click="curEntry+= curEntry < store.files[0].parsed.entries.length - 1 ? 1 : 0">Next »</button>
      </div>
    </div>
    <p v-else>No files selected, please <router-link to="/">upload</router-link> something first</p>
  </main>
</template>

<style scoped>
.btn {
  margin: .25rem .125rem ;
}
</style>
