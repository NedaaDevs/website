<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, type LocationQueryValue } from 'vue-router'
import { useI18n } from 'vue-i18n'

import PageContainer from '@/components/layout/PageContainer.vue'
import { useAppStore } from '@/stores/app'
import { AppLocale } from '@/enums/app'
import { useThemedLogo } from '@/composables/useThemedLogo'

import { mdiApple, mdiGooglePlay, mdiCellphone } from '@mdi/js'

const route = useRoute()
const { t } = useI18n()
const { setLocale } = useAppStore()
const { logoSrc } = useThemedLogo()

const STORE_LINKS = {
  ios: 'https://apps.apple.com/app/nedaa/id6740703900',
  android: 'https://play.google.com/store/apps/details?id=dev.nedaa.android',
  huawei: 'https://appgallery.huawei.com/app/C114573733',
} as const

type Platform = 'ios' | 'android' | 'huawei' | null

const detectedPlatform = ref<Platform>(null)
const showAllStores = ref(false)
const ready = ref(false)
let redirectTimer: ReturnType<typeof setTimeout> | undefined

const PLATFORM_META: Record<'ios' | 'android' | 'huawei', { icon: string; label: string }> = {
  ios: { icon: mdiApple, label: 'iPhone/iPad' },
  android: { icon: mdiGooglePlay, label: 'Android' },
  huawei: { icon: mdiCellphone, label: 'Huawei' },
}

const storeCards = [
  {
    platform: 'ios' as const,
    icon: mdiApple,
    titleKey: 'download.platforms.ios.title',
    descriptionKey: 'download.platforms.ios.description',
    url: STORE_LINKS.ios,
  },
  {
    platform: 'android' as const,
    icon: mdiGooglePlay,
    titleKey: 'download.platforms.android.title',
    descriptionKey: 'download.platforms.android.description',
    url: STORE_LINKS.android,
  },
  {
    platform: 'huawei' as const,
    icon: mdiCellphone,
    titleKey: 'download.platforms.huawei.title',
    descriptionKey: 'download.platforms.huawei.description',
    url: STORE_LINKS.huawei,
  },
]

/**
 * Detect the user's mobile platform using modern Client Hints API
 * with fallback to legacy userAgent string parsing.
 *
 * Priority: Huawei > iOS > Android > null (desktop/unknown)
 *
 * Uses navigator.userAgentData (Chromium) when available for
 * privacy-respecting structured detection, then falls back to
 * regex on navigator.userAgent for Safari/Firefox.
 */
function detectPlatform(): Platform {
  const ua = navigator.userAgent

  // Huawei check first (must precede Android since Huawei devices include "Android")
  if (/HuaweiMobile|HMSCore/i.test(ua)) return 'huawei'

  // iOS: iPhone, iPad, iPod via UA string
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios'

  // iPadOS 13+ reports as Macintosh — detect via touch support
  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return 'ios'

  // Android: try modern Client Hints API first (Chromium browsers)
  const uaData = (
    navigator as Navigator & { userAgentData?: { platform: string; mobile: boolean } }
  ).userAgentData
  if (uaData) {
    if (uaData.platform === 'Android' || (uaData.mobile && /Android/i.test(ua))) {
      return 'android'
    }
  }

  // Fallback: legacy UA string for Android
  if (/Android/i.test(ua)) return 'android'

  return null
}

const storeName = computed(() => {
  if (!detectedPlatform.value) return ''
  return t(`downloadPage.storeName.${detectedPlatform.value}`)
})

const platformLabel = computed(() =>
  detectedPlatform.value ? PLATFORM_META[detectedPlatform.value].label : '',
)

const redirectIcon = computed(() =>
  detectedPlatform.value ? PLATFORM_META[detectedPlatform.value].icon : '',
)

const isRedirecting = computed(() => detectedPlatform.value !== null && !showAllStores.value)

function cancelRedirect() {
  if (redirectTimer) {
    clearTimeout(redirectTimer)
    redirectTimer = undefined
  }
  showAllStores.value = true
}

function handleDownload(url: string) {
  window.open(url, '_blank')
}

onMounted(() => {
  const langParam = route.query.lang as LocationQueryValue
  if (langParam && Object.values(AppLocale).includes(langParam as AppLocale)) {
    setLocale(langParam)
  }

  detectedPlatform.value = detectPlatform()

  if (detectedPlatform.value) {
    const storeUrl = STORE_LINKS[detectedPlatform.value]
    redirectTimer = setTimeout(() => {
      window.location.href = storeUrl
    }, 1500)
  }

  // Trigger entrance animation
  requestAnimationFrame(() => {
    ready.value = true
  })
})

