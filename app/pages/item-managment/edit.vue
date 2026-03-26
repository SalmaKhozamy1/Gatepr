<template>
  <PageLayout :hasAside="false" :hasSearch="false" :formTitle="t('items.edit_form.title')">
    <template #main>
      <form @submit.prevent="onSubmit" class="grid grid-3 gap-sm">
        <!-- Row 1: Item Details -->
        <div class="full-width">
          <div class="section-label flex-start gap-xs">
            <IconsInformation /> {{ t('items.add_form.item_details') }}
          </div>
        </div>
        <div>
          <InputsFormInput
            v-model="code"
            :label="t('items.add_form.labels.item_number')"
            :placeholder="t('items.add_form.placeholders.item_number')"
            class="required"
            :error="errors.code"
          />
        </div>
        <div>
          <InputsFormInput
            v-model="nameAr"
            :label="t('items.add_form.labels.name_ar')"
            :placeholder="t('items.add_form.placeholders.name_ar')"
            class="required"
            :error="errors['name.ar']"
          />
        </div>
        <div>
          <InputsFormInput
            v-model="nameEn"
            :label="t('items.add_form.labels.name_en')"
            :placeholder="t('items.add_form.placeholders.name_en')"
            class="required"
            :error="errors['name.en']"
          />
        </div>

        <!-- Row 2: Supplier & Financial Info -->
        <div>
          <div class="section-label flex-start gap-xs">
            <IconsResponsibleData /> {{ t('items.add_form.supplier_info') }}
          </div>
          <InputsFormInput
            v-model="supplierCode"
            :label="t('items.add_form.labels.supplier_code')"
            :placeholder="t('items.add_form.placeholders.supplier_code')"
            class="required"
            :error="errors.supplier_code"
          />
        </div>
        <div class="col-span-2">
          <div class="section-label flex-start gap-xs">
            <IconsInformation /> {{ t('items.add_form.financial_info') }}
          </div>
          <div class="grid grid-2 gap-sm">
            <div>
              <InputsFormInput
                v-model="profitMargin"
                :label="t('items.add_form.labels.profit_margin')"
                :placeholder="t('items.add_form.placeholders.profit_margin')"
                class="required"
                type="number"
                :error="errors.profit_margin"
              />
            </div>
            <div>
              <InputsFormInput
                v-model="supplierPrice"
                :label="t('items.add_form.labels.supplier_price')"
                :placeholder="t('items.add_form.placeholders.supplier_price')"
                class="required"
                type="number"
                :error="errors.supplier_price"
              />
            </div>
          </div>
        </div>

        <!-- Row 3: Categories & Physical Specs -->
        <div>
          <div class="section-label flex-start gap-xs">
            <IconsCategories /> {{ t('items.add_form.categories') }}
          </div>
          <InputsFormSelect
            v-model="categoryId"
            :label="t('items.add_form.labels.sub_category')"
            :options="categoryOptions"
            :placeholder="t('items.add_form.placeholders.choose_category')"
            class="required"
            :error="errors.category_id"
          />
        </div>
        <div class="col-span-2">
          <div class="section-label flex-start gap-xs">
            <IconsInformation /> {{ t('items.add_form.physical_specs') }}
          </div>
          <div class="grid grid-2 gap-sm">
            <div>
              <InputsFormInput
                v-model="weight"
                :label="t('items.add_form.labels.weight')"
                :placeholder="t('items.add_form.placeholders.weight')"
                class="required"
                :error="errors.weight"
              />
            </div>
            <div>
              <InputsFormInput
                v-model="sizeVolume"
                :label="t('items.add_form.labels.volume')"
                :placeholder="t('items.add_form.placeholders.volume')"
                class="required"
                :error="errors.size_volume"
              />
            </div>
          </div>
        </div>

        <!-- Row 4: Measurement Units & Discounts -->
        <div>
          <div class="section-label flex-start gap-xs">
            <IconsMeasurement /> {{ t('items.add_form.measuring_units') }}
          </div>
          <InputsFormSelect
            v-model="purchasingUnitId"
            :label="t('items.add_form.labels.purchasing_unit')"
            :options="unitOptions"
            :placeholder="t('items.add_form.placeholders.choose_unit')"
            class="required"
            :error="errors.purchasing_unit_id"
          />
        </div>
        <div class="col-span-2">
          <div class="section-label flex-start gap-xs">
            <IconsDiscount /> {{ t('items.add_form.discounts') }}
          </div>
          <div class="grid grid-2 gap-sm">
            <div>
              <InputsFormInput
                v-model="associationDiscount"
                :label="t('items.add_form.labels.association_discount')"
                :placeholder="t('items.add_form.placeholders.discount')"
                class="required"
                type="number"
                :icon="'%'"
                :error="errors.association_discount"
              />
            </div>
            <div>
              <InputsFormInput
                v-model="consumerDiscount"
                :label="t('items.add_form.labels.consumer_discount')"
                :placeholder="t('items.add_form.placeholders.discount')"
                class="required"
                type="number"
                :icon="'%'"
                :error="errors.consumer_discount"
              />
            </div>
          </div>
        </div>

        <!-- Row 5: Packaging Info -->
        <div class="full-width">
          <div class="section-label flex-start gap-xs">
            <IconsInfo /> {{ t('items.add_form.packaging_info') }}
          </div>
        </div>
        <div>
          <InputsFormInput
            v-model="supplyIntensity"
            :label="t('items.add_form.labels.supply_intensity')"
            :placeholder="t('items.add_form.placeholders.supply_intensity')"
            class="required"
            type="number"
            :error="errors.supply_intensity"
          />
        </div>
        <div>
          <InputsFormInput
            v-model="packetIntensity"
            :label="t('items.add_form.labels.packet_intensity')"
            :placeholder="t('items.add_form.placeholders.packet_intensity')"
            class="required"
            type="number"
            :error="errors.packet_intensity"
          />
        </div>
        <div>
          <InputsFormInput
            v-model="cartonIntensity"
            :label="t('items.add_form.labels.carton_intensity')"
            :placeholder="t('items.add_form.placeholders.carton_intensity')"
            class="required"
            type="number"
            :error="errors.carton_intensity"
          />
        </div>

        <!-- Row 6: Prices -->
        <div class="full-width">
          <div class="section-label flex-start gap-xs">
            <IconsPrice /> {{ t('items.add_form.prices') }}
          </div>
        </div>
        <div>
          <InputsFormInput
            v-model="unitPrice"
            :label="t('items.add_form.labels.unit_price')"
            :placeholder="t('items.add_form.placeholders.price')"
            class="required"
            type="number"
            :error="errors.unit_price"
          />
        </div>
        <div>
          <InputsFormInput
            v-model="packetPrice"
            :label="t('items.add_form.labels.packet_price')"
            :placeholder="t('items.add_form.placeholders.price')"
            class="required"
            type="number"
            :error="errors.packet_price"
          />
        </div>
        <div>
          <InputsFormInput
            v-model="cartonPrice"
            :label="t('items.add_form.labels.carton_price')"
            :placeholder="t('items.add_form.placeholders.price')"
            class="required"
            type="number"
            :error="errors.carton_price"
          />
        </div>

        <!-- Row 7: Barcodes -->
        <div class="full-width">
          <div class="section-label flex-start gap-xs">
            <IconsBarCode /> {{ t('items.add_form.barcodes') }}
          </div>
        </div>
        <div>
          <InputsFormInput
            v-model="unitBarcode"
            :label="t('items.add_form.labels.unit_barcode')"
            :placeholder="t('items.add_form.placeholders.barcode')"
            class="required"
            type="number"
            :error="errors.unit_barcode"
          />
        </div>
        <div>
          <InputsFormInput
            v-model="packetBarcode"
            :label="t('items.add_form.labels.packet_barcode')"
            :placeholder="t('items.add_form.placeholders.barcode')"
            class="required"
            type="number"
            :error="errors.packet_barcode"
          />
        </div>
        <div>
          <InputsFormInput
            v-model="cartonBarcode"
            :label="t('items.add_form.labels.carton_barcode')"
            :placeholder="t('items.add_form.placeholders.barcode')"
            class="required"
            type="number"
            :error="errors.carton_barcode"
          />
        </div>

        <!-- Row 8: Branch & Delivery Info -->
        <div>
          <div class="section-label flex-start gap-xs">
            <IconsBranches /> {{ t('items.add_form.branch_info') }}
          </div>
          <InputsFormSelect
            v-model="branchId"
            :label="t('items.add_form.labels.branch')"
            :options="branchOptions"
            :placeholder="t('items.add_form.placeholders.choose_branch')"
            class="required"
            :error="errors.branch_id"
          />
        </div>
        <div>
          <div class="section-label flex-start gap-xs">
            <IconsDelivery /> {{ t('items.add_form.delivery_info') }}
          </div>
          <InputsFormSelect
            v-model="receiptTypeId"
            :label="t('items.add_form.labels.receipt_type')"
            :options="receiptTypeOptions"
            :placeholder="t('items.add_form.placeholders.choose_type')"
            class="required"
            :error="errors.receipt_type_id"
          />
        </div>

        <!-- Footer Buttons -->
        <div class="full-width">
          <ButtonsFormActions
            btnSaveClass="primary"
            :loading="loading"
            @cancel="handleCancel"
            @save="onSubmit"
          />
        </div>
      </form>
    </template>
  </PageLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

