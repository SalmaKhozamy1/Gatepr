<template>
  <ModalsAppModal
    :model-value="modelValue"
    :has-header="false"
    @update:model-value="$emit('update:modelValue', $event)"
    :close-on-backdrop="false"
  >
    <div class="registration-success-content flex-column-center gap-sm text-center">
      <div class="success-icon-wrapper mb-2">
        <div class="success-circle d-flex align-items-center justify-content-center">
         <svg width="60" height="60" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="48" height="48" rx="24" fill="#D1FADF"/>
            <rect x="4" y="4" width="48" height="48" rx="24" stroke="#ECFDF3" stroke-width="8"/>
            <path d="M38 27.0801V28.0001C37.9988 30.1565 37.3005 32.2548 36.0093 33.9819C34.7182 35.7091 32.9033 36.9726 30.8354 37.584C28.7674 38.1954 26.5573 38.122 24.5345 37.3747C22.5117 36.6274 20.7847 35.2462 19.611 33.4372C18.4373 31.6281 17.8798 29.4882 18.0217 27.3364C18.1636 25.1847 18.9972 23.1364 20.3983 21.4972C21.7994 19.8579 23.6928 18.7155 25.7962 18.2403C27.8996 17.765 30.1003 17.9824 32.07 18.8601M38 20.0001L28 30.0101L25 27.0101" stroke="#0CB98F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        </div>
      </div>
      
      <h4>{{ t('registration_success.title') }}</h4>
      <p class="dark-gray px-3">
        {{ t('registration_success.message') }}
      </p>
      
      <button class="custom-btn primary-btn w-100" @click="goToLogin">
        {{ t('registration_success.return_to_login') }}
      </button>
    </div>
  </ModalsAppModal>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const props = defineProps({
  modelValue: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])
const { t, locale } = useI18n()
const router = useRouter()
const localePath = useLocalePath()

const goToLogin = () => {
  emit('update:modelValue', false)
  router.push(localePath('/login/supplier'))
}
</script>

