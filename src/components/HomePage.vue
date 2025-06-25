<script setup lang="ts">
// Section components
import HeroSection from '@/components/sections/HeroSection.vue'
import FeaturesSection from '@/components/sections/FeaturesSection.vue'
import DownloadSection from '@/components/sections/DownloadSection.vue'
import OpenSourceSection from '@/components/sections/OpenSourceSection.vue'
import TranslateSection from '@/components/sections/TranslateSection.vue'
</script>

<template>
  <!-- Hero Section -->
  <HeroSection background="gradient" :logoHeight="150" />

  <!-- Features -->
  <FeaturesSection />

  <!-- Downloads -->
  <DownloadSection />

  <!-- Open Source -->
  <OpenSourceSection />

  <!-- Translate -->
  <TranslateSection />
</template>
