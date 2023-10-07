<script setup>
import { useRouter } from 'vue-router'
import { useIGTStore } from "@/stores/igt";

const router = useRouter()
const store = useIGTStore()

function onChangeFiles(event) {
  store.addFile(event.target.files[0])
}

function uploadToolbox(index) {
  store.selectFile(index)
  store.parseFiles()
  router.push({name: 'transform'})
}
</script>
<template>
  <main>
    <div class="mb-3">
      <label for="toolboxFile" class="form-label">Add ToolBox or Flextext file to process</label>
      <input class="form-control" type="file" id="toolboxFile" @change="onChangeFiles">
    </div>
    <div id="file-list">
      Selected files (click to parse):
      <div class="file list-group">
        <a class="list-group-item list-group-item-action"
           v-for="(file, index) in store.files"
           :key="file.name" @click="uploadToolbox(index)">{{ file.name }}</a>
      </div>
    </div>
<!--    <div class="col-auto">-->
<!--    <button type="submit" id="uploadToolboxBtn" :disabled="!store.fileSelected" @click="uploadToolbox" class="btn btn-primary mb-3">Parse</button>-->
<!--  </div>-->
  </main>
</template>
