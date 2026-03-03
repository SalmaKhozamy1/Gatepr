<template>
  <div class="register-page">
    <PageLayout
    :formTitle="'أضافه ' + steps[activeIndex].title"
    :asideItems="steps"
    :activeIndex="activeIndex"
    @item-click="changeStep">
      
      <template #main>
        <!-- Main Content -->
        <div class="step-content">

          <!-- Dynamic Step Rendering -->
          <component :is="steps[activeIndex].component" />
 
          <div class="flex-end mt-4 gap-sm">
              <button class="custom-btn text-btn min-btn-width" @click="prevStep" v-if="activeIndex > 0">السابق</button>
              <button class="custom-btn text-btn min-btn-width" v-else>إلغاء</button>
              
              <button class="custom-btn secondary-btn min-btn-width" @click="nextStep" v-if="activeIndex < steps.length - 1">التالي</button>
              <button class="custom-btn secondary-btn min-btn-width" @click="submit" v-else>إرسال</button>
          </div>
        </div>
      </template>
    </PageLayout>
  </div>
</template>

<script setup>
import { IconsCompanyInformation, IconsOfficialDocuments, IconsResponsibleData } from '#components';
import { AuthRegisterCompanyData, AuthRegisterResponsibleData, AuthRegisterOfficialDocuments } from '#components';
import { ref } from 'vue'

const activeIndex = ref(0)

const steps = [
    { title: 'بيانات المنشأة', icon: IconsCompanyInformation, component: AuthRegisterCompanyData },
    { title: 'بيانات المسؤول', icon: IconsResponsibleData, component: AuthRegisterResponsibleData },
    { title: 'المستندات الرسمية', icon: IconsOfficialDocuments, component: AuthRegisterOfficialDocuments },
];

const changeStep = (index) => {
  activeIndex.value = index
}

const nextStep = () => {
    if (activeIndex.value < steps.length - 1) {
        activeIndex.value++
    }
}

const prevStep = () => {
    if (activeIndex.value > 0) {
        activeIndex.value--
    }
}

const submit = () => {
    console.log('Form submitted!')
}
</script>