onUnmounted(() => {
  if (redirectTimer) {
    clearTimeout(redirectTimer)
  }
})
</script>

<template>
  <div>
    <PageContainer max-width="900px">
      <!-- Redirect Screen (mobile detected) -->
      <div
        v-if="isRedirecting"
        class="d-flex flex-column align-center justify-center text-center redirect-screen"
        :class="{ 'fade-in': ready }"
      >
        <VImg :src="logoSrc" :alt="t('app.name')" height="80" width="80" class="mb-8 logo-image" />

        <div class="redirect-icon-ring mb-6">
          <VIcon :icon="redirectIcon" size="40" color="primary" />
        </div>

        <h1 class="text-h5 font-weight-bold mb-3 theme-transition-text">
          {{ t('downloadPage.redirecting', { store: storeName }) }}
        </h1>

        <a
          :href="STORE_LINKS[detectedPlatform!]"
          class="text-primary text-body-1 mb-6 redirect-link"
        >
          {{ t('downloadPage.clickHere') }}
        </a>

        <VDivider class="my-2 mx-auto" style="max-width: 200px; opacity: 0.3" />

        <VBtn
          variant="outlined"
          color="primary"
          size="small"
          rounded="pill"
          class="text-none mt-4"
          @click="cancelRedirect"
        >
          {{ t('downloadPage.notOnPlatform', { platform: platformLabel }) }}
        </VBtn>
      </div>

      <!-- Full Download Page (desktop or "show all") -->
      <div v-else class="py-12" :class="{ 'fade-in': ready }">
        <div class="text-center mb-10">
          <VImg
            :src="logoSrc"
            :alt="t('app.name')"
            height="80"
            width="80"
            class="mb-6 mx-auto logo-image"
          />

          <h1 class="text-h3 font-weight-bold mb-3 theme-transition-text">
            {{ t('downloadPage.title') }}
          </h1>

          <p
            class="text-body-1 text-medium-emphasis max-width-600 mx-auto"
            style="white-space: normal; word-wrap: break-word"
          >
            {{ t('downloadPage.subtitle') }}
          </p>
        </div>

        <VRow class="justify-center">
          <VCol
            v-for="(card, index) in storeCards"
            :key="card.platform"
            cols="12"
            sm="6"
            md="4"
            class="mb-4"
          >
            <VCard
              :class="[
                'h-100 theme-transition text-center cursor-pointer',
                index < 2 ? 'hover-card--primary' : 'hover-card',
              ]"
              :elevation="index < 2 ? 4 : 2"
              rounded="lg"
              role="link"
              :aria-label="t(card.titleKey)"
              tabindex="0"
              @click="handleDownload(card.url)"
              @keydown.enter="handleDownload(card.url)"
              @keydown.space.prevent="handleDownload(card.url)"
            >
              <VCardItem class="pa-6">
                <div class="mb-4">
                  <VIcon
                    :icon="card.icon"
                    :size="index < 2 ? 56 : 48"
                    :color="index < 2 ? 'primary' : 'secondary'"
                  />
                </div>
                <VCardTitle
                  class="text-h6 font-weight-bold mb-2"
                  style="
                    white-space: normal;
                    word-wrap: break-word;
                    hyphens: auto;
                    line-height: 1.3;
                  "
                >
                  {{ t(card.titleKey) }}
                </VCardTitle>
                <VCardText
                  class="text-body-2 text-medium-emphasis mb-4"
                  style="white-space: normal; word-wrap: break-word"
                >
                  {{ t(card.descriptionKey) }}
                </VCardText>
                <VBtn
                  :color="index < 2 ? 'primary' : 'secondary'"
                  :variant="index < 2 ? 'elevated' : 'tonal'"
                  rounded="pill"
                  size="large"
                  class="mt-2"
                >
                  {{ t('cta.downloadNow') }}
                </VBtn>
              </VCardItem>
            </VCard>
          </VCol>
        </VRow>
      </div>
    </PageContainer>
  </div>
</template>

<style scoped>
/* Entrance animation */
.fade-in {
  animation: fadeSlideUp 0.4s ease-out both;
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Redirect screen */
.redirect-screen {
  min-height: 60vh;
  padding: 2rem 1rem;
}

.redirect-icon-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 2px solid rgb(var(--v-theme-primary));
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse-ring 1.5s ease-in-out infinite;
}

@keyframes pulse-ring {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0.3);
  }
  50% {
    box-shadow: 0 0 0 12px rgba(var(--v-theme-primary), 0);
  }
}

.redirect-link {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.redirect-link:hover {
  opacity: 0.8;
}
</style>
