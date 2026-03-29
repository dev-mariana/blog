<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 dark">
    <header class="bg-gray-800 border-b border-gray-700">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <h2 class="text-lg font-semibold">My Blog</h2>
        <nav class="space-x-4">
          <NuxtLink to="/" class="text-sm text-gray-300 hover:underline">Home</NuxtLink>
          <NuxtLink to="/blogs/create" class="text-sm text-primary-400 hover:underline">Create Blog</NuxtLink>
        </nav>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-4 py-8">
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </main>
  </div>
</template>
