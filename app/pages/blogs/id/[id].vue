<template>
  <div class="max-w-3xl mx-auto p-6">
    <div class="mb-4">
      <button @click="goBack" class="px-3 py-1 rounded-md bg-gray-700 text-sm text-gray-100 hover:bg-gray-600">← Back</button>
    </div>

    <div v-if="error" class="text-red-400">{{ error }}</div>

    <div v-else-if="!post" class="text-gray-300">Post not found.</div>

    <article v-else class="bg-gray-800 p-6 rounded-md shadow-sm">
      <div class="flex items-start justify-between gap-4 mb-4">
        <h1 class="text-2xl font-semibold text-gray-100">{{ post.title }}</h1>
        <span class="text-sm text-gray-400 whitespace-nowrap mt-1">{{ formatDate(post.created_at) }}</span>
      </div>

      <div v-if="post.image" class="mb-4">
        <img :src="post.image" alt="" class="w-full h-64 object-cover rounded-md" />
      </div>

      <div class="prose prose-invert max-w-none text-gray-200" v-if="post.content">
        <p v-html="post.content"></p>
      </div>

      <div class="mt-6 text-sm text-gray-300">Status: <span :class="post.published ? 'text-green-400' : 'text-yellow-400'">{{ post.published ? 'Published' : 'Draft' }}</span></div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAsyncData } from '#app';

const route = useRoute();
const id = route.params.id as string;

type Post = {
  id: string;
  title: string;
  slug: string;
  image?: string | null;
  content?: string | null;
  published: boolean;
  created_at: string | Date;
  updated_at?: string | Date | null;
};

const { data: postData, error: fetchError } = await useAsyncData<Post | null>(`post-by-id-${id}`, () => $fetch(`/api/blogs/id/${id}`));

const post = postData.value ?? null;
const error = ref('');
if (fetchError.value) error.value = fetchError.value.message || 'Failed to load post.';

import { useRouter } from 'vue-router';
const router = useRouter();

function goBack() {
  if (window?.history?.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
}

function formatDate(input: string | Date) {
  const d = typeof input === 'string' ? new Date(input) : input;
  return d.toLocaleDateString();
}
</script>

<style scoped></style>
