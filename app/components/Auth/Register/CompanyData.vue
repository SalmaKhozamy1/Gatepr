<template>
  <div>
    <div class="grid grid-3 gap-md">
      <InputsFormInput
        v-model="nameAr"
        :label="t('labels.company_name_ar')"
        :placeholder="t('placeholders.company_name_ar')"
        :error="errors.nameAr"
        class="required"
      />
      <InputsFormInput
        v-model="nameEn"
        :label="t('labels.company_name_en')"
        :placeholder="t('placeholders.company_name_en')"
        :error="errors.nameEn"
        class="required"
      />
      <InputsDatePicker
        v-model="licenseStart"
        :label="t('labels.license_start')"
        :placeholder="t('placeholders.select')"
        :error="errors.licenseStart"
        class="required"
      />

      <InputsFormInput
        v-model="licenseNumber"
        :label="t('labels.license_number')"
        :placeholder="t('placeholders.license_number')"
        :error="errors.licenseNumber"
        class="required"
      />
      <InputsFormInput
        v-model="supplierDeputy"
        :label="t('labels.supplier_deputy')"
        :placeholder="t('placeholders.supplier_deputy')"
        :error="errors.supplierDeputy"
        class="required"
      />
      <InputsDatePicker
        v-model="licenseEnd"
        :label="t('labels.license_end')"
        :placeholder="t('placeholders.select')"
        :error="errors.licenseEnd"
        class="required"
      />

      <InputsFormSelect
        v-model="supplierType"
        :label="t('labels.event_type')"
        :placeholder="t('placeholders.supplier_type')"
        :options="['Type 1', 'Type 2']"
        :error="errors.supplierType"
        class="required"
      />
      <InputsDatePicker
        v-model="healthLicenseEnd"
        :label="t('labels.health_license_end')"
        :placeholder="t('placeholders.select')"
        :error="errors.healthLicenseEnd"
        class="required"
      />
      <InputsDatePicker
        v-model="industrialLicenseEnd"
        :label="t('labels.industrial_license_end')"
        :placeholder="t('placeholders.select')"
        :error="errors.industrialLicenseEnd"
        class="required"
      />

      <div class="full-width">
        <InputsFormInput
          v-model="password"
          :label="t('labels.password')"
          :placeholder="t('placeholders.password')"
          type="password"
          :error="errors.password"
          class="required"
        />
      </div>

      <!-- Upload Section -->
      <div class="full-width grid grid-2 gap-md">
        <InputsFileUploader
          v-model="generalIndustryFiles"
          :label="t('labels.industry_authority_cert')"
          accept=".pdf,.xml,.doc,.docx"
          accept-label="PDF , XML , Word"
          :error="errors.generalIndustryFiles"
          @update:files="generalIndustryFiles = $event"
          class="required"
        />

        <InputsFileUploader
          v-model="facilityFiles"
          :label="t('labels.industrial_facility_cert')"
          accept=".pdf,.xml,.doc,.docx"
          accept-label="PDF , XML , Word"
          :error="errors.facilityFiles"
          @update:files="facilityFiles = $event"
          class="required"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:valid"]);

