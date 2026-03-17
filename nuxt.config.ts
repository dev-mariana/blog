// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  vite: {
    optimizeDeps: {
      include: ["@vue/devtools-core", "@vue/devtools-kit"],
    },
  },
  modules: ["@prisma/nuxt", "@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  typescript: {
    strict: false,
    tsConfig: {
      compilerOptions: {
        strictPropertyInitialization: true,
        strictNullChecks: true,
      },
    },
  },
});
