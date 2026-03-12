export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    ['@primevue/nuxt-module', {    // ✅ حط الـ options جوه الـ module مباشرة
      options: {
        ripple: true
      }
    }],
    [
      "@nuxtjs/i18n",
      {
        defaultLocale: "ar",
        locales: [
          {
            name: "English",
            code: "en",
            language: "en-US",
            file: "en.json",
            dir: "ltr",
          },
          {
            name: "عربي ",
            code: "ar",
            language: "ar-EG",
            file: "ar.json",
            dir: "rtl",
          },
        ],
        lazy: true,
        detectBrowserLanguage: false,
      },
    ]
  ],
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap' }
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