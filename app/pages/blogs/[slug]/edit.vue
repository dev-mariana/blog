<template>
  <div class="max-w-3xl mx-auto p-6">
    <div class="relative flex items-center justify-center mb-6">
      <button
        type="button"
        @click="goBack"
        class="absolute left-0 flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-100 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </button>
      <h1 class="text-2xl font-semibold text-gray-100">Edit Post</h1>
    </div>

    <form
      @submit.prevent="onSubmit"
      class="space-y-6 bg-gray-800 p-6 rounded-md shadow-sm"
    >
      <div>
        <label class="block text-sm font-medium text-gray-300">Title</label>
        <input
          v-model="form.title"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-gray-100 shadow-sm px-3 py-2"
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
          class="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-gray-100 shadow-sm px-3 py-2"
          required
        />
        <p v-if="errors.slug" class="text-sm text-red-400 mt-1">
          {{ errors.slug }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300"
          >Image URL (optional)</label
        >
        <input
          v-model="form.image"
          type="url"
          class="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-gray-100 shadow-sm px-3 py-2"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300">Content</label>
        <textarea
          v-model="form.content"
          rows="6"
          class="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-gray-100 shadow-sm px-3 py-2"
        ></textarea>
      </div>

      <!-- Publish control removed from edit form; publishing is handled elsewhere -->

      <div class="flex items-center justify-between">
        <div class="text-sm text-red-400" v-if="submissionError">
          {{ submissionError }}
        </div>
        <div class="flex space-x-2">
          <button
            type="button"
            @click="resetForm"
            class="px-4 py-2 rounded-md bg-red-600 text-white text-sm"
          >
            Reset
          </button>
          <button
            type="submit"
            class="px-4 py-2 rounded-md bg-primary-600 text-white text-sm"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">Saving...</span>
            <span v-else>Save</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData } from "#app";
import { reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const slug = route.params.slug as string;

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

const { data: postData, error: fetchError } = await useAsyncData<Post | null>(
  `post-${slug}`,
  () => $fetch(`/api/blogs/${slug}`),
);

const form = reactive({ title: "", slug: "", image: "", content: "" });
const errors = reactive<{ title?: string; slug?: string }>({});
const isSubmitting = ref(false);
const submissionError = ref("");

watch(postData, (val) => {
  if (val) {
    form.title = val.title;
    form.slug = val.slug;
    form.image = val.image || "";
    form.content = val.content || "";
    // keep published state managed by server; not editable here
  }
});

function validate() {
  errors.title = undefined;
  errors.slug = undefined;

  if (!form.title || !form.title.trim()) errors.title = "Title is required.";
  if (!form.slug || !form.slug.trim()) errors.slug = "Slug is required.";

  return !errors.title && !errors.slug;
}

function resetForm() {
  if (postData.value) {
    form.title = postData.value.title;
    form.slug = postData.value.slug;
    form.image = postData.value.image ?? "";
    form.content = postData.value.content ?? "";
    // keep published state managed by server; not editable here
  }
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
    };

    await $fetch(`/api/blogs/${slug}`, { method: "PATCH", body: payload });

    router.push("/");
  } catch (err: any) {
    submissionError.value =
      err?.data?.statusMessage || err?.message || "Failed to update post.";
  } finally {
    isSubmitting.value = false;
  }
}

function goBack() {
  if (window?.history?.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
}
</script>

<style scoped></style>