definePageMeta({ middleware: 'auth' })
usePageMeta('menu.item-managment')

const localePath = useLocalePath()
const { t, locale } = useI18n()
const api = useApi()
const route = useRoute()

// Item ID from route params
const itemId = route.params.id

/* =============================
   VALIDATION SCHEMA
============================== */
const schema = yup.object({
  code: yup.string().required('الكود مطلوب').length(9, 'الكود لازم يكون 9 أرقام'),
  name: yup.object({
    ar: yup.string().required('الاسم باللغة العربية مطلوب').min(2).max(255).matches(/^[\u0600-\u06FF\s]+$/, 'لازم يكون عربي فقط'),
    en: yup.string().required('الاسم باللغة الانجليزية مطلوب').min(2).max(255).matches(/^[A-Za-z\s]+$/, 'لازم يكون إنجليزي فقط'),
  }),
  profit_margin: yup.number().typeError('يجب أن يكون رقم').required('هامش الربح مطلوب').min(0).max(100),
  supplier_price: yup.number().typeError('يجب أن يكون رقم').required('سعر المورد مطلوب').min(0),
  category_id: yup.number().typeError('يجب أن يكون رقم').required('التصنيف مطلوب').nullable(),
  weight: yup.string().required('الوزن مطلوب').max(50),
  size_volume: yup.string().required('الحجم مطلوب').max(50),
  purchasing_unit_id: yup.number().typeError('يجب أن يكون رقم').required('وحدة الشراء مطلوبة').nullable(),
  association_discount: yup.number().typeError('يجب أن يكون رقم').required('خصم الجمعية مطلوب').min(0),
  consumer_discount: yup.number().typeError('يجب أن يكون رقم').required('خصم المستهلك مطلوب').min(0),
  supply_intensity: yup.number().typeError('يجب أن يكون رقم').required('كثافة التوريد مطلوبة').min(0).integer(),
  packet_intensity: yup.number().typeError('يجب أن يكون رقم').required('كثافة الطرد مطلوبة').min(0).integer(),
  carton_intensity: yup.number().typeError('يجب أن يكون رقم').required('كثافة الكرتون مطلوبة').min(0).integer(),
  unit_price: yup.number().typeError('يجب أن يكون رقم').required('سعر الوحدة مطلوب').min(0),
  packet_price: yup.number().typeError('يجب أن يكون رقم').required('سعر الطرد مطلوب').min(0),
  carton_price: yup.number().typeError('يجب أن يكون رقم').required('سعر الكرتون مطلوب').min(0),
  unit_barcode: yup.number().typeError('يجب أن يكون رقم').required('باركود الوحدة مطلوب').min(0),
  packet_barcode: yup.number().typeError('يجب أن يكون رقم').required('باركود الطرد مطلوب').min(0),
  carton_barcode: yup.number().typeError('يجب أن يكون رقم').required('باركود الكرتون مطلوب').min(0),
  branch_id: yup.number().typeError('يجب أن يكون رقم').required('الفرع مطلوب').nullable(),
  receipt_type_id: yup.number().typeError('يجب أن يكون رقم').required('نوع الاستلام مطلوب').nullable(),
})

