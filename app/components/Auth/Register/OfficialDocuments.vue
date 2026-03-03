<template>
  <div class="grid grid-3 gap-md">
    <!-- First Form -->
    <h5 class="secondary-title full-width">
      بيان جمركي مختوم للشركات المستهدفة    
    </h5>
    <InputsFormInput label="الإسم باللغة العربية" :type="text" placeholder="ادخل الإسم باللغة العربية"/>
    <InputsFormInput label="الإسم باللغة الإنجليزية" :type="text" placeholder="ادخل الإسم باللغة الإنجليزية"/>
    <InputsFormInput label="رقم الرخصة" :type="number" placeholder="ادخل رقم الرخصة"/>
    <InputsDatePicker label="تاريخ البداية" />
    <InputsDatePicker label="تاريخ النهاية" />
    <InputsDatePicker label="تاريخ انتهاء الرخصة" />

    <div class="full-width">
      <InputsFileUploader
        accept=".pdf,.xml,.doc,.docx"
        accept-label="PDF , XML , Word"
        @update:files="manafaaFiles = $event"
      />
    </div>

    <!-- Second Form -->
    <h5 class="secondary-title full-width">
      رخصة الإستيراد    
    </h5>
    
    <InputsFormInput label="الإسم باللغة العربية" :type="text" placeholder="ادخل الإسم باللغة العربية"/>
    <InputsFormInput label="الإسم باللغة الإنجليزية" :type="text" placeholder="ادخل الإسم باللغة الإنجليزية"/>
    <InputsFormInput label="رقم الرخصة" :type="number" placeholder="ادخل رقم الرخصة"/>
    <InputsDatePicker label="تاريخ البداية" />
    <InputsDatePicker label="تاريخ النهاية" />
    <InputsDatePicker label="تاريخ انتهاء الرخصة" />

    <div class="full-width">
      <InputsFileUploader
        accept=".pdf,.xml,.doc,.docx"
        accept-label="PDF , XML , Word"
        @update:files="generalIndustryFiles = $event"
      />
    </div>

    <!-- Third Form -->
    <h5 class="secondary-title full-width">
      قيد وكالة معتمد    
    </h5>
    
    <InputsFormInput label="الإسم باللغة العربية" :type="text" placeholder="ادخل الإسم باللغة العربية"/>
    <InputsFormInput label="الإسم باللغة الإنجليزية" :type="text" placeholder="ادخل الإسم باللغة الإنجليزية"/>
    <InputsFormInput label="رقم الرخصة" :type="number" placeholder="ادخل رقم الرخصة"/>
    <InputsDatePicker label="تاريخ البداية" />
    <InputsDatePicker label="تاريخ النهاية" />
    <InputsDatePicker label="تاريخ انتهاء الرخصة" />

    <div class="full-width">
      <InputsFileUploader
        accept=".pdf,.xml,.doc,.docx"
        accept-label="PDF , XML , Word"
        @update:files="generalIndustryFiles = $event"
      />
    </div>

    <!-- Third Form -->
    <h5 class="secondary-title full-width">
      قيد وكالة معتمد    
    </h5>
    
    <InputsFormInput label="الإسم باللغة العربية" :type="text" placeholder="ادخل الإسم باللغة العربية"/>
    <InputsFormInput label="الإسم باللغة الإنجليزية" :type="text" placeholder="ادخل الإسم باللغة الإنجليزية"/>
    <InputsFormInput label="رقم الرخصة" :type="number" placeholder="ادخل رقم الرخصة"/>
    <InputsDatePicker label="تاريخ البداية" />
    <InputsDatePicker label="تاريخ النهاية" />
    <InputsDatePicker label="تاريخ انتهاء الرخصة" />

    <div class="full-width">
      <InputsFileUploader
        accept=".pdf,.xml,.doc,.docx"
        accept-label="PDF , XML , Word"
        @update:files="generalIndustryFiles = $event"
      />
    </div>

    <!-- Fourth Form -->
    <h5 class="secondary-title full-width">
      شعار العلامة التجارية   
    </h5>
    
    <InputsFormInput label="الإسم باللغة العربية" :type="text" placeholder="ادخل الإسم باللغة العربية"/>
    <InputsFormInput label="الإسم باللغة الإنجليزية" :type="text" placeholder="ادخل الإسم باللغة الإنجليزية"/>
    <InputsFormInput label="رقم الرخصة" :type="number" placeholder="ادخل رقم الرخصة"/>
    <InputsDatePicker label="تاريخ البداية" />
    <InputsDatePicker label="تاريخ النهاية" />
    <InputsDatePicker label="تاريخ انتهاء الرخصة" />

    <div class="full-width">
      <InputsFileUploader
        accept=".pdf,.xml,.doc,.docx"
        accept-label="PDF , XML , Word"
        @update:files="generalIndustryFiles = $event"
      />
    </div>

    <!-- Five Form -->
    <h5 class="secondary-title full-width">
      شعار إدارة الأغذية المستوردة    
    </h5>
    
    <InputsFormInput label="الإسم باللغة العربية" :type="text" placeholder="ادخل الإسم باللغة العربية"/>
    <InputsFormInput label="الإسم باللغة الإنجليزية" :type="text" placeholder="ادخل الإسم باللغة الإنجليزية"/>
    <InputsFormInput label="رقم الرخصة" :type="number" placeholder="ادخل رقم الرخصة"/>
    <InputsDatePicker label="تاريخ البداية" />
    <InputsDatePicker label="تاريخ النهاية" />
    <InputsDatePicker label="تاريخ انتهاء الرخصة" />

    <div class="full-width">
      <InputsFileUploader
        accept=".pdf,.xml,.doc,.docx"
        accept-label="PDF , XML , Word"
        @update:files="generalIndustryFiles = $event"
      />
    </div>

    <!-- Six Form -->
    <h5 class="secondary-title full-width">
      تعميم اتحاد الجمعيات    
    </h5>
    
    <InputsFormInput label="الإسم باللغة العربية" :type="text" placeholder="ادخل الإسم باللغة العربية"/>
    <InputsFormInput label="الإسم باللغة الإنجليزية" :type="text" placeholder="ادخل الإسم باللغة الإنجليزية"/>
    <InputsFormInput label="رقم الرخصة" :type="number" placeholder="ادخل رقم الرخصة"/>
    <InputsDatePicker label="تاريخ البداية" />
    <InputsDatePicker label="تاريخ النهاية" />
    <InputsDatePicker label="تاريخ انتهاء الرخصة" />

    <div class="full-width">
      <InputsFileUploader
        accept=".pdf,.xml,.doc,.docx"
        accept-label="PDF , XML , Word"
        @update:files="generalIndustryFiles = $event"
      />
    </div>

    <!-- Eighth Form -->
    <h5 class="secondary-title full-width">
      صور اعتماد التوقيع    
    </h5>
    
    <InputsFormInput label="الإسم باللغة العربية" :type="text" placeholder="ادخل الإسم باللغة العربية"/>
    <InputsFormInput label="الإسم باللغة الإنجليزية" :type="text" placeholder="ادخل الإسم باللغة الإنجليزية"/>
    <InputsFormInput label="رقم الرخصة" :type="number" placeholder="ادخل رقم الرخصة"/>
    <InputsDatePicker label="تاريخ البداية" />
    <InputsDatePicker label="تاريخ النهاية" />
    <InputsDatePicker label="تاريخ انتهاء الرخصة" />

    <div class="full-width">
      <InputsFileUploader
        accept=".pdf,.xml,.doc,.docx"
        accept-label="PDF , XML , Word"
        @update:files="generalIndustryFiles = $event"
      />
    </div>

    <!-- Nine Form -->
    <h5 class="secondary-title full-width">
      صور الرخصة التجارية    
    </h5>
    
    <InputsFormInput label="الإسم باللغة العربية" :type="text" placeholder="ادخل الإسم باللغة العربية"/>
    <InputsFormInput label="الإسم باللغة الإنجليزية" :type="text" placeholder="ادخل الإسم باللغة الإنجليزية"/>
    <InputsFormInput label="رقم الرخصة" :type="number" placeholder="ادخل رقم الرخصة"/>
    <InputsDatePicker label="تاريخ البداية" />
    <InputsDatePicker label="تاريخ النهاية" />
    <InputsDatePicker label="تاريخ انتهاء الرخصة" />

    <div class="full-width">
      <InputsFileUploader
        accept=".pdf,.xml,.doc,.docx"
        accept-label="PDF , XML , Word"
        @update:files="generalIndustryFiles = $event"
      />
    </div>

    <!-- Tenth Form -->
    <h5 class="secondary-title full-width">
      شهادة غرفة التجارة    
    </h5>
    
    <InputsFormInput label="الإسم باللغة العربية" :type="text" placeholder="ادخل الإسم باللغة العربية"/>
    <InputsFormInput label="الإسم باللغة الإنجليزية" :type="text" placeholder="ادخل الإسم باللغة الإنجليزية"/>
    <InputsFormInput label="رقم الرخصة" :type="number" placeholder="ادخل رقم الرخصة"/>
    <InputsDatePicker label="تاريخ البداية" />
    <InputsDatePicker label="تاريخ النهاية" />
    <InputsDatePicker label="تاريخ انتهاء الرخصة" />

    <div class="full-width">
      <InputsFileUploader
        accept=".pdf,.xml,.doc,.docx"
        accept-label="PDF , XML , Word"
        @update:files="generalIndustryFiles = $event"
      />
    </div>

    <!-- Elevene Form -->
    <h5 class="secondary-title full-width">
      صور شهادة المعاينة الصحية لتعبئة البهارات    
    </h5>
    
    <InputsFormInput label="الإسم باللغة العربية" :type="text" placeholder="ادخل الإسم باللغة العربية"/>
    <InputsFormInput label="الإسم باللغة الإنجليزية" :type="text" placeholder="ادخل الإسم باللغة الإنجليزية"/>
    <InputsFormInput label="رقم الرخصة" :type="number" placeholder="ادخل رقم الرخصة"/>
    <InputsDatePicker label="تاريخ البداية" />
    <InputsDatePicker label="تاريخ النهاية" />
    <InputsDatePicker label="تاريخ انتهاء الرخصة" />

    <div class="full-width">
      <InputsFileUploader
        accept=".pdf,.xml,.doc,.docx"
        accept-label="PDF , XML , Word"
        @update:files="generalIndustryFiles = $event"
      />
    </div>

    <!-- Twelve Form -->
    <h5 class="secondary-title full-width">
      شهادة الهيئة العامة للصناعة    
    </h5>
    
    <InputsFormInput label="الإسم باللغة العربية" :type="text" placeholder="ادخل الإسم باللغة العربية"/>
    <InputsFormInput label="الإسم باللغة الإنجليزية" :type="text" placeholder="ادخل الإسم باللغة الإنجليزية"/>
    <InputsFormInput label="رقم الرخصة" :type="number" placeholder="ادخل رقم الرخصة"/>
    <InputsDatePicker label="تاريخ البداية" />
    <InputsDatePicker label="تاريخ النهاية" />
    <InputsDatePicker label="تاريخ انتهاء الرخصة" />

    <div class="full-width">
      <InputsFileUploader
        accept=".pdf,.xml,.doc,.docx"
        accept-label="PDF , XML , Word"
        @update:files="generalIndustryFiles = $event"
      />
    </div>

    <!-- Thirteen Form -->
    <h5 class="secondary-title full-width">
      شهادة المنشأة الصناعية    
    </h5>
    
    <InputsFormInput label="الإسم باللغة العربية" :type="text" placeholder="ادخل الإسم باللغة العربية"/>
    <InputsFormInput label="الإسم باللغة الإنجليزية" :type="text" placeholder="ادخل الإسم باللغة الإنجليزية"/>
    <InputsFormInput label="رقم الرخصة" :type="number" placeholder="ادخل رقم الرخصة"/>
    <InputsDatePicker label="تاريخ البداية" />
    <InputsDatePicker label="تاريخ النهاية" />
    <InputsDatePicker label="تاريخ انتهاء الرخصة" />

    <div class="full-width">
      <InputsFileUploader
        accept=".pdf,.xml,.doc,.docx"
        accept-label="PDF , XML , Word"
        @update:files="generalIndustryFiles = $event"
      />
    </div>

    <InputsApprove :label="'أوافق علي الشروط والأحكام'" >
    </InputsApprove>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const manafaaFiles = ref([])
const generalIndustryFiles = ref([])
</script>

<style scoped>
.secondary-title {
  font-size: 16px;
  padding: 10px;
  background-color: var(--light-gray);
  border-radius: var(--radius-sm);
}
</style>
