<template>
  <ModalsAppModal
    v-model="show"
    title="تعديل كلمة المرور"
    :icon="IconsLock"
  >
    <div class="change-password-content">
      <InputsFormInput 
        v-model="email"
        label="البريد الإلكتروني" 
        placeholder="ادخل البريد الإلكتروني" 
        class="required"
        required
      />
    </div>

    <template #footer>
      <div class="flex-end gap-2 w-100">
        <button class="custom-btn text-btn min-btn-width" @click="show = false">إلغاء</button>
        <button class="custom-btn secondary-btn min-btn-width" @click="sendCode">التالي</button>
      </div>
    </template>
  </ModalsAppModal>
</template>

<script setup>
import { IconsLock } from '#components'
import { useApi } from '~/composables/useApi'

const api = useApi()
const show = defineModel('show')

const email = ref('')
const emit = defineEmits(['open-otp'])

const sendCode = async () => {
  try {
    await api('/v1/admin/forgot-password', {
      method: 'POST',
      body: {
        email: email.value
      }
    })
    console.log("emaile", email.value);
    
    emit('open-otp', email.value)

    show.value = false

  } catch (err) {
    console.error(err)
  }
}

</script>

