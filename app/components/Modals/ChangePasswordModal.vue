<template>
  <ModalsAppModal
    v-model="show"
    :title="t('profile.change_password')"
    :icon="IconsLock"
    :close-on-backdrop="false"
  >
    <div class="change-password-content">
      <InputsFormInput 
        v-model="email"
        :label="t('labels.email')" 
        :placeholder="t('placeholders.email')" 
        class="required"
        required
      />
    </div>

    <template #footer>
      <div class="flex-end gap-2 w-100">
        <button class="custom-btn text-btn min-btn-width" @click="show = false">{{ t('buttons.cancel') }}</button>
        <button class="custom-btn secondary-btn min-btn-width" @click="sendCode">{{ t('buttons.next') }}</button>
      </div>
    </template>
  </ModalsAppModal>
</template>

<script setup>
import { IconsLock } from '#components'
import { useApi } from '~/composables/useApi'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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

