<template>
  <ModalsAppModal
    v-model="show"
    title="تعديل كلمة المرور"
    :icon="IconsLock"
  >
    <div class="change-password-content">
      <InputsFormInput 
        v-model="password"
        type="password"
        label="كلمة المرور الجديدة" 
        placeholder="ادخل كلمة المرور الجديدة" 
        class="required"
        required
      />
      <InputsFormInput 
        v-model="confirmPassword"
        type="password"
        label="تاكيد كلمة المرور الجديدة" 
        placeholder="ادخل تاكيد كلمة المرور الجديدة" 
        class="required"
        required
      />
    </div>

    <template #footer>
      <div class="flex-end gap-2 w-100">
        <button class="custom-btn text-btn min-btn-width" @click="show = false">إلغاء</button>
        <button class="custom-btn secondary-btn min-btn-width" @click="resetPassword">حفظ</button>
      </div>
    </template>
  </ModalsAppModal>
</template>

<script setup>
import { IconsLock } from '#components'
import { useApi } from '~/composables/useApi'

const api = useApi()
const show = defineModel('show')

const props = defineProps({
  email: String,
  code: String
})

const password = ref('')
const confirmPassword = ref('')

const resetPassword = async () => {

  if(password.value !== confirmPassword.value){
    alert('كلمة المرور غير متطابقة')
    return
  }

  try{

    await api('/admin/reset-password',{
      method:'POST',
      body:{
        email: props.email,
        code: props.code,
        password: password.value,
        password_confirmation: confirmPassword.value
      }
    })

    alert('تم تغيير كلمة المرور بنجاح')

    show.value = false

  }catch(err){

    console.error(err)

  }

}
</script>