/* =============================
   useForm
============================== */
const { handleSubmit, errors, setErrors, setValues } = useForm({
  validationSchema: schema,
})

/* =============================
   useField لكل field
============================== */
const { value: code } = useField('code')
const { value: nameAr } = useField('name.ar')
const { value: nameEn } = useField('name.en')
const { value: supplierCode } = useField('supplier_code')
const { value: profitMargin } = useField('profit_margin')
const { value: supplierPrice } = useField('supplier_price')
const { value: categoryId } = useField('category_id')
const { value: weight } = useField('weight')
const { value: sizeVolume } = useField('size_volume')
const { value: purchasingUnitId } = useField('purchasing_unit_id')
const { value: associationDiscount } = useField('association_discount')
const { value: consumerDiscount } = useField('consumer_discount')
const { value: supplyIntensity } = useField('supply_intensity')
const { value: packetIntensity } = useField('packet_intensity')
const { value: cartonIntensity } = useField('carton_intensity')
const { value: unitPrice } = useField('unit_price')
const { value: packetPrice } = useField('packet_price')
const { value: cartonPrice } = useField('carton_price')
const { value: unitBarcode } = useField('unit_barcode')
const { value: packetBarcode } = useField('packet_barcode')
const { value: cartonBarcode } = useField('carton_barcode')
const { value: branchId } = useField('branch_id')
const { value: receiptTypeId } = useField('receipt_type_id')

/* =============================
   OPTIONS STATE
============================== */
const loading = ref(false)
const categoryOptions = ref([])
const unitOptions = ref([])
const branchOptions = ref([])
const receiptTypeOptions = ref([])

