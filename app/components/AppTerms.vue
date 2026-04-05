<template>
  <div class="flex-column gap-sm">

    <!-- Loading State -->
    <div v-if="fetching" class="flex-center" style="min-height: 300px;">
      <span>{{ t('common.loading') }}</span>
    </div>

    <!-- Error/No Data -->
    <div v-else-if="!termsAr && !termsEn" class="text-center p-5">
      <p class="text-muted">{{ t('common.no_results_found') }}</p>
    </div>

    <!-- Static or Admin View -->
    <template v-else>

      <!-- Supplier View -->
      <div v-if="role === 'supplier'" class="terms-supplier-layout w-100">
        <div class="terms-sections">
          <div v-if="termsAr" class="terms-section mb-4">
            <div class="terms-section-label mb-2">{{ t('labels.content_ar') }}</div>
            <div class="terms-content-card" dir="rtl">
              <div class="terms-content-display" v-html="termsAr"></div>
            </div>
          </div>
          <div v-if="termsEn" class="terms-section">
            <div class="terms-section-label mb-2">{{ t('labels.content_en') }}</div>
            <div class="terms-content-card" dir="ltr">
              <div class="terms-content-display" v-html="termsEn"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin View -->
      <div v-else class="flex-column gap-sm w-100">

        <!-- Arabic Editor -->
        <h5>{{ t('labels.content_ar') }}</h5>
        <div class="editor-wrapper" dir="rtl" :class="{ 'is-invalid-wrapper': errorAr }">
          <ClientOnly>
            <QuillEditor
              v-model:content="termsAr"
              content-type="html"
              :options="editorOptions"
              theme="snow"
            />
          </ClientOnly>
        </div>
        <span v-if="errorAr" class="text-danger small mt-1 d-block">{{ errorAr }}</span>

        <!-- English Editor -->
        <h5>{{ t('labels.content_en') }}</h5>
        <div class="editor-wrapper" dir="ltr" :class="{ 'is-invalid-wrapper': errorEn }">
          <ClientOnly>
            <QuillEditor
              v-model:content="termsEn"
              content-type="html"
              :options="editorOptionsEn"
              theme="snow"
            />
          </ClientOnly>
        </div>
        <span v-if="errorEn" class="text-danger small mt-1 d-block">{{ errorEn }}</span>

        <div class="flex-end gap-sm mt-3">
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

      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'
import { useAppToast } from '~/composables/useAppToast'
import { useAuth } from '~/composables/useAuth'

const { t } = useI18n()
const api = useApi()
const { role } = useAuth()
const { success, error: toastError } = useAppToast()

const SLUG = 'terms-and-conditions'

/* =============================
   STATE
============================== */
const termsAr    = ref('')
const termsEn    = ref('')
const originalAr = ref('')
const originalEn = ref('')
const saving     = ref(false)
const fetching   = ref(true)
const errorAr    = ref('')
const errorEn    = ref('')

/* =============================
   HELPERS
   بنشيل الـ HTML tags والأرقام والمسافات
   عشان نتحقق من الحروف بس
   الرموز بتعدي لأنها مش في أي range
============================== */
const stripHtml     = (html) => html?.replace(/<[^>]*>/g, '').trim() || ''
const stripNonAlpha = (text) => text.replace(/[0-9\s]/g, '')

/* =============================
   REAL-TIME VALIDATION
============================== */
watch(termsAr, (val) => {
  const text = stripNonAlpha(stripHtml(val))
  if (!text) {
    errorAr.value = ''
    return
  }
  errorAr.value = /[a-zA-Z]/.test(text) ? t('validation.arabic_only') : ''
})

watch(termsEn, (val) => {
  const text = stripNonAlpha(stripHtml(val))
  if (!text) {
    errorEn.value = ''
    return
  }
  errorEn.value = /[ء-ي]/.test(text) ? t('validation.english_only') : ''
})

/* =============================
   VALIDATE BEFORE SAVE
============================== */
const validateAll = () => {
  errorAr.value = ''
  errorEn.value = ''

  const textAr = stripNonAlpha(stripHtml(termsAr.value))
  const textEn = stripNonAlpha(stripHtml(termsEn.value))

  if (!stripHtml(termsAr.value)) {
    errorAr.value = t('errors.isRequired', { name: t('labels.content_ar') })
  } else if (/[a-zA-Z]/.test(textAr)) {
    errorAr.value = t('validation.arabic_only')
  } else {
    errorAr.value = ''
  }

  if (!stripHtml(termsEn.value)) {
    errorEn.value = t('errors.isRequired', { name: t('labels.content_en') })
  } else if (/[ء-ي]/.test(textEn)) {
    errorEn.value = t('validation.english_only')
  } else {
    errorEn.value = ''
  }

  return !errorAr.value && !errorEn.value
}

/* =============================
   FETCH
============================== */
const fetchTerms = async () => {
  try {
    fetching.value = true
    const endpoint = role.value === 'supplier'
      ? `/static-pages/${SLUG}`
      : `/v1/admin/static-pages/${SLUG}`

    const res = await api(endpoint)
    if (res?.data) {
      termsAr.value    = res.data.content?.ar || ''
      termsEn.value    = res.data.content?.en || ''
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
const toolbarOptions = [
  ['bold', 'italic', 'underline'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ header: [1, 2, 3, false] }],
  [{ align: [] }],
  ['clean'],
]

const editorOptions = computed(() => ({
  modules: { toolbar: toolbarOptions },
  placeholder: t('placeholders.search'),
}))

const editorOptionsEn = computed(() => ({
  modules: { toolbar: toolbarOptions },
  placeholder: t('placeholders.search'),
}))

/* =============================
   ACTIONS
============================== */
const handleSave = async () => {
  if (!validateAll()) return

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
  errorAr.value = ''
  errorEn.value = ''
}

/* =============================
   INIT
============================== */
onMounted(() => fetchTerms())
</script>

<style scoped>
.terms-supplier-layout { padding: 0; }
.terms-section-label {
  color: #667085;
  font-size: 14px;
  font-weight: 500;
}
.terms-content-card {
  background: #FFFFFF;
  border: 1px solid #EAECF0;
  border-radius: 8px;
  padding: 24px;
}
.terms-content-display {
  line-height: 2;
  color: #344054;
  font-size: 15px;
}
.terms-content-display :deep(p)            { margin-bottom: 20px; }
.terms-content-display :deep(p):last-child { margin-bottom: 0; }
.terms-content-display :deep(ul),
.terms-content-display :deep(ol)           { padding-inline-start: 30px; margin-bottom: 20px; }
.terms-content-display :deep(li)           { margin-bottom: 12px; }

.editor-wrapper { width: 100%; }

/* ✅ invalid border */
.is-invalid-wrapper :deep(.ql-toolbar)   { border-color: var(--danger-color, #dc3545) !important; }
.is-invalid-wrapper :deep(.ql-container) { border-color: var(--danger-color, #dc3545) !important; }

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
:deep(.ql-editor li:not(.ql-direction-rtl)::before) { margin-left: unset !important; }
:deep(.ql-editor p)                                  { margin-bottom: 12px; }

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
:deep(.ql-toolbar button.ql-active)             { color: var(--primary-color) !important; }
:deep(.ql-toolbar button:hover .ql-stroke),
:deep(.ql-toolbar button.ql-active .ql-stroke)  { stroke: var(--primary-color) !important; }
:deep(.ql-toolbar button:hover .ql-fill),
:deep(.ql-toolbar button.ql-active .ql-fill)    { fill: var(--primary-color) !important; }
</style>