const schema = yup.object({
  nameAr: yup
    .string()
    .required(t("errors.isRequired", { name: t("labels.company_name_ar") }))
    .test(
      "no-english",
      t("validation.arabic_only"),
      (value) => !/[a-zA-Z]/.test(value || ""),
    ),
  nameEn: yup
    .string()
    .required(t("errors.isRequired", { name: t("labels.company_name_en") }))
    .test(
      "no-arabic",
      t("validation.english_only"),
      (value) => !/[ء-ي]/.test(value || ""),
    ),
  licenseStart: yup
    .string()
    .required(t("errors.isRequired", { name: t("labels.license_start") })),
  licenseNumber: yup
    .string()
    .required(t("errors.isRequired", { name: t("labels.license_number") })),
  supplierDeputy: yup
    .string()
    .required(t("errors.isRequired", { name: t("labels.supplier_deputy") })),
  licenseEnd: yup
    .string()
    .required(t("errors.isRequired", { name: t("labels.license_end") }))
    .test("is-greater", t("validation.date_invalid_range"), function (value) {
      if (!this.parent.licenseStart || !value) return true;
      return new Date(value) >= new Date(this.parent.licenseStart);
    }),
  supplierType: yup
    .string()
    .required(t("errors.isRequired", { name: t("labels.event_type") })),
  healthLicenseEnd: yup
    .string()
    .required(t("errors.isRequired", { name: t("labels.health_license_end") }))
    .test("is-greater", t("validation.date_invalid_range"), function (value) {
      if (!this.parent.licenseStart || !value) return true;
      return new Date(value) >= new Date(this.parent.licenseStart);
    }),
  industrialLicenseEnd: yup
    .string()
    .required(
      t("errors.isRequired", { name: t("labels.industrial_license_end") }),
    )
    .test("is-greater", t("validation.date_invalid_range"), function (value) {
      if (!this.parent.licenseStart || !value) return true;
      return new Date(value) >= new Date(this.parent.licenseStart);
    }),
  password: yup
    .string()
    .required(t("validation.password_required"))
    .min(6, t("validation.password_min")),
  generalIndustryFiles: yup
    .array()
    .min(
      1,
      t("errors.isRequired", { name: t("labels.industry_authority_cert") }),
    )
    .required(
      t("errors.isRequired", { name: t("labels.industry_authority_cert") }),
    ),
  facilityFiles: yup
    .array()
    .min(
      1,
      t("errors.isRequired", { name: t("labels.industrial_facility_cert") }),
    )
    .required(
      t("errors.isRequired", { name: t("labels.industrial_facility_cert") }),
    ),
});

const { errors, validate, meta, setErrors } = useForm({
  validationSchema: schema,
  initialValues: {
    nameAr: props.initialData?.nameAr || props.initialData?.["name[ar]"] || "",
    nameEn: props.initialData?.nameEn || props.initialData?.["name[en]"] || "",
    licenseStart: props.initialData?.license_start_date || props.initialData?.["license_start_date"] || "",
    licenseNumber: props.initialData?.commercial_register || props.initialData?.["commercial_register"] || "",
    supplierDeputy: props.initialData?.deputy_manager_name || props.initialData?.["deputy_manager_name"] || "",
    licenseEnd: props.initialData?.license_end_date || props.initialData?.["license_end_date"] || "",
    supplierType: props.initialData?.["supplier_type_id"] === 1 ? "Type 1" : "",
    healthLicenseEnd: props.initialData?.health_license_expiry || props.initialData?.["health_license_expiry"] || "",
    industrialLicenseEnd: props.initialData?.industrial_license_expiry || props.initialData?.["industrial_license_expiry"] || "",
    password: props.initialData?.password || props.initialData?.["password"] || "",
    generalIndustryFiles: props.initialData?.general_industry_certificate ? [props.initialData.general_industry_certificate] : [],
    facilityFiles: props.initialData?.industrial_establishment_certificate ? [props.initialData.industrial_establishment_certificate] : [],
  },
});

watch(
  () => meta.value.valid,
  (newVal) => {
    emit("update:valid", newVal);
  },
  { immediate: true },
);

const { value: nameAr } = useField("nameAr");
const { value: nameEn } = useField("nameEn");
const { value: licenseStart } = useField("licenseStart");
const { value: licenseNumber } = useField("licenseNumber");
const { value: supplierDeputy } = useField("supplierDeputy");
const { value: licenseEnd } = useField("licenseEnd");
const { value: supplierType } = useField("supplierType");
const { value: healthLicenseEnd } = useField("healthLicenseEnd");
const { value: industrialLicenseEnd } = useField("industrialLicenseEnd");
const { value: password } = useField("password");
const { value: generalIndustryFiles } = useField("generalIndustryFiles");
const { value: facilityFiles } = useField("facilityFiles");

defineExpose({
  validate: async () => {
    const { valid } = await validate();
    return valid;
  },
  setErrors: (errs) => {
    setErrors(errs);
  },
  getValues: () => {
    return {
      nameAr: nameAr.value,
      nameEn: nameEn.value,
      commercial_register: licenseNumber.value,
      license_start_date: licenseStart.value,
      license_end_date: licenseEnd.value,
      health_license_expiry: healthLicenseEnd.value,
      industrial_license_expiry: industrialLicenseEnd.value,
      deputy_manager_name: supplierDeputy.value,
      password: password.value,
      supplier_type_id: 1, // default or map from supplierType.value
      general_industry_certificate: generalIndustryFiles.value?.[0],
      industrial_establishment_certificate: facilityFiles.value?.[0],
    };
  },
});
</script>

<style scoped>
.fw-600 {
  font-weight: 600;
}
</style>