/* =============================
   FETCH ITEM DATA
============================== */
const fetchItemData = async () => {
  try {
    const res = await api(`/items/${itemId}`)
    const item = res.data

    setValues({
      code: item.code,
      name: {
        ar: item.name?.ar || '',
        en: item.name?.en || '',
      },
      supplier_code: item.supplier_code || '',
      profit_margin: Number(item.profit_margin),
      supplier_price: Number(item.supplier_price),
      category_id: item.category_id || null,
      weight: item.weight,
      size_volume: item.size_volume,
      purchasing_unit_id: item.purchasing_unit_id || null,
      association_discount: Number(item.association_discount),
      consumer_discount: Number(item.consumer_discount),
      supply_intensity: Number(item.supply_intensity),
      packet_intensity: Number(item.packet_intensity),
      carton_intensity: Number(item.carton_intensity),
      unit_price: Number(item.unit_price),
      packet_price: Number(item.packet_price),
      carton_price: Number(item.carton_price),
      unit_barcode: Number(item.unit_barcode),
      packet_barcode: Number(item.packet_barcode),
      carton_barcode: Number(item.carton_barcode),
      branch_id: item.branch_id || null,
      receipt_type_id: item.receipt_type_id || null,
    })
  } catch (err) {
    console.error('Error fetching item data:', err)
  }
}

/* =============================
   FETCH OPTIONS
============================== */
const fetchCategories = async () => {
  try {
    const res = await api('/categories?per_page=100')
    categoryOptions.value = (res.data || []).map(item => ({
      label: item.name?.[locale.value] || item.name?.ar || item.LocalizeName,
      value: item.id
    }))
  } catch (err) {
    console.error('Error fetching categories:', err)
  }
}

const fetchUnits = async () => {
  try {
    const res = await api('/purchasing-units?per_page=100')
    unitOptions.value = (res.data || []).map(item => ({
      label: item.name?.[locale.value] || item.name?.ar || item.LocalizedName,
      value: item.id
    }))
  } catch (err) {
    console.error('Error fetching units:', err)
  }
}

const fetchBranches = async () => {
  try {
    const res = await api('/branches?per_page=100')
    branchOptions.value = (res.data || []).map(item => ({
      label: item.name?.[locale.value] || item.name?.ar || item.LocalizeName,
      value: item.id
    }))
  } catch (err) {
    console.error('Error fetching branches:', err)
  }
}

const fetchReceiptTypes = async () => {
  try {
    const res = await api('/receipt-types?per_page=100')
    receiptTypeOptions.value = (res.data || []).map(item => ({
      label: item.name?.[locale.value] || item.name?.ar || item.LocalizedName,
      value: item.id
    }))
  } catch (err) {
    console.error('Error fetching receipt types:', err)
  }
}

/* =============================
   SUBMIT
============================== */
const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true

    const payload = {
      code: values.code,
      name: { ar: values.name.ar, en: values.name.en },
      profit_margin: Number(values.profit_margin),
      supplier_price: Number(values.supplier_price),
      category_id: values.category_id,
      purchasing_unit_id: values.purchasing_unit_id,
      weight: values.weight,
      size_volume: values.size_volume,
      association_discount: Number(values.association_discount),
      consumer_discount: Number(values.consumer_discount),
      supply_intensity: Number(values.supply_intensity),
      packet_intensity: Number(values.packet_intensity),
      carton_intensity: Number(values.carton_intensity),
      unit_price: Number(values.unit_price),
      packet_price: Number(values.packet_price),
      carton_price: Number(values.carton_price),
      unit_barcode: Number(values.unit_barcode),
      packet_barcode: Number(values.packet_barcode),
      carton_barcode: Number(values.carton_barcode),
      branch_id: values.branch_id,
      receipt_type_id: values.receipt_type_id,
    }

    await api(`/items/${itemId}`, { method: 'PUT', body: payload })
    navigateTo(localePath('/item-managment'))
  } catch (err) {
    if (err?.data?.errors) {
      setErrors(err.data.errors)
    }
    console.error('Error updating item:', err)
  } finally {
    loading.value = false
  }
})

/* =============================
   CANCEL
============================== */
const handleCancel = () => {
  navigateTo(localePath('/item-managment'))
}

/* =============================
   LIFECYCLE
============================== */
onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    fetchUnits(),
    fetchBranches(),
    fetchReceiptTypes(),
  ])
  // نجيب داتا الـ item بعد ما الـ options اتحملت عشان الـ select يتعرف على القيمة صح
  await fetchItemData()
})
</script>

<style scoped>
.section-label {
  background-color: #FBFBFC;
  padding: 10px;
  border-radius: var(--radius-sm);
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 12px;
}
.section-label svg {
  color: var(--secondary-color) !important;
}
</style>