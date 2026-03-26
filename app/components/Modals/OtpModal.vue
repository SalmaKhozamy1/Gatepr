<template>
  <ModalsAppModal v-model="show" :hasHeader="false" width="480px" :close-on-backdrop="false">
    <div class="otp-container flex-column-center gap-md">
      <div class="header-text text-center">
        <h4 class="mb-2">{{ t('auth.activation_code') }}</h4>
        <p class="desc px-4">{{ t('auth.enter_otp') }}  <div class="inline text">{{ t('auth.sent_to') }} {{ contact }}</div></p>
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
          :class="{ 'filled': otp[index] }"
          @input="handleInput(index)"
          @keydown="handleKeydown($event,index)"
          @paste="handlePaste"
        />
      </div>

      <div class="timer-section w-100 d-flex justify-content-between px-3">
        <span class="timer primary">0:{{ String(timeLeft).padStart(2, '0') }}</span>
        <button class="custom-anc secondary" @click.prevent="resendCode" :disabled="timeLeft > 0">
        {{ t('auth.resend') }}
        </button>
      </div>

      <button 
        class="custom-btn secondary-btn w-100" 
        @click="submitOtp" 
        :disabled="otpCode.length !== 6"
        :class="{ 'btn-disabled': otpCode.length !== 6 }"
      >
        {{ t('auth.continue') }}
      </button>
    </div>
  </ModalsAppModal>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
import { useApi } from '~/composables/useApi'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const api = useApi()
const show = defineModel('show')

const props = defineProps({
  contact: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'email'
  },
  verifyEndpoint: {
    type: String,
    default: '/v1/admin/verify-code'
  },
  resendEndpoint: {
    type: String,
    default: '/v1/admin/resend-code'
  }
})

const emit = defineEmits(['open-reset-password'])
const otp = ref(['', '', '', '', '', ''])
const otpInputs = ref([])  
const timeLeft = ref(59)
let timerInterval = null    

const otpCode = computed(() => otp.value.join(''))

/* ======================
   INPUT HANDLING
====================== */
const handleInput = (index) => {
  otp.value[index] = otp.value[index].replace(/[^0-9]/g, '')
  if (otp.value[index] && index < 5) {
    otpInputs.value[index + 1].focus()
  }
}

const handleKeydown = (event, index) => {
  if (event.key === 'Backspace' && !otp.value[index] && index > 0) {
    otpInputs.value[index - 1].focus()
  }
}

const handlePaste = (event) => {
  const paste = event.clipboardData.getData('text').replace(/\D/g, '')
  if (paste.length === 6) {
    otp.value = paste.split('')
    nextTick(() => {
      otpInputs.value[5].focus()
    })
  }
}

/* ======================
   VERIFY CODE
====================== */
const submitOtp = async () => {
  try {
    const response = await api(props.verifyEndpoint, {
      method: 'POST',
      body: {
        email: props.type === 'email' ? props.contact : '',
        phone: props.type === 'phone' ? props.contact : '',
        code: otpCode.value
      }
    })
    show.value = false
    emit('open-reset-password', {
      contact: props.contact,
      type: props.type,
      code: otpCode.value,
      token: response.data
    })
  } catch (err) {
    console.error('Invalid code')
  }
}

const resendCode = async () => {
  try {
    await api(props.resendEndpoint, {
      method: 'POST',
      body: { 
        email: props.type === 'email' ? props.contact : '',
        phone: props.type === 'phone' ? props.contact : ''
      }
    })
    startTimer()
  } catch (err) {
    console.error(err)
  }
}

const startTimer = () => {
  clearInterval(timerInterval)    
  timeLeft.value = 59
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timerInterval)
    }
  }, 1000)
}

watch(() => show.value, (val) => {
  if (val) {
    otp.value = ['', '', '', '', '', '']
    startTimer()
  } else {
    clearInterval(timerInterval)
  }
})

onMounted(() => {
  if (show.value) startTimer()
})

onBeforeUnmount(() => {
  clearInterval(timerInterval)     // ✅ نظف لما الـ component يتشال
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

.otp-input:focus,
.otp-input.filled {
  border-color: var(--secondary-color);
  background-color: var(--light-secondary-color);
}

.timer {
  font-weight: 500;
}
.custom-anc.secondary {
  border: 0px;
  background-color: transparent;
}
.custom-anc.secondary:disabled {
  cursor: not-allowed;
  opacity: 0.8;
}
</style>
