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
                <nuxt-link
                  @click.stop
                  :to="`/blogs/${post.slug}`"
                  class="hover:underline"
                  >{{ post.title }}</nuxt-link
                >
              </h2>
              <span class="text-sm text-gray-400">{{
                formatDate(post.created_at)
              }}</span>
            </div>

            <p
              class="mt-2 text-sm text-gray-300 line-clamp-3"
              v-if="post.content"
            >
              {{ post.content }}
            </p>

            <div class="mt-3 flex items-center justify-between text-sm">
              <span
                :class="post.published ? 'text-green-400' : 'text-yellow-400'"
                >{{ post.published ? "Published" : "Draft" }}</span
              >
              <div class="flex items-center space-x-4">
                <button
                  type="button"
                  @click.stop.prevent="goToEdit(post)"
                  class="px-3 py-1.5 rounded-md bg-primary-600 text-white text-sm hover:bg-primary-700"
                >
                  Edit
                </button>
                <button
                  type="button"
                  @click.stop.prevent="openDeleteModal(post)"
                  class="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <!-- Delete Confirmation Modal -->
    <Transition name="modal">
      <div
        v-if="showDeleteModal"
        class="modal-backdrop"
        @click.self="closeDeleteModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div class="modal-box">
          <!-- Icon -->
          <div class="modal-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/>
              <path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </div>

          <h2 id="modal-title" class="modal-title">Delete Post</h2>
          <p class="modal-message">
            Are you sure you want to delete
            <span class="modal-post-title">{{ postToDelete?.title }}</span>?
            This action cannot be undone.
          </p>

          <div class="modal-actions">
            <button
              type="button"
              class="btn-cancel"
              :disabled="isDeleting"
              @click="closeDeleteModal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn-delete"
              :disabled="isDeleting"
              @click="confirmDelete"
            >
              <span v-if="isDeleting" class="spinner" />
              {{ isDeleting ? "Deleting…" : "Delete" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData } from "#app";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

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

const posts = computed(() => postsData.value ?? []);

if (fetchError.value) {
  error.value = fetchError.value?.message || "Failed to load posts.";
}

function formatDate(input: string | Date) {
  const d = typeof input === "string" ? new Date(input) : input;
  return d.toLocaleDateString();
}

const router = useRouter();

function goToPost(post: Post) {
  router.push(`/blogs/id/${post.id}`);
}

function goToEdit(post: Post) {
  router.push(`/blogs/${post.slug}/edit`);
}

// --- Delete modal state ---
const showDeleteModal = ref(false);
const postToDelete = ref<Post | null>(null);
const isDeleting = ref(false);

function openDeleteModal(post: Post) {
  postToDelete.value = post;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  if (isDeleting.value) return;
  showDeleteModal.value = false;
  postToDelete.value = null;
}

async function confirmDelete() {
  if (!postToDelete.value) return;
  isDeleting.value = true;
  error.value = "";

  try {
    await $fetch(`/api/blogs/id/${postToDelete.value.id}`, {
      method: "DELETE",
    });
    await refresh();
    isDeleting.value = false;
    closeDeleteModal();
  } catch (e: any) {
    error.value = e?.message || "Failed to delete post.";
    isDeleting.value = false;
  }
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Backdrop */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  padding: 1rem;
}

/* Card */
.modal-box {
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 0.75rem;
  padding: 2rem;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

/* Trash icon */
.modal-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.modal-icon svg {
  width: 1.75rem;
  height: 1.75rem;
}

/* Text */
.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #f3f4f6;
  margin: 0;
}

.modal-message {
  font-size: 0.875rem;
  color: #9ca3af;
  text-align: center;
  line-height: 1.6;
  margin: 0;
}

.modal-post-title {
  color: #f3f4f6;
  font-weight: 500;
}

/* Buttons */
.modal-actions {
  display: flex;
  gap: 0.75rem;
  width: 100%;
  margin-top: 0.5rem;
}

.btn-cancel,
.btn-delete {
  flex: 1;
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background 0.15s ease, opacity 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-cancel {
  background: #374151;
  color: #d1d5db;
}

.btn-cancel:hover:not(:disabled) {
  background: #4b5563;
}

.btn-delete {
  background: #dc2626;
  color: #fff;
}

.btn-delete:hover:not(:disabled) {
  background: #b91c1c;
}

.btn-cancel:disabled,
.btn-delete:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading spinner */
.spinner {
  display: inline-block;
  width: 0.875rem;
  height: 0.875rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-box,
.modal-leave-active .modal-box {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-box,
.modal-leave-to .modal-box {
  transform: scale(0.95);
  opacity: 0;
}
</style>
