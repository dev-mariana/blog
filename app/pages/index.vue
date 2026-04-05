<template>
  <div>
    <nuxt-page />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

if (process.client) {
  router.replace("/blogs");
}
</script>

<style scoped></style>
