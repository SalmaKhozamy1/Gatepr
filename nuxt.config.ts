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
      titleTemplate: '%s | GetPro',
      title: 'GetPro',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ],
    }
  },
  // css: [
  //   '~/assets/styles/main.css'
  // ],
  plugins: [
    { src: '~/plugins/bootstrap.client.ts', mode: 'client' },
    { src: '~/plugins/styles.client.ts', mode: 'client' },
  ],
  runtimeConfig: {
    public: {
      apiBase: 'https://backend.gate.roqay.dev/public/api',
      defaultLocale: 'ar'
    }
  },
  routeRules: {
    '/api/**': {
      proxy: 'https://backend.gate.roqay.dev/api/**'
    }
  },
  // devServer: {
  //   port: 5045, // هنا حددنا البورت
  //   host: '0.0.0.0' // لو عايزة السيرفر يكون accessible من شبكة محلية
  // }
})