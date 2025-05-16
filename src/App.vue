<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import TheFooter from '@/components/layout/AppFooter.vue'
</script>

<template>
  <VApp>
    <AppHeader />
    <VMain>
      <router-view />
    </VMain>
    <TheFooter />
  </VApp>
</template>
