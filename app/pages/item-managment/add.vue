<template>
  <PageLayout :hasAside="false" :hasSearch="false" :formTitle="t('items.add_form.title')">
    <template #main>
        <!-- <IconsRegistrationPending /> -->
      <form @submit.prevent="onSubmit" class="grid grid-3 gap-sm">
        <!-- Row 1: Item Details -->
        <div class="full-width">
          <div class="section-label flex-start gap-xs">
            <IconsInformation /> {{ t('items.add_form.item_details') }}
          </div>
        </div>
        <div>
          <InputsFormInput
            v-model="form.itemNumber"
            :label="t('items.add_form.labels.item_number')"
            :placeholder="t('items.add_form.placeholders.item_number')"
            class="required"
          />
        </div>
        <div>
          <InputsFormInput
            v-model="form.itemNameAr"
            :label="t('items.add_form.labels.name_ar')"
            :placeholder="t('items.add_form.placeholders.name_ar')"
            class="required"
          />
        </div>
        <div>
          <InputsFormInput
            v-model="form.itemNameEn"
            :label="t('items.add_form.labels.name_en')"
            :placeholder="t('items.add_form.placeholders.name_en')"
            class="required"
          />
        </div>

        <!-- Row 2: Supplier & Financial Info -->
        <div>
          <div class="section-label flex-start gap-xs">
            <IconsResponsibleData /> {{ t('items.add_form.supplier_info') }}
          </div>
          <InputsFormInput
            v-model="form.supplierCode"
            :label="t('items.add_form.labels.supplier_code')"
            :placeholder="t('items.add_form.placeholders.supplier_code')"
            class="required"
          />
        </div>
        <div class="col-span-2">
          <div class="section-label flex-start gap-xs">
            <IconsInformation /> {{ t('items.add_form.financial_info') }}
          </div>
          <div class="grid grid-2 gap-sm">
            <div>
              <InputsFormInput
                v-model="form.profitMargin"
                :label="t('items.add_form.labels.profit_margin')"
                :placeholder="t('items.add_form.placeholders.profit_margin')"
                class="required"
              />
            </div>
            <div>
              <InputsFormInput
                v-model="form.supplierPrice"
                :label="t('items.add_form.labels.supplier_price')"
                :placeholder="t('items.add_form.placeholders.supplier_price')"
                class="required"
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
            v-model="form.subCategory"
            :label="t('items.add_form.labels.sub_category')"
            :options="[]"
            :placeholder="t('items.add_form.placeholders.choose_category')"
            class="required"
          />
        </div>
        <div class="col-span-2">
          <div class="section-label flex-start gap-xs">
            <IconsInformation /> {{ t('items.add_form.physical_specs') }}
          </div>
          <div class="grid grid-2 gap-sm">
            <div>
              <InputsFormInput
                v-model="form.weight"
                :label="t('items.add_form.labels.weight')"
                :placeholder="t('items.add_form.placeholders.weight')"
                class="required"
              />
            </div>
            <div>
              <InputsFormInput
                v-model="form.volume"
                :label="t('items.add_form.labels.volume')"
                :placeholder="t('items.add_form.placeholders.volume')"
                class="required"
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
            v-model="form.purchasingUnit"
            :label="t('items.add_form.labels.purchasing_unit')"
            :options="[]"
            :placeholder="t('items.add_form.placeholders.choose_unit')"
            class="required"
          />
        </div>
        <div class="col-span-2">
          <div class="section-label flex-start gap-xs">
            <IconsDiscount /> {{ t('items.add_form.discounts') }}
          </div>
          <div class="grid grid-2 gap-sm">
            <div>
              <InputsFormInput
                v-model="form.associationDiscount"
                :label="t('items.add_form.labels.association_discount')"
                :placeholder="t('items.add_form.placeholders.discount')"
                class="required"
                :icon="'%'"
              >
              </InputsFormInput>
            </div>
            <div>
              <InputsFormInput
                v-model="form.consumerDiscount"
                :label="t('items.add_form.labels.consumer_discount')"
                :placeholder="t('items.add_form.placeholders.discount')"
                class="required"
                :icon="'%'">
              </InputsFormInput>
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
            v-model="form.supplyIntensity"
            :label="t('items.add_form.labels.supply_intensity')"
            :placeholder="t('items.add_form.placeholders.supply_intensity')"
            class="required"
          />
        </div>
        <div>
          <InputsFormInput
            v-model="form.packetIntensity"
            :label="t('items.add_form.labels.packet_intensity')"
            :placeholder="t('items.add_form.placeholders.packet_intensity')"
            class="required"
          />
        </div>
        <div>
          <InputsFormInput
            v-model="form.cartonIntensity"
            :label="t('items.add_form.labels.carton_intensity')"
            :placeholder="t('items.add_form.placeholders.carton_intensity')"
            class="required"
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
            v-model="form.unitPrice"
            :label="t('items.add_form.labels.unit_price')"
            :placeholder="t('items.add_form.placeholders.price')"
            class="required"
          />
        </div>
        <div>
          <InputsFormInput
            v-model="form.packetPrice"
            :label="t('items.add_form.labels.packet_price')"
            :placeholder="t('items.add_form.placeholders.price')"
            class="required"
          />
        </div>
        <div>
          <InputsFormInput
            v-model="form.cartonPrice"
            :label="t('items.add_form.labels.carton_price')"
            :placeholder="t('items.add_form.placeholders.price')"
            class="required"
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
            v-model="form.unitBarcode"
            :label="t('items.add_form.labels.unit_barcode')"
            :placeholder="t('items.add_form.placeholders.barcode')"
            class="required"
          />
        </div>
        <div>
          <InputsFormInput
            v-model="form.packetBarcode"
            :label="t('items.add_form.labels.packet_barcode')"
            :placeholder="t('items.add_form.placeholders.barcode')"
            class="required"
          />
        </div>
        <div>
          <InputsFormInput
            v-model="form.cartonBarcode"
            :label="t('items.add_form.labels.carton_barcode')"
            :placeholder="t('items.add_form.placeholders.barcode')"
            class="required"
          />
        </div>

        <!-- Row 8: Branch & Delivery Info -->
        <div>
          <div class="section-label flex-start gap-xs">
            <IconsBranches /> {{ t('items.add_form.branch_info') }}
          </div>
          <InputsFormSelect
            v-model="form.branch"
            :label="t('items.add_form.labels.branch')"
            :options="[]"
            :placeholder="t('items.add_form.placeholders.choose_branch')"
            class="required"
          />
        </div>
        <div>
          <div class="section-label flex-start gap-xs">
            <IconsDelivery /> {{ t('items.add_form.delivery_info') }}
          </div>
          <InputsFormSelect
            v-model="form.receiptType"
            :label="t('items.add_form.labels.receipt_type')"
            :options="[]"
            :placeholder="t('items.add_form.placeholders.choose_type')"
            class="required"
          />
        </div>

        <!-- Footer Buttons -->
         <div class="full-width">
            <ButtonsFormActions 
            v-if="!isView"
            btnSaveClass="primary"
            :loading="loading" 
            @cancel="handleCancel" 
            @save="onSaveName" 
            />
         </div>
      </form>
    </template>
  </PageLayout>
</template>

<script setup>
import { reactive } from "vue";

definePageMeta({ middleware: "auth" });
usePageMeta("menu.item-managment");
const localePath = useLocalePath();
const { t } = useI18n();

const form = reactive({
  itemNumber: "",
  itemNameAr: "",
  itemNameEn: "",
  supplierCode: "",
  profitMargin: "",
  supplierPrice: "",
  subCategory: null,
  weight: "",
  volume: "",
  purchasingUnit: null,
  associationDiscount: "",
  consumerDiscount: "",
  supplyIntensity: "",
  packetIntensity: "",
  cartonIntensity: "",
  unitPrice: "",
  packetPrice: "",
  cartonPrice: "",
  unitBarcode: "",
  packetBarcode: "",
  cartonBarcode: "",
  branch: null,
  receiptType: null,
});
</script>

<style scoped>
.form-header {
  border-bottom: 1px solid #eaecf0;
  padding-bottom: 16px;
  margin-bottom: 24px;
}
.header-title {
  font-size: 16px;
  font-weight: 700;
  color: #101828;
}
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
.text-muted {
  color: #98a2b3 !important;
}
</style>
