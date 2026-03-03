<template>
  <div class="grid grid-2 mt-5 gap-md">

    <InputsFileUploader
      label="شهادة المنشأة الصناعية"
      accept=".pdf,.xml,.doc,.docx"
      accept-label="PDF , XML , Word"
      @update:files="manafaaFiles = $event"
    />

    <InputsFileUploader
      label="شهادة الهيئة العامة للصناعة"
      accept=".pdf,.xml,.doc,.docx"
      accept-label="PDF , XML , Word"
      @update:files="generalIndustryFiles = $event"
    />

  </div>
</template>

<script setup>
import { ref } from 'vue'

const manafaaFiles = ref([])
const generalIndustryFiles = ref([])
</script>
