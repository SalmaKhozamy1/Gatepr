<template>
  <div class="flex-column gap-sm">

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
        {{ t('buttons.cancel') }}
      </button>
      <button
        class="custom-btn secondary-btn min-btn-width"
        @click="handleSave"
        :disabled="saving"
      >
        <span v-if="saving">{{ t('buttons.saving') }}</span>
        <span v-else>{{ t('buttons.save') }}</span>
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

/* =============================
   STATE
============================== */
const termsAr = ref(`<p>كما ذكرنا سابقًا فإن الشروط والأحكام تعد قانونًا منظما للعلاقات بين الأطراف المتعاقدة، وخرق هذه الشروط أو عدم الالتزام بها بالشكل المنصوص يعد خرقًا لمبدأ الاتفاق من الأساس ويلغيه. في بعض العقود يعاقب الطرف الغير ملزم بجانبه من الاتفاق بدفع مقابل مادي، أو منح الطرف الآخر بعض الامتيازات. فالشروط والأحكام تلزم الطرفيين على الوفاء بجانبهم من الاتفاق، وتعاقب الخارق له على الفور. لكن ليس هنا تنحصر أهميتها، فهي لها العديد من المميزات الأخرى التي سنذكرها كالآتي:</p>
<ol>
  <li>تنظيم العمل: تساعدك الشروط والأحكام على تنظيم جانبك من الحقوق والواجبات، وجانب المستخدم أيضًا لمنصتك. فعن طريقها يمكنك أن تحدد بشكل قاطع حدود ما يسمح للمستخدم الاستفادة منه، وحدود انتفاعك أنت أيضًا بالمعلومات التي يشاركها معك.</li>
  <li>منع الانتهاكات: تساعد الشروط والأحكام على وضع حل رادع للانتهاكات الإلكترونية، سواء كانت:
    <ul>
      <li>نشر محتوى غير قانوني يستهدف الترويج لممارسات غير مشروعة ينطوي عليها مسؤولية مدنية</li>
      <li>نشر الأخبار والأكاذيب التي تتعلق بتشوية الصورة العامة لأحد الأشخاص</li>
      <li>نشر محتوى يستهدف ابتزاز أحد الأفراد أو يضم مواد إباحية فاضحة</li>
      <li>انتحال المستخدم لهوية أحد الأفراد</li>
      <li>استخدام الموقع لتحميل برامج ضارة أو نشر فيروسات أو أي شيفرات حاسوبية مؤذية</li>
      <li>استخدام الموقع في الترويج لمنافس أو نشر محتوى لا علاقة له بالخدمات المقدمة</li>
      <li>تمثيل أحد المؤسسات أو الهيئات بدون أن يكون المستخدم مخولًا بادعاء هذا التمثيل</li>
      <li>نشر مواد تضر بالملكية الفكرية لأصحابها وتدخل في إطار سرقتها</li>
      <li>السيطرة على الموقع والتغير من تصميمه أو التعديل فيه</li>
      <li>التعدي على حقوق المستخدمين الأخريين وسرقة حساباتهم الشخصية</li>
    </ul>
    <p>كل هذه انتهاكات يتم نشرها بوضوح في القسم الخاص بالشروط والأحكام، ويتم إضافة لها بعض المحاذير الأخرى بناءً على طبيعة الخدمة المقدمة.</p>
  </li>
  <li>حقوق الملكية: تساعدك الشروط والأحكام الموضوعة في منصتك الإلكترونية على توثيق حقك الفكري والقانوني في كل ما يتعلق بهذه المنصة، فلا يجوز للمستخدم سرقتها أو سوء استغلالها، أو يعمد إلى نسبها إليه.</li>
</ol>`)

const termsEn = ref(`<p>As previously mentioned, terms and conditions constitute a legal framework governing the relationship between contracting parties. Breaching or failing to adhere to these terms as stipulated constitutes a breach of the agreement itself and renders it void. In some contracts, the party not fulfilling their obligations is penalized by paying a financial penalty or granting the other party certain privileges.</p>`)

const originalAr = ref(termsAr.value)
const originalEn = ref(termsEn.value)
const saving = ref(false)

/* =============================
   EDITOR OPTIONS
============================== */
const editorOptions = computed(() => ({
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, false] }],
      [{ 'align': [] }],
      ['clean']
    ]
  },
  placeholder: t('placeholders.search'),
}))

const editorOptionsEn = computed(() => ({
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, false] }],
      [{ 'align': [] }],
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
    await new Promise(resolve => setTimeout(resolve, 1000))
    originalAr.value = termsAr.value
    originalEn.value = termsEn.value
    console.log('saved:', { ar: termsAr.value, en: termsEn.value })
  } catch (err) {
    console.error('Error saving terms:', err)
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  termsAr.value = originalAr.value
  termsEn.value = originalEn.value
}
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