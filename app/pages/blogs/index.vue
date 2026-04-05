<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-gray-100">All Posts</h1>
      <nuxt-link
        to="/blogs/create"
        class="px-3 py-2 rounded-md bg-primary-600 text-white text-sm hover:bg-primary-700"
        >New Post</nuxt-link
      >
    </div>

    <div v-if="error" class="text-red-400">{{ error }}</div>

    <div v-if="!posts.length && !error" class="text-gray-300">
      No posts found.
    </div>

    <ul class="space-y-4">
      <li
        v-for="post in posts"
        :key="post.id"
        class="bg-gray-800 p-4 rounded-md shadow-sm cursor-pointer"
        role="button"
        tabindex="0"
        @click="goToPost(post)"
        @keyup.enter="goToPost(post)"
      >
        <div class="flex items-start space-x-4">
          <div
            v-if="post.image"
            class="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-700"
          >
            <img :src="post.image" alt="" class="w-full h-full object-cover" />
          </div>

          <div class="flex-1">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-medium text-gray-100">
                <nuxt-link @click.stop :to="`/blogs/${post.slug}`" class="hover:underline">{{ post.title }}</nuxt-link>
              </h2>
              <span class="text-sm text-gray-400">{{ formatDate(post.created_at) }}</span>
            </div>

            <p
              class="mt-2 text-sm text-gray-300 line-clamp-3"
              v-if="post.content"
            >
              {{ post.content }}
            </p>

            <div class="mt-3 flex items-center justify-between text-sm">
              <span :class="post.published ? 'text-green-400' : 'text-yellow-400'">{{ post.published ? "Published" : "Draft" }}</span>
              <nuxt-link @click.stop :to="`/blogs/${post.slug}/edit`" class="text-sm text-gray-300 hover:underline">Edit</nuxt-link>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData } from "#app";
import { ref } from "vue";
import { useRouter } from 'vue-router';

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

const error = ref("");
const {
  data: postsData,
  pending,
  refresh,
  error: fetchError,
} = await useAsyncData<Post[]>("posts", () => $fetch("/api/blogs"));

const posts = postsData.value ?? [];

if (fetchError.value) {
  error.value = fetchError.value?.message || "Failed to load posts.";
}

function formatDate(input: string | Date) {
  const d = typeof input === "string" ? new Date(input) : input;
  return d.toLocaleDateString();
}

const router = useRouter();

function goToPost(post: Post) {
  // Navigate using the id-based route so the GET-by-id endpoint is used
  router.push(`/blogs/id/${post.id}`);
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
