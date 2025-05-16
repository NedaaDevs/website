import { TranslationStatus } from '@crowdin/crowdin-api-client'

// Types
import type { Credentials } from '@crowdin/crowdin-api-client'

const credentials: Credentials = {
  token: import.meta.env.VITE_CROWDIN_API_TOKEN,
}

const translationStatusApi = new TranslationStatus(credentials)
const projectId = Number(import.meta.env.VITE_CROWDIN_PROJECT_ID)

export type LanguageProgress = {
  code: string
  name: string
  progress: number
}

export const crowdinService = {
  getLanguageProgress: async (): Promise<LanguageProgress[]> => {
    try {
      const response = await translationStatusApi.getProjectProgress(projectId)
      const languages: LanguageProgress[] = []

      // TODO: Now source language(English) is not included so this a tmp fix until we know to fetch it.
      languages.push({
        code: 'en',
        name: 'English',
        progress: 100,
      })

      // Add other languages from response
      response.data.forEach((item) => {
        languages.push({
          code: item.data.languageId.toLowerCase(),
          name: item.data.language.name || item.data.languageId, // Use name from API if available
          progress: Math.round(item.data.translationProgress),
        })
      })

      return languages
    } catch (error) {
      console.error('Error fetching Crowdin translation progress:', error)
      throw error
    }
  },
}
