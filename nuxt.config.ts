// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'en', name: 'English', dir: 'ltr' },
      { code: 'ar', name: 'العربية', dir: 'rtl' }
    ],
    defaultLocale: 'ar',
    strategy: 'prefix_except_default'
  },
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap' }
      ]
    }
  },
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '~/assets/styles/main.css'
  ]
})

// export default defineNuxtConfig({
//   modules: ['@nuxtjs/i18n'],

//   i18n: {
//     locales: [
//       { code: 'en', name: 'English', dir: 'ltr' },
//       { code: 'ar', name: 'العربية', dir: 'rtl' }
//     ],
//     defaultLocale: 'ar',
//     strategy: 'prefix_except_default'
//   }
// })
