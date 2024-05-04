<script setup>
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <header>
    <AppHeader />
  </header>
  <main role="main">
    <div class="container">
      <RouterView />
    </div>
  </main>
</template>
