<template>
  <div>
    <div class="grid grid-3 gap-md">
        <InputsFormInput label="اسم المنشأة بالعربي" placeholder="ادخل اسم المنشأة باللغة العربية" />
        <InputsFormInput label="اسم المنشأة باللغة الإنجليزية" placeholder="ادخل اسم المنشأة باللغة الإنجليزية" />
        <InputsDatePicker label="تاريخ بداية الرخصة" placeholder="اختر" />
        
        <InputsFormInput label="رقم الرخصة / السجل التجاري" placeholder="ادخل اسم المنشأة باللغة العربية" />
        <InputsFormInput label="نائب المورد" placeholder="ادخل اسم المنشأة باللغة الإنجليزية" />
        <InputsDatePicker label="تاريخ نهاية الرخصة" placeholder="اختر" />

        <InputsFormSelect 
            label="نوع المورد" 
            placeholder="اختر نوع المورد" 
            :options="[]" 
        />
        <InputsDatePicker label="تاريخ انتهاء الرخصة الصحية" placeholder="اختر" />
        <InputsDatePicker label="تاريخ انتهاء الرخصة الصناعية" placeholder="اختر" />

    <div class="full-width">
          <InputsFormInput label="كلمة المرور" placeholder="ادخل كلمة المرور" type="password" />
    </div>

    <!-- Upload Section -->
    <div class="full-width grid grid-2 gap-md">
        <InputsFileUploader
          label="شهادة الهيئة العامة للصناعة"
          accept=".pdf,.xml,.doc,.docx"
          accept-label="PDF , XML , Word"
          @update:files="generalIndustryFiles = $event"
        />

        <InputsFileUploader
          label="شهادة المنشأة الصناعية"
          accept=".pdf,.xml,.doc,.docx"
          accept-label="PDF , XML , Word"
          @update:files="facilityFiles = $event"
        />
    </div>

  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const generalIndustryFiles = ref([])
const facilityFiles = ref([])
</script>

<style scoped>
.fw-600 { font-weight: 600; }
</style>
