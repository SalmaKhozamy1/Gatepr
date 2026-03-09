<template>
  <ModalsAppModal
    v-model="show"
    title="تعديل كلمة المرور"
    :icon="IconsLock"
  >
    <div class="change-password-content">
      <InputsFormInput 
        label="البريد الإلكتروني" 
        placeholder="ادخل البريد الإلكتروني" 
        class="required"
        required
      />
    </div>

    <template #footer>
      <div class="flex-end gap-2 w-100">
        <button class="custom-btn text-btn px-5" @click="show = false">إلغاء</button>
        <button class="custom-btn secondary-btn px-5" @click="nextStep">التالي</button>
      </div>
    </template>
  </ModalsAppModal>
</template>

<script setup>
import { IconsLock } from '#components'

const show = defineModel('show')

const nextStep = () => {
  console.log('Next step triggered')
  // Add logic to proceed to OTP
}
</script>

