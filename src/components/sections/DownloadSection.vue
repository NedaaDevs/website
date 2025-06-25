<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// Components
import SectionContainer from '@/components/sections/SectionContainer.vue'

// Icons
import {
  mdiApple,
  mdiGooglePlay,
  // mdiGithub,
  // mdiQrcode,
  mdiDownload,
  mdiCellphone,
} from '@mdi/js'

type Props = {
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  id: 'download',
})

const { t } = useI18n()

const downloadOptions = [
  {
    platform: 'iOS',
    icon: mdiApple,
    titleKey: 'download.platforms.ios.title',
    descriptionKey: 'download.platforms.ios.description',
    url: 'https://apps.apple.com/app/nedaa/id6740703900',
    primary: true,
  },
  {
    platform: 'Android',
    icon: mdiGooglePlay,
    titleKey: 'download.platforms.android.title',
    descriptionKey: 'download.platforms.android.description',
    url: 'https://play.google.com/store/apps/details?id=dev.nedaa.app',
    primary: true,
  },
  {
    platform: 'Huawei',
    icon: mdiCellphone,
    titleKey: 'download.platforms.huawei.title',
    descriptionKey: 'download.platforms.huawei.description',
    url: 'https://appgallery.huawei.com/app/C114413901',
    primary: true,
  },
  // GitHub releases - commented out for now until we do artifacts CI
  // {
  //   platform: 'GitHub',
  //   icon: mdiGithub,
  //   titleKey: 'download.platforms.github.title',
  //   descriptionKey: 'download.platforms.github.description',
  //   url: 'https://github.com/nedaadevs/nedaa/releases',
  //   primary: false
  // }
]

const handleDownload = (url: string) => {
  window.open(url, '_blank')
}
</script>

<template>
  <SectionContainer :id="props.id" paddingY="large" background="surface">
    <VContainer>
      <VRow>
        <VCol cols="12" class="text-center mb-8">
          <VIcon :icon="mdiDownload" size="64" color="primary" class="mb-4" />
          <h2 class="text-h3 font-weight-bold mb-4">{{ t('nav.download') }}</h2>
          <p
            class="text-h6 text-medium-emphasis max-width-600 mx-auto"
            style="white-space: normal; word-wrap: break-word"
          >
            {{ t('download.subtitle') }}
          </p>
        </VCol>
      </VRow>

      <VRow class="justify-center">
        <VCol
          v-for="option in downloadOptions"
          :key="option.platform"
          cols="12"
          sm="6"
          md="4"
          class="mb-4"
        >
          <VCard
            :class="[
              'h-100 theme-transition hover-card text-center cursor-pointer',
              option.primary ? 'primary-download' : '',
            ]"
            :elevation="option.primary ? 4 : 2"
            rounded="lg"
            @click="handleDownload(option.url)"
          >
            <VCardItem class="pa-6">
              <div class="mb-4">
                <VIcon
                  :icon="option.icon"
                  size="56"
                  :color="option.primary ? 'primary' : 'secondary'"
                />
              </div>
              <VCardTitle
                class="text-h6 font-weight-bold mb-2"
                style="white-space: normal; word-wrap: break-word; hyphens: auto; line-height: 1.3"
              >
                {{ t(option.titleKey) }}
              </VCardTitle>
              <VCardText
                class="text-body-2 text-medium-emphasis mb-4"
                style="white-space: normal; word-wrap: break-word"
              >
                {{ t(option.descriptionKey) }}
              </VCardText>
              <VBtn
                :color="option.primary ? 'primary' : 'secondary'"
                :variant="option.primary ? 'elevated' : 'tonal'"
                rounded="pill"
                size="large"
                class="mt-2"
              >
                Download
              </VBtn>
            </VCardItem>
          </VCard>
        </VCol>
      </VRow>

      <!-- QR Code Section - Commented out for now -->
      <!--
      <VRow class="mt-8">
        <VCol cols="12" class="text-center">
          <VDivider class="my-8" />
          <div class="d-flex align-center justify-center mb-4">
            <VIcon :icon="mdiQrcode" size="24" color="primary" class="mr-2" />
            <h3 class="text-h6 font-weight-medium">{{ t('download.qr.title') }}</h3>
          </div>
          <p class="text-body-2 text-medium-emphasis mb-6" style="white-space: normal; word-wrap: break-word;">
            {{ t('download.qr.description') }}
          </p>

          <VCard class="mx-auto qr-card" max-width="200" elevation="2" rounded="lg">
            <VCardItem class="pa-4">
              <div class="qr-placeholder">
                <VIcon :icon="mdiQrcode" size="120" color="primary" opacity="0.3" />
              </div>
            </VCardItem>
          </VCard>

          <p class="text-caption text-medium-emphasis mt-4">
            {{ t('download.qr.caption') }}
          </p>
        </VCol>
      </VRow>
      -->
    </VContainer>
  </SectionContainer>
</template>

<style scoped>
.hover-card {
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15) !important;
}

.primary-download {
  border: 2px solid rgb(var(--v-theme-primary));
}

.primary-download:hover {
  box-shadow: 0 12px 40px rgba(var(--v-theme-primary), 0.3) !important;
}

.cursor-pointer {
  cursor: pointer;
}

.max-width-600 {
  max-width: 600px;
}

.qr-card {
  aspect-ratio: 1;
}

.qr-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}
</style>
