<template>
  <ModalsAppModal
    v-model="show"
    :title="t('profile.change_password')"
    :icon="IconsLock"
    :close-on-backdrop="false"
  >
    <Form 
      :validation-schema="schema"
      v-slot="{ meta }"
      @submit="sendCode"
    >
      <div class="change-password-content">
        <Field name="email" v-model="email" v-slot="{ field, errorMessage }">
          <InputsFormInput
            name="email"
            v-model="email"
            @blur="field.onBlur"
            :label="t('labels.email')"
            :placeholder="t('placeholders.email')"
            class="required"
            :error="errorMessage"
          />
        </Field>
      </div>

      <div class="flex-end gap-2 w-100 mt-3">
        <button
          class="custom-btn text-btn min-btn-width"
          type="button"
          @click="show = false"
        >
          {{ t('common.cancel') }}
        </button>
        <button
          class="custom-btn secondary-btn min-btn-width"
          type="submit"
          :disabled="!meta.valid || isLoading"
          :class="{ 'btn-disabled': !meta.valid || isLoading }"
        >
          <span v-if="isLoading" class="btn-spinner" />
          <span v-else>{{ t('buttons.next') }}</span>
        </button>
      </div>
    </Form>
  </ModalsAppModal>
</template>

<script setup>
import { Form, Field, useForm } from 'vee-validate'
import * as yup from 'yup'
import { IconsLock } from '#components'
import { useApi } from '~/composables/useApi'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const api = useApi()
const show = defineModel('show')

const email = ref('')
const emit = defineEmits(['open-otp'])
const { error: toastError } = useAppToast()

// ✅ Yup Schema
const schema = yup.object({
  email: yup
    .string()
    .required(t('errors.email_required'))
    .email(t('errors.email_invalid'))
})

const isLoading = ref(false)

const sendCode = async () => {
  isLoading.value = true
  try {
    await api('/v1/admin/forgot-password', {
      method: 'POST',
      body: {
        email: email.value
      }
    })
    emit('open-otp', email.value)
    show.value = false
  } catch (err) {
    toastError(err.data?.message || t('errors.somethingWentWrong'))
  } finally {
    isLoading.value = false
  }
}

</script>

<style scoped>
.btn-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
