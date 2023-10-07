// import { ref } from 'vue'
import { defineStore } from 'pinia'
import { parseFile } from '@/services/parseutils'

export const useIGTStore = defineStore('igtStore', {
  state: () => ({
    files: [],
    loading: false,
    errors: [],
    curFile: null
  }),
  getters: {
    fileSelected() {
      return this.curFile !== null
    },
    errorMessage() {
      return this.errors.join('\n')
    },
    selectedFile() {
      return this.fileSelected ? this.files[this.curFile] : null
    }
  },
  actions: {
    addFile(file) {
      this.files.push(file)
    },
    deleteFile(index) {
      this.files.splice(index, 1)
    },
    selectFile(index) {
      this.curFile = index
    },
    async parseFiles() {
      this.loading = true
      await Promise.all(this.files.map(async (file) => { file.parsed = await parseFile(file) }))
      this.loading = false
    }
  }
})
