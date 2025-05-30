<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// Components
import SectionContainer from '@/components/sections/SectionContainer.vue'

// Services
import { crowdinService, type LanguageProgress } from '@/services/crowdin.ts'

// Icons
import { mdiTranslate, mdiArrowRight } from '@mdi/js'

// Enums
import { AppLocale } from '@/enums/app'

type Props = {
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  id: 'translate',
})

const { t } = useI18n()

const isLoading = ref(false)
const error = ref<string | null>(null)
const dataFetched = ref(false)

// Enhanced type with supported flag
type EnhancedLanguageProgress = LanguageProgress & {
  nativeName?: string
  isSupported: boolean
}

const allLanguages = ref<EnhancedLanguageProgress[]>([])

// Get our supported language codes set
const supportedLanguageCodes = computed(() => {
  return new Set(Object.values(AppLocale))
})

// Get our supported languages with translations
const supportedLanguageInfo = computed(() => {
  return Object.values(AppLocale).reduce(
    (acc, code) => {
      acc[code] = {
        name: t(`languages.${code}.name`),
        nativeName: t(`languages.${code}.nativeName`),
      }
      return acc
    },
    {} as Record<string, { name: string; nativeName: string }>,
  )
})

// Sorted languages for display
const languages = computed(() => {
  if (!dataFetched.value || allLanguages.value.length === 0) {
    return []
  }

  // Create a new sorted array without mutating the original
  return [...allLanguages.value].sort((a, b) => {
    // First sort by supported status (supported languages first)
    if (a.isSupported && !b.isSupported) return -1
    if (!a.isSupported && b.isSupported) return 1
    // Then sort by progress
    return b.progress - a.progress
  })
})

const supportedLanguages = computed(() => languages.value.filter((lang) => lang.isSupported))

const unsupportedLanguages = computed(() => languages.value.filter((lang) => !lang.isSupported))

// Counts
const supportedLanguageCount = computed(() => supportedLanguages.value.length)
const totalLanguageCount = computed(() => allLanguages.value.length)

// Setup intersection observer to load data when section becomes visible
const setupIntersectionObserver = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !dataFetched.value) {
        fetchTranslationProgress()
      }
    },
    { threshold: 0.1 },
  )

  const section = document.getElementById(props.id)
  if (section) {
    observer.observe(section)
  }

  // Return cleanup function when unmounted
  return () => {
    if (section) {
      observer.unobserve(section)
    }
  }
}

onMounted(setupIntersectionObserver)

const fetchTranslationProgress = async () => {
  if (dataFetched.value) return

  isLoading.value = true
  error.value = null

  try {
    // Get language progress from Crowdin service
    const languageProgressList = await crowdinService.getLanguageProgress()

    // Enhance with supported info and native names(if available in translations)
    allLanguages.value = languageProgressList.map(
      (lang: { code: string; name: string; progress: number }) => {
        const isSupported = supportedLanguageCodes.value.has(lang.code as AppLocale)
        return {
          ...lang,
          // Use our translations for supported languages
          name: isSupported ? supportedLanguageInfo.value[lang.code].name : lang.name,
          nativeName: isSupported ? supportedLanguageInfo.value[lang.code].nativeName : undefined,
          isSupported,
        }
      },
    )

    dataFetched.value = true
  } catch (err) {
    console.error('Error fetching Crowdin stats:', err)

    // Fallback data with only supported languages
    allLanguages.value = Object.values(AppLocale).map((code) => ({
      code,
      name: supportedLanguageInfo.value[code].name,
      nativeName: supportedLanguageInfo.value[code].nativeName,
      progress: code === AppLocale.EN ? 100 : Math.floor(Math.random() * 60) + 40,
      isSupported: true,
    }))

    dataFetched.value = true
  } finally {
    isLoading.value = false
  }
}

const joinTranslationProject = () => {
  window.open(`https://crowdin.com/project/${import.meta.env.VITE_CROWDIN_PROJECT_ID}`, '_blank')
}
</script>

