<template>
  <div class="file-uploader-wrapper">
    <!-- Label -->
    <p v-if="label" class="uploader-label mb-2 fw-600 text-end">{{ label }}</p>
    <!-- Drop Zone -->
    <div
      class="uploader-placeholder p-4 border rounded dashed flex-column-center text-center"
      :class="{ 'drag-over': isDragging }"
      @click="triggerFileInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        class="d-none"
        :accept="accept"
        multiple
        @change="handleFileChange"
      />
      <div class="upload-zone py-3">
        <svg class="mb-3" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 16V4M12 4L8 8M12 4L16 8M4 16V20 M20 16V20 M4 20H20" stroke="#F6A816" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p class="small fw-600 mb-2">
          اسحب وأفلت مستنداً، أو
          <span class=" pointer" style="color: var(--secondary-color);">تصفح</span>
        </p>
        <p class="text-muted smaller mb-0">{{ acceptLabel }}</p>
      </div>
    </div>

    <!-- Uploaded Files List -->
    <div v-if="uploadedFiles.length" class="uploaded-files-list mt-3">
      <div
        v-for="(file, index) in uploadedFiles"
        :key="index"
        class="uploaded-file mt-2 p-3 border rounded bg-white flex-between"
        style="border-color: #F1F1F1 !important;"
      >
        <!-- Delete Button -->
        <svg
          class="pointer delete-btn"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          @click.stop="removeFile(index)"
        >
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        <!-- File Info -->
        <div class="file-info text-end flex-grow-1 px-3">
          <p class="fw-600 mb-0" style="font-size: 13px;">{{ file.name }}</p>
          <p class="text-muted mb-0" style="font-size: 11px;">{{ formatSize(file.size) }}</p>
        </div>

        <!-- File Type Badge -->
        <div
          class="rounded flex-center file-type-badge"
          :style="{ backgroundColor: getBadgeColor(file.name) }"
        >
          {{ getExtension(file.name) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  accept: {
    type: String,
    default: '.pdf,.xml,.doc,.docx'
  },
  acceptLabel: {
    type: String,
    default: 'PDF , XML , Word'
  }
})

const emit = defineEmits(['update:files'])

const fileInput = ref(null)
const isDragging = ref(false)
const uploadedFiles = ref([])

function triggerFileInput() {
  fileInput.value.click()
}

function handleFileChange(event) {
  addFiles(Array.from(event.target.files))
  // Reset input so the same file can be re-selected
  event.target.value = ''
}

function handleDrop(event) {
  isDragging.value = false
  addFiles(Array.from(event.dataTransfer.files))
}

function addFiles(files) {
  uploadedFiles.value.push(...files)
  emit('update:files', uploadedFiles.value)
}

function removeFile(index) {
  uploadedFiles.value.splice(index, 1)
  emit('update:files', uploadedFiles.value)
}

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' ميجا'
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' كيلو'
  return bytes + ' بايت'
}

function getExtension(filename) {
  return filename.split('.').pop().toUpperCase().slice(0, 4)
}

function getBadgeColor(filename) {
  const ext = filename.split('.').pop().toLowerCase()
  const colors = {
    pdf: '#EF4444',
    xml: '#3B82F6',
    doc: '#2563EB',
    docx: '#2563EB',
    xls: '#16A34A',
    xlsx: '#16A34A',
    png: '#8B5CF6',
    jpg: '#8B5CF6',
    jpeg: '#8B5CF6',
  }
  return colors[ext] || '#6B7280'
}
</script>

<style scoped>
.uploader-label {
  font-size: 15px;
}
.dashed {
  border: 2px dashed #E4E7EC !important;
}
.uploader-placeholder {
  transition: all 0.3s ease;
  cursor: pointer;
}
.uploader-placeholder:hover,
.uploader-placeholder.drag-over {
  border-color: var(--secondary-color) !important;
  background-color: var(--light-primary-color);
}
.fw-600 {
  font-weight: 600;
}
.smaller {
  font-size: 11px;
}
.file-type-badge {
  width: 38px;
  height: 44px;
  color: white;
  font-size: 10px;
  font-weight: bold;
  flex-shrink: 0;
}
.delete-btn {
  flex-shrink: 0;
  transition: opacity 0.2s ease;
}
.delete-btn:hover {
  opacity: 0.7;
}
.uploaded-file {
  animation: slideIn 0.25s ease;
}
@keyframes slideIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
