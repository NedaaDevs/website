<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import { useI18n } from 'vue-i18n'

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

const formatApiName = (name: string) => {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
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

const socialItems = [
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
]

onMounted(() => {
  checkHealth()
})
</script>

<template>
  <VFooter border class="pa-4">
    <!-- Health -->
    <div class="health-status-container d-flex align-center">
      <VTooltip location="top" :z-index="1">
        <template v-slot:activator="{ props }">
          <div v-bind="props" class="health-icon-wrapper d-flex align-center">
            <VIcon :icon="healthIcon" :color="healthColor" size="small" class="mr-2" />
          </div>
        </template>
        <span>{{ healthText }}</span>
      </VTooltip>
      <div class="health-details-wrapper">
        <div class="health-details">
          <div v-for="(api, name) in apis" :key="name" class="d-flex align-center pa-1">
            <VIcon
              :icon="api.status === 'up' ? mdiCheckCircle : mdiAlertCircle"
              :color="api.status === 'up' ? 'success' : 'error'"
              size="x-small"
              class="mr-1"
            />
            <span class="text-caption">{{ formatApiName(name) }}</span>
          </div>
        </div>
      </div>
    </div>

    <VSpacer />

    <!-- Social Links -->
    <div class="d-flex align-center">
      <a
        v-for="item in socialItems"
        :key="item.title"
        :href="item.href"
        :title="item.title"
        class="d-inline-block mx-2 social-link"
        rel="noopener noreferrer"
        target="_blank"
      >
        <VIcon :icon="item.icon" size="small" />
      </a>
    </div>

    <VSpacer />

    <!-- Copyright & License -->
    <div class="text-caption text-disabled">
      &copy; {{ new Date().getFullYear() }}
      <span class="d-none d-sm-inline-block">{{ t('footer.appName') }}</span>
      <!-- TODO: Add license -->
      <!-- <a class="text-decoration-none" href="/license" rel="noopener noreferrer">
        {{ t('footer.license') }}
      </a> -->
    </div>
  </VFooter>
</template>

<style scoped>
.health-status-container {
  position: relative;
}

.health-icon-wrapper {
  position: relative;
  cursor: pointer;
}

.health-details-wrapper {
  position: relative;
  display: none;
  position: absolute;
  bottom: 100%;
  left: 0;
  z-index: 10;
}

.health-status-container:hover .health-details-wrapper {
  display: block;
}

.health-details {
  background: rgb(var(--v-theme-surface));
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 8px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  min-width: 120px;
}

.health-details::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 16px;
  border-width: 8px;
  border-style: solid;
  border-color: rgb(var(--v-theme-surface)) transparent transparent transparent;
}

.social-link .v-icon {
  color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity));
  transition: 0.2s ease-out;
}

.social-link:hover .v-icon {
  color: rgb(var(--v-theme-primary));
  transform: translateY(-1px);
}
</style>
