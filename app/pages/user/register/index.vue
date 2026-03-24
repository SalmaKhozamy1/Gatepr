<template>
  <div class="register-page">
    <PageLayout
    :formTitle="t('common.add') + ' ' + activeStepTitle"
    :asideItems="steps"
    :activeIndex="activeIndex"
    @item-click="changeStep">
      
      <template #main>
        <!-- Main Content -->
        <div class="step-content">

          <!-- Dynamic Step Rendering -->
          <component :is="stepsMenuItems[activeIndex].component" ref="stepComponent" />
 
          <div class="flex-end mt-4 gap-sm">
              <button class="custom-btn text-btn min-btn-width" @click="prevStep" v-if="activeIndex > 0">{{ t('buttons.previous') }}</button>
              <button class="custom-btn text-btn min-btn-width" v-else>{{ t('common.cancel') }}</button>
              
              <button class="custom-btn secondary-btn min-btn-width" @click="nextStep" v-if="activeIndex < steps.length - 1">{{ t('buttons.next') }}</button>
              <button class="custom-btn secondary-btn min-btn-width" @click="submit" v-else>{{ t('buttons.send') }}</button>
          </div>
        </div>
      </template>
    </PageLayout>
  </div>
</template>

<script setup>
import { IconsCompanyInformation, IconsOfficialDocuments, IconsResponsibleData } from '#components';
import { AuthRegisterCompanyData, AuthRegisterResponsibleData, AuthRegisterOfficialDocuments } from '#components';
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const activeIndex = ref(0)
const stepComponent = ref(null)

const stepsMenuItems = [
    { title: 'company_data', icon: IconsCompanyInformation, component: AuthRegisterCompanyData },
    { title: 'responsible_data', icon: IconsResponsibleData, component: AuthRegisterResponsibleData },
    { title: 'official_documents', icon: IconsOfficialDocuments, component: AuthRegisterOfficialDocuments },
];

const steps = computed(() => stepsMenuItems.map(step => ({
  ...step,
  title: t('auth.registration_steps.' + step.title)
})))

const activeStepTitle = computed(() => steps.value[activeIndex.value]?.title || '')

const changeStep = (index) => {
  activeIndex.value = index
}

const nextStep = async () => {
    if (stepComponent.value && typeof stepComponent.value.validate === 'function') {
        const isValid = await stepComponent.value.validate()
        if (!isValid) return
    }
    if (activeIndex.value < steps.value.length - 1) {
        activeIndex.value++
    }
}

const prevStep = () => {
    if (activeIndex.value > 0) {
        activeIndex.value--
    }
}

const submit = async () => {
    if (stepComponent.value && typeof stepComponent.value.validate === 'function') {
        const isValid = await stepComponent.value.validate()
        if (!isValid) return
    }
    console.log('Form submitted!')
}
</script>

