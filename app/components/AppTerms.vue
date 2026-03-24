<template>
  <div class="flex-column gap-sm">

    <!-- Loading State -->
    <div v-if="fetching" class="flex-center" style="min-height: 300px;">
      <span>{{ t('common.loading') }}</span>
    </div>

    <template v-else>
      <h5>{{ t('labels.content_ar') }}</h5>
      <div class="editor-wrapper" dir="rtl">
        <ClientOnly>
          <QuillEditor
            v-model:content="termsAr"
            content-type="html"
            :options="editorOptions"
            theme="snow"
          />
        </ClientOnly>
      </div>

      <h5>{{ t('labels.content_en') }}</h5>
      <div class="editor-wrapper" dir="ltr">
        <ClientOnly>
          <QuillEditor
            v-model:content="termsEn"
            content-type="html"
            :options="editorOptionsEn"
            theme="snow"
          />
        </ClientOnly>
      </div>

      <div class="flex-end gap-sm">
        <button
          class="custom-btn text-btn min-btn-width"
          @click="handleCancel"
          :disabled="saving"
        >
          {{ t('common.cancel') }}
        </button>
        <button
          class="custom-btn secondary-btn min-btn-width"
          @click="handleSave"
          :disabled="saving"
        >
          <span v-if="saving">{{ t('common.saving') }}</span>
          <span v-else>{{ t('common.save') }}</span>
        </button>
      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'
import { useAppToast } from '~/composables/useAppToast'

const { t } = useI18n()
const api = useApi()
const { success, error: toastError } = useAppToast()

const SLUG = 'terms-and-conditions'

/* =============================
   STATE
============================== */
const termsAr = ref('')
const termsEn = ref('')
const originalAr = ref('')
const originalEn = ref('')
const saving = ref(false)
const fetching = ref(false)

/* =============================
   FETCH
============================== */
const fetchTerms = async () => {
  try {
    fetching.value = true
    const res = await api(`/v1/admin/static-pages/${SLUG}`)
    if (res?.data) {
      termsAr.value = res.data.content?.ar || ''
      termsEn.value = res.data.content?.en || ''
      // احتفظ بالأصل عشان الـ cancel يرجعهم
      originalAr.value = termsAr.value
      originalEn.value = termsEn.value
    }
  } catch (err) {
    toastError(t('errors.somethingWentWrong'))
  } finally {
    fetching.value = false
  }
}

/* =============================
   EDITOR OPTIONS
============================== */
const editorOptions = computed(() => ({
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ header: [1, 2, 3, false] }],
      [{ align: [] }],
      ['clean']
    ]
  },
  placeholder: t('placeholders.search'),
}))

const editorOptionsEn = computed(() => ({
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ header: [1, 2, 3, false] }],
      [{ align: [] }],
      ['clean']
    ]
  },
  placeholder: t('placeholders.search'),
}))

/* =============================
   ACTIONS
============================== */
const handleSave = async () => {
  try {
    saving.value = true
    await api(`/v1/admin/static-pages/${SLUG}`, {
      method: 'PUT',
      body: {
        content: {
          ar: termsAr.value,
          en: termsEn.value,
        }
      }
    })
    // حدّث الأصل بعد الحفظ
    originalAr.value = termsAr.value
    originalEn.value = termsEn.value

    success(t('messages.updated_successfully', { item: t('settings.terms_and_conditions') }))

  } catch (err) {
    toastError(err?.data?.message || t('errors.somethingWentWrong'))
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  termsAr.value = originalAr.value
  termsEn.value = originalEn.value
}

/* =============================
   INIT
============================== */
onMounted(() => {
  fetchTerms()
})
</script>

<style scoped>
.editor-wrapper {
  width: 100%;
}
:deep(.ql-toolbar) {
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  border-color: #E4E4E4 !important;
  font-family: inherit;
}
:deep(.ql-container) {
  border-radius: 0 0 var(--radius-sm) var(--radius-sm);
  border-color: #E4E4E4 !important;
  font-family: inherit;
  font-size: var(--size-sm);
  min-height: 200px;
}

:deep(.ql-editor) {
  min-height: 200px;
  font-family: inherit;
  line-height: 1.8;
  direction: inherit;
  padding: 16px 12px;
  text-align: start !important;
}
:deep(.ql-editor li:not(.ql-direction-rtl)::before) {
    margin-left: unset !important;
}
:deep(.ql-editor p) {
  margin-bottom: 12px;
}

[dir="rtl"] :deep(.ql-snow .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg) {
    left: 0px !important;
    right: unset !important;
}
:deep(.ql-toolbar.ql-snow .ql-formats) {
    margin-inline-end: 15px !important;
    margin-right: 0px !important;
}

:deep(.ql-editor.ql-blank::before) {
  font-style: normal;
  color: var(--placeholder, #9ca3af);
}

:deep(.ql-toolbar button:hover),
:deep(.ql-toolbar button.ql-active) {
  color: var(--primary-color) !important;
}

:deep(.ql-toolbar button:hover .ql-stroke),
:deep(.ql-toolbar button.ql-active .ql-stroke) {
  stroke: var(--primary-color) !important;
}

:deep(.ql-toolbar button:hover .ql-fill),
:deep(.ql-toolbar button.ql-active .ql-fill) {
  fill: var(--primary-color) !important;
}
</style>