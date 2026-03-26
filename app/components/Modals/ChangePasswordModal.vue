<template>
  <ModalsAppModal
    v-model="show"
    :title="t('profile.change_password')"
    :icon="IconsLock"
    :close-on-backdrop="false"
  >
    <Form 
      ref="formRef"
      :validation-schema="schema"
      v-slot="{ meta }"
      @submit="sendCode"
    >
      <div class="change-password-content">

        <!-- Email -->
        <Field v-if="type === 'email'" :key="'email'" name="contact" v-model="contact" v-slot="{ field, errorMessage }">
          <InputsFormInput
            name="contact"
            v-model="contact"
            @blur="field.onBlur"
            :label="t('labels.email')"
            :placeholder="t('placeholders.email')"
            type="email"
            class="required"
            :error="errorMessage"
          />
        </Field>

        <!-- Phone -->
        <Field v-if="type === 'phone'" :key="'phone'" name="contact" v-model="contact" v-slot="{ field, errorMessage }">
          <InputsFormInput
            name="contact"
            v-model="contact"
            @blur="field.onBlur"
            :label="t('labels.phone')"
            :placeholder="t('placeholders.phone')"
            type="text"
            inputmode="numeric"
            @input="contact = contact.replace(/(?!^\+)[^0-9]/g, '')"
            class="required"
            :error="errorMessage"
          />
        </Field>

      </div>

      <div class="flex-end gap-2 w-100 mt-3">
        <button class="custom-btn text-btn min-btn-width" type="button" @click="show = false">
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
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { IconsLock } from '#components'
import { useApi } from '~/composables/useApi'
import { useI18n } from 'vue-i18n'
import { nextTick } from 'vue'

const { t } = useI18n()
const api = useApi()
const show = defineModel('show')

const props = defineProps({
  type: {
    type: String,
    default: 'email'  // 'email' | 'phone'
  },
  endpoint: {
    type: String,
    required: true
  }
})

const contact = ref('')
const emit = defineEmits(['open-otp'])
const { error: toastError } = useAppToast()

// ✅ Schema بيتغير حسب الـ type
const schema = computed(() =>
  yup.object({
    contact: props.type === 'email'
      ? yup.string()
          .required(t('errors.email_required'))
          .email(t('errors.email_invalid'))
      : yup.string()
          .required(t('errors.phone_required'))
          .matches(/^\+?[0-9]{8,15}$/, t('errors.phone_invalid'))
  })
)
const formRef = ref(null)

const resetModalForm = async () => {
  await nextTick()
  contact.value = ''
  formRef.value?.resetForm({ values: { contact: '' } })
}

// ✅ reset لو الـ modal اتفتح تاني او النوع اتغير
watch(show, async (val) => {
  if (val) {
    await resetModalForm()
  }
})

watch(() => props.type, async () => {
  await resetModalForm()
})

const isLoading = ref(false)

const sendCode = async () => {
  isLoading.value = true
  try {
    // ✅ API بتتوقع الاتنين دايماً، الفاضي يبقى ""
    await api(props.endpoint, {
      method: 'POST',
      body: {
        email: props.type === 'email' ? contact.value : '',
        phone: props.type === 'phone' ? contact.value : ''
      }
    })
    emit('open-otp', { value: contact.value, type: props.type })  // ✅ بنبعت النوع مع القيمة
    show.value = false
  } catch (err) {
    toastError(err.data?.message || t('errors.somethingWentWrong'))
  } finally {
    isLoading.value = false
  }
}
</script>