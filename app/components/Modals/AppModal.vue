<template>
  <div 
    class="modal fade" 
    tabindex="-1" 
    aria-hidden="true"
    ref="modalElement"
  >
    <div class="modal-dialog modal-dialog-centered" :style="{ maxWidth: width }">
      <div class="modal-content border-0 overflow-hidden">
        
        <!-- Modal Header -->
        <div v-if="hasHeader" class="modal-header flex-between">
          <button type="button" class="btn-close m-0 shadow-none border-0" @click="closeModal" aria-label="Close"></button>
          
          <div class="d-flex align-items-center gap-xs">
            <div v-if="icon" class="title-icon d-flex align-items-center justify-content-center">
              <component :is="icon" width="22" height="22" />
            </div>
            <h5 class="modal-title fw-semibold">{{ title }}</h5>
          </div>
        </div>

        <!-- Headerless Close Button -->
        <div v-else class="position-relative" style="min-height: 40px;">
           <button type="button" class="btn-close position-absolute top-10 start-10 m-0 shadow-none border-0" @click="closeModal" aria-label="Close"></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <slot />
        </div>

        <!-- Modal Footer -->
        <div v-if="$slots.footer" class="modal-footer border-0 pt-0 d-flex gap-xs w-100 pb-3">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch, ref } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  icon: { type: [Object, Function, String], default: null },
  hasHeader: { type: Boolean, default: true },
  width: { type: String, default: '540px' }
})

const emit = defineEmits(['update:modelValue'])
const modalElement = ref(null)
let modalInstance = null

const closeModal = () => {
    emit('update:modelValue', false)
}

onMounted(() => {
  if (process.client) {
    const { $bootstrap } = useNuxtApp()
    if ($bootstrap && $bootstrap.Modal) {
      modalInstance = new $bootstrap.Modal(modalElement.value)
      
      modalElement.value.addEventListener('hidden.bs.modal', () => {
        emit('update:modelValue', false)
      })

      if (props.modelValue) {
        modalInstance.show()
      }
    }
  }
})

watch(() => props.modelValue, (newVal) => {
  if (modalInstance) {
    if (newVal) modalInstance.show()
    else modalInstance.hide()
  }
})

onUnmounted(() => {
  if (modalInstance) {
    modalInstance.hide()
    modalInstance.dispose()
  }
})
</script>

<style scoped>
.modal-content {
  border-radius: var(--radius-md);
  background: linear-gradient(181deg, #FFF8EA 0.83%, #FFF 31.44%);
  box-shadow: 0 20px 24px -4px rgba(16, 24, 40, 0.10), 0 8px 8px -4px rgba(16, 24, 40, 0.04);
}

.modal-header {
  border-bottom: 1px solid #E2E5E9;
}

.modal-title {
  font-size: 18px;
  color: var(--primary-color);
}

.title-icon {
  color: var(--secondary-color);
}
.title-icon :deep(path) {
    fill: var(--secondary-color) !important;
}
/* Custom button styles */
.btn-close {
  background-size: 14px !important;
  transition: all 0.2s;
  padding: 10px;
}
.btn-close:hover {
  opacity: 1;
}

.start-10 {
    inset-inline-start: 16px;
}
.top-10 {
    top: 16px;
}

[dir="rtl"] .modal-header {
  flex-direction: row-reverse;
}
</style>
