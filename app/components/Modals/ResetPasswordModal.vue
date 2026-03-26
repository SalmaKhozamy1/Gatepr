<template>
  <ModalsAppModal
    v-model="show"
    :title="t('profile.change_password')"
    :icon="IconsLock"
    :close-on-backdrop="false"
  >
    <div class="change-password-content">
      <InputsFormInput 
        v-model="password"
        type="password"
        :label="t('labels.password')" 
        :placeholder="t('placeholders.password')" 
        class="required"
        required
      />
      <InputsFormInput 
        v-model="confirmPassword"
        type="password"
        :label="t('labels.password')" 
        :placeholder="t('placeholders.password')" 
        class="required"
        required
      />
    </div>

    <template #footer>
      <div class="flex-end gap-2 w-100">
        <button class="custom-btn text-btn min-btn-width" @click="show = false">{{ t('common.cancel') }}</button>
        <button class="custom-btn secondary-btn min-btn-width" @click="resetPassword">{{ t('common.save') }}</button>
      </div>
    </template>
  </ModalsAppModal>
</template>

<script setup>
import { IconsLock } from '#components'
import { useApi } from '~/composables/useApi'
import { useI18n } from 'vue-i18n'
import { useAppToast } from '~/composables/useAppToast'

const { t } = useI18n()
const { success, error: toastError } = useAppToast()

const api = useApi()
const show = defineModel('show')

const props = defineProps({
  contact: String,
  type: {
    type: String,
    default: 'email'
  },
  code: String,
  token: String,
  resetEndpoint: {
    type: String,
    default: '/v1/admin/reset-password'
  }
})

const password = ref('')
const confirmPassword = ref('')

const resetPassword = async () => {

  if(password.value !== confirmPassword.value){
    toastError(t('modals.password_mismatch'))
    return
  }

  try{

    await api(props.resetEndpoint, {
      method:'POST',
      body:{
        email: props.type === 'email' ? props.contact : '',
        phone: props.type === 'phone' ? props.contact : '',
        code: props.code,
        token: props.token,
        password: password.value,
        password_confirmation: confirmPassword.value
      }
    })

    success(t('modals.reset_password_success'))

    show.value = false

  }catch(err){

    toastError(err.data?.message || t('errors.somethingWentWrong'))

  }

}
</script>

