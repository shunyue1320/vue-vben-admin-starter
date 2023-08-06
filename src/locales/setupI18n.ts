import type { App } from 'vue'
import type { I18nOptions } from 'vue-i18n'

import { createI18n } from 'vue-i18n'

import { useLocaleStoreWithOut } from '@/store/modules/locale'
import { setHtmlPageLang, setLoadLocalePool } from './helper'
import { localeSetting } from '@/settings/localeSetting'

const { fallback, availableLocales } = localeSetting

export let i18n: ReturnType<typeof createI18n>

async function createI18nOptions(): Promise<I18nOptions> {
  const localeStore = useLocaleStoreWithOut()
  const locale = localeStore.getLocale
  const defaultLocal = await import(`./lang/${locale}.ts`)
  const message = defaultLocal.default?.message ?? {}

  setHtmlPageLang(locale)
  setLoadLocalePool((loadLocalePool) => {
    loadLocalePool.push(locale)
  })

  return {
    legacy: false,
    locale,
    fallbackLocale: fallback,
    messages: {
      [locale]: message,
    },
    availableLocales: availableLocales,
    sync: true, // 如果您不想从全局范围继承区域设置，则需要将i18n组件选项的sync设置为false。
    silentTranslationWarn: true, // 警告关闭
    missingWarn: false,
    silentFallbackWarn: true,
  }
}

// 使用glob设置i18n实例
export async function setupI18n(app: App) {
  const options = await createI18nOptions()
  i18n = createI18n(options)
  app.use(i18n)
}
