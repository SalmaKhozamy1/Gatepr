<template>
  <ModalsAppModal v-model="show" :hasHeader="false" width="480px">
    <div class="otp-container flex-column-center gap-md">
      <div class="header-text text-center">
        <h4 class="mb-2">كود التفعيل</h4>
        <p class="desc px-4">أدخل رمز التحقق المكون من 6 أرقام الذي أرسلناه إلى johndoe@gmail.com</p>
      </div>

      <!-- Simple PIN Input Mockup -->
      <div class="otp-inputs d-flex gap-2 justify-content-center w-100">
        <input v-for="i in 6" :key="i" type="text" maxlength="1" class="otp-input" />
      </div>

      <div class="timer-section w-100 d-flex justify-content-between px-3">
        <a href="#" class="custom-anc secondary">إعادة إرسال</a>
        <span class="timer primary">0:59</span>
      </div>

      <button class="custom-btn secondary-btn w-100 mt-2" @click="submitOtp">استكمال</button>
    </div>
  </ModalsAppModal>
</template>

<script setup>
const show = defineModel('show')

const submitOtp = () => {
    console.log('OTP submitted')
    show.value = false
}
</script>

<style scoped>
.otp-container {
  padding-block: 20px;
}

.otp-input {
  width: 54px;
  height: 60px;
  border-radius: var(--radius-sm);
  border: 1px solid #D0D5DD;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: var(--primary-color);
  outline: none;
  transition: all 0.2s;
}

.otp-input:focus {
  border-color: var(--secondary-color);
  background-color: var(--light-secondary-color);
}

.timer {
  font-weight: 500;
}
</style>
