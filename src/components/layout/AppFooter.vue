<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import { useI18n } from 'vue-i18n'
import { formatApiName } from '@/utils/string'

import {
  mdiAlertCircle,
  mdiCheckCircle,
  mdiLoading,
  mdiGithub,
  mdiTranslate,
  mdiSend,
} from '@mdi/js'

type HealthResponse = {
  status: number
  message: string
  data: {
    status: string
    info: {
      [key: string]: {
        status: string
      }
    }
  }
}

type ApiStatus = {
  status: string
}

const { t } = useI18n()

const apis = ref<Record<string, ApiStatus>>({})
const healthCheckError = ref(false)

const checkHealth = async () => {
  try {
    const response = await fetch(import.meta.env.VITE_HEALTH_CHECK_URL)
    const data: HealthResponse = await response.json()

    if (data.status === 200) {
      apis.value = Object.entries(data.data.info).reduce(
        (acc, [key, value]) => {
          acc[key] = { status: value.status }
          return acc
        },
        {} as Record<string, ApiStatus>,
      )
      healthCheckError.value = false
    } else {
      healthCheckError.value = true
    }
  } catch (error) {
    console.error('Health check failed:', error)
    healthCheckError.value = true
  }
}

const healthStatus = computed(() => {
  if (healthCheckError.value) return 'error'
  if (Object.keys(apis.value).length === 0) return 'checking'
  return Object.values(apis.value).every((api) => api.status === 'up') ? 'healthy' : 'error'
})

const healthIcon = computed(() => {
  switch (healthStatus.value) {
    case 'healthy':
      return mdiCheckCircle
    case 'error':
      return mdiAlertCircle
    default:
      return mdiLoading
  }
})

const healthColor = computed(() => {
  switch (healthStatus.value) {
    case 'healthy':
      return 'success'
    case 'error':
      return 'error'
    default:
      return 'warning'
  }
})

const healthText = computed(() => {
  switch (healthStatus.value) {
    case 'healthy':
      return t('footer.health.allOperational')
    case 'error':
      return t('footer.health.issuesDetected')
    default:
      return t('footer.health.checking')
  }
})

const socialItems = computed(() => [
  {
    title: t('footer.social.github'),
    icon: mdiGithub,
    href: 'https://github.com/NedaaDevs/nedaa',
  },
  {
    title: t('footer.social.telegram'),
    icon: mdiSend,
    href: 'https://t.me/NedaDev',
  },
  {
    title: t('footer.social.translate'),
    icon: mdiTranslate,
    href: 'https://crowdin.com/project/nedaa',
  },
])

onMounted(() => {
  checkHealth()
})
</script>

<template>
  <VFooter class="border pa-4 theme-transition">
    <!-- Health -->
    <VMenu location="top" :close-on-content-click="false" transition="scale-transition">
      <template v-slot:activator="{ props: menuProps }">
        <VBtn
          v-bind="menuProps"
          variant="text"
          size="small"
          class="theme-transition"
          :aria-label="healthText"
        >
          <VIcon :icon="healthIcon" :color="healthColor" size="small" class="me-2" />
          <span class="text-caption d-none d-sm-inline">{{ healthText }}</span>
        </VBtn>
      </template>
      <VCard min-width="200" class="rounded-lg" elevation="4">
        <VCardText class="pa-3">
          <div
            v-for="(api, name) in apis"
            :key="name"
            class="d-flex align-center pa-2 theme-transition-text"
          >
            <VIcon
              :icon="api.status === 'up' ? mdiCheckCircle : mdiAlertCircle"
              :color="api.status === 'up' ? 'success' : 'error'"
              size="x-small"
              class="me-2"
            />
            <span class="text-caption text-medium-emphasis">{{
              formatApiName(name as string)
            }}</span>
          </div>
        </VCardText>
      </VCard>
    </VMenu>

    <VSpacer />

    <!-- Social Links -->
    <div class="d-flex align-center">
      <a
        v-for="item in socialItems"
        :key="item.title"
        :href="item.href"
        :title="item.title"
        class="d-inline-block mx-2 text-medium-emphasis"
        rel="noopener noreferrer"
        target="_blank"
      >
        <VHover>
          <template v-slot:default="{ isHovering, props }">
            <VIcon
              v-bind="props"
              :icon="item.icon"
              size="small"
              class="theme-transition"
              v-ripple
              :class="{ 'text-primary translate-y-n1': isHovering }"
            />
          </template>
        </VHover>
      </a>
    </div>

    <VSpacer />

    <!-- Copyright & License -->
    <div class="text-caption text-medium-emphasis">
      &copy; {{ new Date().getFullYear() }}
      <span class="d-none d-sm-inline-block">{{ t('footer.appName') }}</span>
      <!-- TODO: Add license -->
      <!-- <a class="text-decoration-none text-primary" href="/license" rel="noopener noreferrer">
        {{ t('footer.license') }}
      </a> -->
      <router-link class="ms-2 text-decoration-none text-primary" to="/privacy">
        {{ t('footer.privacy') }}
      </router-link>
    </div>
  </VFooter>
</template>
