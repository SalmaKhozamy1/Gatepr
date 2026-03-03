<template>
  <div class="grid grid-3 gap-md">
      <InputsFormInput label="تليفون المورد" placeholder="ادخل تليفون المورد" />
      <InputsFormInput label="موبايل المورد" placeholder="ادخل موبايل المورد" />
      <InputsFormInput label="الفاكس" placeholder="ادخل الفاكس" />
      
      <InputsFormInput label="البريد الإلكتروني" placeholder="ادخل البريد الإلكتروني" />
      <InputsFormInput label="العنوان تفصيلي" placeholder="ادخل العنوان التفصيلي" />
      <InputsFormInput label="الموقع الإلكتروني" placeholder="ادخل URL الموقع" />
  </div>
</template>

<style scoped>
@media (max-width: 767px) { .grid-3 { grid-template-columns: 1fr; } }
</style>
