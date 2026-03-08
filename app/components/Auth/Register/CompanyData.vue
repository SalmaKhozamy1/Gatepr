<template>
  <div>
    <div class="grid grid-3 gap-md">
        <InputsFormInput 
          v-model="nameAr" 
          label="اسم المنشأة بالعربي" 
          placeholder="ادخل اسم المنشأة باللغة العربية" 
          :error="errors.nameAr"
        />
        <InputsFormInput 
          v-model="nameEn" 
          label="اسم المنشأة باللغة الإنجليزية" 
          placeholder="ادخل اسم المنشأة باللغة الإنجليزية" 
          :error="errors.nameEn"
        />
        <InputsDatePicker 
          v-model="licenseStart" 
          label="تاريخ بداية الرخصة" 
          placeholder="اختر" 
          :error="errors.licenseStart"
        />
        
        <InputsFormInput 
          v-model="licenseNumber" 
          label="رقم الرخصة / السجل التجاري" 
          placeholder="ادخل رقم الرخصة" 
          :error="errors.licenseNumber"
        />
        <InputsFormInput 
          v-model="supplierDeputy" 
          label="نائب المورد" 
          placeholder="ادخل اسم نائب المورد" 
          :error="errors.supplierDeputy"
        />
        <InputsDatePicker 
          v-model="licenseEnd" 
          label="تاريخ نهاية الرخصة" 
          placeholder="اختر" 
          :error="errors.licenseEnd"
        />

        <InputsFormSelect 
            v-model="supplierType"
            label="نوع المورد" 
            placeholder="اختر نوع المورد" 
            :options="['مورد 1', 'مورد 2']" 
            :error="errors.supplierType"
        />
        <InputsDatePicker 
          v-model="healthLicenseEnd" 
          label="تاريخ انتهاء الرخصة الصحية" 
          placeholder="اختر" 
          :error="errors.healthLicenseEnd"
        />
        <InputsDatePicker 
          v-model="industrialLicenseEnd" 
          label="تاريخ انتهاء الرخصة الصناعية" 
          placeholder="اختر" 
          :error="errors.industrialLicenseEnd"
        />

    <div class="full-width">
          <InputsFormInput 
            v-model="password" 
            label="كلمة المرور" 
            placeholder="ادخل كلمة المرور" 
            type="password" 
            :error="errors.password"
          />
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
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { ref } from 'vue'

const generalIndustryFiles = ref([])
const facilityFiles = ref([])

const schema = yup.object({
  nameAr: yup.string().required('اسم المنشأة بالعربي مطلوب'),
  nameEn: yup.string().required('اسم المنشأة باللغة الإنجليزية مطلوب'),
  licenseStart: yup.string().required('تاريخ بداية الرخصة مطلوب'),
  licenseNumber: yup.string().required('رقم الرخصة مطلوب'),
  supplierDeputy: yup.string().required('نائب المورد مطلوب'),
  licenseEnd: yup.string().required('تاريخ نهاية الرخصة مطلوب'),
  supplierType: yup.string().required('نوع المورد مطلوب'),
  healthLicenseEnd: yup.string().required('تاريخ انتهاء الرخصة الصحية مطلوب'),
  industrialLicenseEnd: yup.string().required('تاريخ انتهاء الرخصة الصناعية مطلوب'),
  password: yup.string().required('كلمة المرور مطلوبة').min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
})

const { errors, validate } = useForm({
  validationSchema: schema,
})

const { value: nameAr } = useField('nameAr')
const { value: nameEn } = useField('nameEn')
const { value: licenseStart } = useField('licenseStart')
const { value: licenseNumber } = useField('licenseNumber')
const { value: supplierDeputy } = useField('supplierDeputy')
const { value: licenseEnd } = useField('licenseEnd')
const { value: supplierType } = useField('supplierType')
const { value: healthLicenseEnd } = useField('healthLicenseEnd')
const { value: industrialLicenseEnd } = useField('industrialLicenseEnd')
const { value: password } = useField('password')

defineExpose({
  validate: async () => {
    const { valid } = await validate()
    return valid
  }
})
</script>

<style scoped>
.fw-600 { font-weight: 600; }
</style>
