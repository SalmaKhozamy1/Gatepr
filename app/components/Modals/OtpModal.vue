<template>
  <ModalsAppModal v-model="show" :hasHeader="false" width="480px">
    <div class="otp-container flex-column-center gap-md">
      <div class="header-text text-center">
        <h4 class="mb-2">كود التفعيل</h4>
        <p class="desc px-4">أدخل رمز التحقق المكون من 6 أرقام الذي أرسلناه  <div class="inline text">إلى johndoe@gmail.com</div></p>
      </div>

      <!-- Simple PIN Input Mockup -->
      <div class="otp-inputs d-flex gap-2 justify-content-center w-100">
        <input
          v-for="(digit,index) in otp"
          :key="index"
          ref="otpInputs"
          v-model="otp[index]"
          type="text"
          maxlength="1"
          class="otp-input"
          @input="handleInput(index)"
          @keydown="handleKeydown($event,index)"
          @paste="handlePaste"
        />
      </div>

      <div class="timer-section w-100 d-flex justify-content-between px-3">
        <span class="timer primary">0:{{ String(timeLeft).padStart(2, '0') }}</span>
        <button class="custom-anc secondary" @click.prevent="resendCode" :disabled="timeLeft === 0">
        إعادة إرسال
        </button>
      </div>

      <button class="custom-btn secondary-btn w-100" @click="submitOtp" :disabled="otpCode.length !== 6">استكمال</button>
    </div>
  </ModalsAppModal>
</template>

<script setup>
import { useApi } from '~/composables/useApi'

const api = useApi()
const show = defineModel('show')
const email = defineModel('email')
const emit = defineEmits(['open-reset-password'])
const otp = ref(['', '', '', '', '', ''])
const timeLeft = ref(59)

const otpCode = computed(() => otp.value.join(''))

/* ======================
   INPUT HANDLING
====================== */

const handleInput = (index) => {

  otp.value[index] = otp.value[index].replace(/[^0-9]/g,'')

  if(otp.value[index] && index < 5){
    otpInputs.value[index+1].focus()
  }

}

const handleKeydown = (event,index) => {

  if(event.key === 'Backspace' && !otp.value[index] && index > 0){
    otpInputs.value[index-1].focus()
  }

}

const handlePaste = (event) => {

  const paste = event.clipboardData.getData('text').replace(/\D/g,'')

  if(paste.length === 6){

    otp.value = paste.split('')

    nextTick(()=>{
      otpInputs.value[5].focus()
    })

  }

}

/* ======================
   VERIFY CODE
====================== */
const submitOtp = async () => {
  try {

    await api('/admin/verify-code', {
      method: 'POST',
      body: {
        email: email.value,
        code: otpCode.value
      }
    })

    console.log('OTP verified')

    show.value = false

    emit('open-reset-password', {
      email: email.value,
      code: otpCode.value
    })

  } catch (err) {
    console.error('Invalid code')
  }
}
const resendCode = async () => {
  try {
    await api('/admin/resend-code', {
      method: 'POST',
      body: {
        email: email.value
      }
    })

    startTimer()

  } catch (err) {
    console.error(err)
  }
}
const startTimer = () => {
  timeLeft.value = 59

  const timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timer)
    }
  }, 1000)
}

onMounted(() => {
  startTimer()
})
</script>

<style scoped>
.otp-container {
  padding-block: 20px;
}

.otp-input {
  width: 47px;
  height: 46px;
  border-radius: var(--radius-sm);
  border: 1px solid #E0E1E5;
  background: #FFF;
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
