<template>
  <div class="max-w-3xl mx-auto p-6">
    <div class="relative flex items-center justify-center mb-6">
      <button
        type="button"
        @click="router.back()"
        class="absolute left-0 flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-100 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </button>
      <h1 class="text-2xl font-semibold text-gray-100">Create Blog</h1>
    </div>

    <form @submit.prevent="onSubmit" class="space-y-6 bg-gray-800 p-6 rounded-md shadow-sm">
      <div>
        <label class="block text-sm font-medium text-gray-300">Title</label>
        <input
          v-model="form.title"
          @input="updateSlug"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-gray-100 shadow-sm px-3 py-2 focus:ring-primary-300 focus:border-primary-300"
          placeholder="My great post"
          required
        />
        <p v-if="errors.title" class="text-sm text-red-400 mt-1">
          {{ errors.title }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300">Slug</label>
        <input
          v-model="form.slug"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-gray-100 shadow-sm px-3 py-2 focus:ring-primary-300 focus:border-primary-300"
          placeholder="my-great-post"
          required
        />
        <p v-if="errors.slug" class="text-sm text-red-400 mt-1">
          {{ errors.slug }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300">Image URL (optional)</label>
        <input
          v-model="form.image"
          type="url"
          class="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-gray-100 shadow-sm px-3 py-2 focus:ring-primary-300 focus:border-primary-300"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300">Content</label>
        <textarea
          v-model="form.content"
          rows="6"
          class="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-gray-100 shadow-sm px-3 py-2 focus:ring-primary-300 focus:border-primary-300"
          placeholder="Write your post content here..."
        ></textarea>
      </div>

      <div class="flex items-center">
        <label class="flex items-center cursor-pointer select-none space-x-3">
          <div class="relative" role="switch" :aria-checked="form.published">
            <input id="published" type="checkbox" v-model="form.published" class="sr-only" />
            <div :class="['w-11 h-6 rounded-full transition-colors duration-200', form.published ? 'bg-primary-600' : 'bg-gray-600']"></div>
            <div :class="['absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200', form.published ? 'translate-x-5' : 'translate-x-0']"></div>
          </div>
          <span class="text-sm text-gray-300">Publish immediately</span>
        </label>
      </div>

      <div class="flex items-center justify-between">
        <div class="text-sm text-red-400" v-if="submissionError">
          {{ submissionError }}
        </div>
        <div class="flex space-x-2">
          <button
            type="button"
            @click="resetForm"
            class="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50"
            :disabled="isSubmitting"
          >
            Reset
          </button>
          <button
            type="submit"
            class="px-4 py-2 rounded-md bg-primary-600 text-white text-sm hover:bg-primary-700 disabled:opacity-50"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">Submitting...</span>
            <span v-else>Create Post</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  title: "",
  slug: "",
  image: "",
  content: "",
  published: false,
});

const errors = reactive<{ title?: string; slug?: string }>({});
const isSubmitting = ref(false);
const submissionError = ref("");

function slugify(value: string) {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-");
}

function updateSlug() {
  if (!form.slug) {
    form.slug = slugify(form.title);
  }
}

function validate() {
  errors.title = undefined;
  errors.slug = undefined;

  if (!form.title || !form.title.trim()) {
    errors.title = "Title is required.";
  }
  if (!form.slug || !form.slug.trim()) {
    errors.slug = "Slug is required.";
  }

  return !errors.title && !errors.slug;
}

function resetForm() {
  form.title = "";
  form.slug = "";
  form.image = "";
  form.content = "";
  form.published = false;
  submissionError.value = "";
}

async function onSubmit() {
  submissionError.value = "";

  if (!validate()) return;

  isSubmitting.value = true;

  try {
    const payload = {
      title: form.title,
      slug: form.slug,
      image: form.image || undefined,
      content: form.content || undefined,
      published: !!form.published,
    };

    const res = await $fetch("/api/blogs", {
      method: "POST",
      body: payload,
    });

    router.push("/");
  } catch (err: any) {
    submissionError.value =
      err?.data?.statusMessage || err?.message || "Failed to create post.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped></style>
