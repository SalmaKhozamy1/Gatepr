<template>
  <!-- Modal الاختيار -->
  <ModalsAppModal
    v-model="show"
    :title="t('profile.change_password')"
    :icon="IconsLock"
    :close-on-backdrop="false"
  >
    <div class="change-password-content">
      <label class="form-label w-100">{{ t('labels.choose_verification_method') }}</label>
      <div class="radio-group mb-3 flex-start gap-sm">
        <div class="col">
          <InputsRadioOption
            :label="t('labels.email')"
            value="email"
            v-model="contactMethod"
          />
        </div>
        <div class="col">
          <InputsRadioOption
            :label="t('labels.phone')"
            value="phone"
            v-model="contactMethod"
          />
        </div>
      </div>
    </div>

    <div class="flex-end gap-2 w-100 mt-3">
      <button class="custom-btn text-btn min-btn-width" type="button" @click="show = false">
        {{ t('common.cancel') }}
      </button>
      <button
        class="custom-btn secondary-btn min-btn-width"
        type="button"
        @click="goNext"
      >
        {{ t('buttons.next') }}
      </button>
    </div>
  </ModalsAppModal>

  <!-- ✅ برا الـ AppModal مش جواه -->
  <ModalsChangePasswordModal
    v-model:show="showContactModal"
    :type="contactMethod"
    endpoint="/forgot-password"
    @open-otp="(val) => { resetContact = val.value || val; contactType = val.type || 'email'; showOtpModal = true }"
  />
  <ModalsOtpModal 
    v-model:show="showOtpModal" 
    :contact="resetContact" 
    :type="contactType"
    verifyEndpoint="/verify-code"
    resendEndpoint="/forgot-password"
    @open-reset-password="(data) => emit('open-reset-password', data)"
  />
</template>

<script setup>
import { IconsLock } from '#components'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const show = defineModel('show')
const emit = defineEmits(['open-otp', 'open-reset-password'])

const contactMethod = ref('email')
const showContactModal = ref(false)
const showOtpModal = ref(false)
const resetContact = ref('')
const contactType = ref('email')

const goNext = () => {
  show.value = false
  // ✅ تأخير صغير عشان الـ modal الأول يخلص animation القفل
  setTimeout(() => {
    showContactModal.value = true
  }, 300)
}
</script>