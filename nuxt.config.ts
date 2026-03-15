export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    ['@primevue/nuxt-module', {
      options: {
        ripple: true,
        components: {
          include: ['Toast', 'MultiSelect', 'DatePicker']
        }
      }
    }],
    "@nuxtjs/i18n"
  ],
  i18n: {
    defaultLocale: "ar",
    strategy: 'prefix_except_default',
    locales: [
      { name: "English", code: "en", language: "en-US", file: "en.json", dir: "ltr" },
      { name: "عربي", code: "ar", language: "ar-EG", file: "ar.json", dir: "rtl" },
    ],
    langDir: "locales",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'locale',
      redirectOn: 'root',
    },
  },
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap' }
      ],
      script: [
        { src: '/bootstrap.bundle.min.js' }
      ]
    }
  },
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'flatpickr/dist/flatpickr.css',
    '~/assets/styles/main.css'
  ],
  runtimeConfig: {
    public: {
      apiBase: 'https://gate.roqay.dev/api',
      defaultLocale: 'ar'
    }
  }
})