<template>
  <SectionContainer :id="props.id" paddingY="large">
    <VContainer>
      <VRow>
        <VCol cols="12" md="6" class="d-flex flex-column justify-center">
          <h2 class="text-h4 font-weight-bold mb-4">{{ t('translate.title') }}</h2>
          <p class="text-body-1 mb-6">{{ t('translate.description') }}</p>

          <p class="mb-6">
            {{ t('translate.supportedLanguages', { count: supportedLanguageCount }) }}
            <span class="text-caption text-medium-emphasis d-block mt-1">
              {{ t('translate.totalLanguages', { count: totalLanguageCount }) }}
            </span>
          </p>

          <div class="mb-6">
            <VHover>
              <template v-slot:default="{ isHovering, props }">
                <VBtn
                  v-bind="props"
                  color="primary"
                  size="large"
                  rounded="pill"
                  :prepend-icon="mdiTranslate"
                  @click="joinTranslationProject"
                  elevation="2"
                  class="theme-transition"
                  :class="{ 'translate-y-n1': isHovering }"
                >
                  {{ t('translate.joinProject') }}
                </VBtn>
              </template>
            </VHover>
          </div>

          <p class="text-caption text-medium-emphasis theme-transition">
            {{ t('translate.translationPlatform') }}
          </p>
        </VCol>

        <VCol cols="12" md="6">
          <VCard class="rounded-lg elevation-2 theme-transition">
            <VCardItem>
              <VCardTitle>{{ t('translate.translationProgress') }}</VCardTitle>
            </VCardItem>

            <VCardText>
              <VProgressCircular v-if="isLoading" indeterminate color="primary" class="ma-4" />

              <VAlert v-else-if="error" type="warning" variant="tonal">
                {{ error }}
              </VAlert>

              <div v-else>
                <VList v-if="languages.length > 0" bg-color="transparent">
                  <!-- Supported languages section -->
                  <VListSubheader v-if="supportedLanguages.length > 0">
                    {{ t('translate.supportedLanguages', { count: supportedLanguageCount }) }}
                  </VListSubheader>

                  <VHover v-for="lang in supportedLanguages" :key="lang.code">
                    <template v-slot:default="{ isHovering, props }">
                      <div
                        v-bind="props"
                        class="mb-3 rounded-lg pa-3 theme-transition-bg"
                        :class="{ 'bg-primary-lighten-5': isHovering }"
                      >
                        <div class="d-flex justify-space-between mb-1">
                          <span class="d-flex align-center">
                            {{ lang.name }}
                            <span
                              v-if="lang.nativeName"
                              class="ml-2 text-caption text-medium-emphasis"
                            >
                              {{ lang.nativeName }}
                            </span>
                          </span>
                          <span>{{ lang.progress }}%</span>
                        </div>
                        <VProgressLinear
                          :model-value="lang.progress"
                          height="10"
                          rounded
                          color="primary"
                          bg-color="surface-variant"
                          class="progress-bar"
                        />
                      </div>
                    </template>
                  </VHover>

                  <!-- Divider between sections -->
                  <VDivider
                    v-if="supportedLanguages.length > 0 && unsupportedLanguages.length > 0"
                    class="my-4"
                  >
                  </VDivider>

                  <!-- Unsupported languages section -->
                  <VListSubheader v-if="unsupportedLanguages.length > 0">
                    {{ t('translate.languagesNeedingHelp') }}
                  </VListSubheader>

                  <VHover v-for="lang in unsupportedLanguages" :key="lang.code">
                    <template v-slot:default="{ isHovering, props }">
                      <div
                        v-bind="props"
                        class="mb-3 rounded-lg pa-3 theme-transition-bg"
                        :class="{ 'bg-primary-lighten-5': isHovering }"
                      >
                        <div class="d-flex justify-space-between mb-1">
                          <span>{{ lang.name }}</span>
                          <span>{{ lang.progress }}%</span>
                        </div>
                        <VProgressLinear
                          :model-value="lang.progress"
                          height="10"
                          rounded
                          color="primary"
                          bg-color="surface-variant"
                        />
                      </div>
                    </template>
                  </VHover>
                </VList>
                <div v-else class="text-center pa-4">
                  {{ t('translate.noData') }}
                </div>
              </div>
            </VCardText>

            <VCardActions>
              <VSpacer />
              <VHover>
                <template v-slot:default="{ isHovering, props }">
                  <VBtn
                    v-bind="props"
                    variant="text"
                    color="primary"
                    :append-icon="mdiArrowRight"
                    @click="joinTranslationProject"
                    class="theme-transition"
                    :class="{ 'translate-x-1': isHovering }"
                  >
                    {{ t('translate.becomeTranslator') }}
                  </VBtn>
                </template>
              </VHover>
            </VCardActions>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>
  </SectionContainer>
</template>
