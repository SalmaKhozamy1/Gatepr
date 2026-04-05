<template>
  <div class="file-uploader-wrapper">
    <!-- Label -->
    <label v-if="label" class="form-label">{{ label }}</label>
    <!-- Drop Zone -->
    <div
      class="uploader-placeholder dashed flex-center" 
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
      <div class="upload-zone flex-column-center gap-sm text-center">
        <div class="upload_icon">
          <IconsUpload />
        </div>
        <p>
          اسحب وأفلت مستنداً، أو
          <span class=" pointer" style="color: var(--secondary-color);">تصفح</span>
        </p>
        <p class="desc">{{ acceptLabel }}</p>
      </div>
    </div>

    <!-- Uploaded Files List -->
    <div v-if="uploadedFiles.length" class="uploaded-files-list">
      <div
        v-for="(file, index) in uploadedFiles"
        :key="index"
        class="uploaded-file mt-2 p-2 flex-between">
          <!-- File Type Badge -->
          <div class="file-type-badge">
            <component :is="getFileIcon(file.name)" />
          </div>
          <!-- File Info -->
          <div class="file-info flex-grow-1">
            <p>{{ file.name }}</p>
            <p class="desc mt-1">{{ formatSize(file.size) }}</p>
          </div>

          <!-- Delete Button -->
          <IconsDelete
            class="icon delete-btn danger"
            width="18"
            height="18"
            @click.stop="removeFile(index)"
          >
          </IconsDelete>

      </div>
    </div>

    <span v-if="error" class="error d-block" style="color: var(--red); font-size: 14px; margin-top: 4px;">{{ error }}</span>
  </div>
</template>

<script setup>
import {IconsPdf, IconsWord, IconsXml, IconsFile } from '#components'
import { ref } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [Array, Object, String, File], 
    default: () => []
  },
  accept: {
    type: String,
    default: '.pdf,.xml,.doc,.docx'
  },
  acceptLabel: {
    type: String,
    default: 'PDF , XML , Word'
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'update:files'])

import { watch, onMounted } from 'vue'

const fileInput = ref(null)
const isDragging = ref(false)
const uploadedFiles = ref([])

// Synchronize with modelValue
watch(() => props.modelValue, (newVal) => {
  if (Array.isArray(newVal)) {
    uploadedFiles.value = newVal
  } else if (newVal) {
    uploadedFiles.value = [newVal]
  } else {
    uploadedFiles.value = []
  }
}, { immediate: true })

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
  emit('update:modelValue', uploadedFiles.value)
  emit('update:files', uploadedFiles.value)
}

function removeFile(index) {
  uploadedFiles.value.splice(index, 1)
  emit('update:modelValue', uploadedFiles.value)
  emit('update:files', uploadedFiles.value)
}

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' ميجا'
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' كيلو'
  return bytes + ' بايت'
}

function getFileIcon(filename) {
  const ext = filename.split('.').pop().toLowerCase()

  switch (ext) {
    case 'pdf':
      return IconsPdf
    case 'doc':
    case 'docx':
      return IconsWord
    case 'xml':
      return IconsXml
    default:
      return IconsFile
  }
}

</script>

<style scoped>
.required .form-label::after {
  content: "*";
  color: var(--red);
  margin-inline-start: 5px;
}

.uploader-placeholder {
  border-radius: var(--radius-sm);
  padding: var(--form-control-padding);
  min-height: 140px;
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
.upload_icon {
  color: var(--secondary-color);
}
.uploaded-file {
  border-radius: var(--radius-sm);
  background-color: #FBFBFC;
}
.file-type-badge {
  width: 38px;
  height: 44px;
  flex-shrink: 0;
}
.file-type-badge svg {
  width: 100%;
  height: 100%;
} 
.file-info .desc {
  font-size: var(--radius-xs);
}
.delete-btn {
  flex-shrink: 0;
}
.delete-btn:hover {
  opacity: 0.7;
}
.desc {
  font-size: 12px;
}
</style>
