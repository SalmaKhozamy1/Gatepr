<template>
  <div class="register-page">
    <PageLayout>
      <!-- Aside / Stepper -->
      <PageLayoutAsideContent v-if="currentStep === 0" >
          <PageLayoutSideNavItem 
            v-for="(step, index) in steps" 
            :key="index"
            :title="step.title"
            :icon="step.icon"
            :active="currentStep === index"
            @on-click="currentStep = index"
          />
      </PageLayoutAsideContent>

      <!-- <PageLayoutAsideContent>

      </PageLayoutAsideContent> -->
      <!-- Main Content -->
      <!-- <PageLayoutMainContent>
        <div class="step-content">
          <div class="flex-between mb-5">
              <h4 class="fw-600">إضافة بيانات المنشأة</h4>
          </div>

          <div class="grid grid-3 gap-md">
              <InputsFormInput label="اسم المنشأة بالعربي" placeholder="ادخل اسم المنشأة باللغة العربية" />
              <InputsFormInput label="اسم المنشأة باللغة الإنجليزية" placeholder="ادخل اسم المنشأة باللغة الإنجليزية" />
              <InputsFormInput label="تاريخ بداية الرخصة" placeholder="اختر" type="date" />
              
              <InputsFormInput label="رقم الرخصة / السجل التجاري" placeholder="ادخل اسم المنشأة باللغة العربية" />
              <InputsFormInput label="اسم المورد" placeholder="ادخل اسم المنشأة باللغة العربية" />
              <InputsFormInput label="تاريخ نهاية الرخصة" placeholder="اختر" type="date" />

              <div class="form-group">
                  <label class="mb-2">نوع المورد</label>
                  <select class="form-select">
                      <option disabled selected>اختر نوع المورد</option>
                  </select>
              </div>
              <InputsFormInput label="تاريخ انتهاء الرخصة الصحية" placeholder="اختر" type="date" />
              <InputsFormInput label="تاريخ انتهاء الرخصة الصناعية" placeholder="اختر" type="date" />
          </div>

          <div class="w-100 mt-4">
               <InputsFormInput label="كلمة المرور" placeholder="ادخل كلمة المرور" type="password" />
          </div>

 
          <div class="grid grid-2 mt-5 gap-lg">
               <div class="uploader-placeholder p-4 border rounded dashed flex-column-center text-center">
                   <p class="mb-1 fw-600">شهادة الهيئة العامة للصناعة</p>
                   <div class="upload-zone py-4">
                       <p class="secondary small">اسحب وأفلت مستنداً أو <span class="text-decoration-underline pointer">تصفح</span></p>
                       <p class="text-muted smaller">PDF, XML, Word</p>
                   </div>
               </div>
               <div class="uploader-placeholder p-4 border rounded dashed flex-column-center text-center">
                   <p class="mb-1 fw-600">شهادة المنشأة الصناعية</p>
                   <div class="upload-zone py-4">
                       <p class="secondary small">اسحب وأفلت مستنداً أو <span class="text-decoration-underline pointer">تصفح</span></p>
                       <p class="text-muted smaller">PDF, XML, Word</p>
                   </div>
               </div>
          </div>

 
          <div class="flex-start gap-md mt-5">
              <button class="custom-btn secondary-btn px-5">التالي</button>
              <button class="custom-btn border-seconadry-btn px-5">إلغاء</button>
          </div>
        </div>
      </PageLayoutMainContent> -->
    </PageLayout>
  </div>
</template>

<script setup>
import { IconsBranches, IconsSuppliers, IconsRegistrationPending } from '#components'

const currentStep = ref(0);
const steps = [
    { title: 'بيانات المنشأة', icon: IconsBranches },
    { title: 'بيانات المسؤول', icon: IconsSuppliers },
    { title: 'المستندات الرسمية', icon: IconsRegistrationPending },
];
</script>

<style scoped>
.dashed { border: 2px dashed #E4E7EC !important; }
.uploader-placeholder { transition: all 0.3s ease; cursor: pointer; }
.uploader-placeholder:hover { border-color: var(--secondary-color) !important; background-color: var(--light-primary-color); }
.fw-600 { font-weight: 600; }
.smaller { font-size: 11px; }

@media (max-width: 767px) { .grid-3 { grid-template-columns: 1fr; } }
</style>
