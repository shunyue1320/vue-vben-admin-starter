export type LocaleType = 'zh_CN' | 'en' | 'ru' | 'ja' | 'ko'

export interface LocaleSetting {
  // 显示选择器
  showPicker: boolean
  // 当前语言
  locale: LocaleType
  // 默认语言
  fallback: LocaleType
  // 可用区域设置
  availableLocales: LocaleType[]
}

export interface GlobEnvConfig {
  // Site title
  VITE_GLOB_APP_TITLE: string
  // Service interface url
  VITE_GLOB_API_URL: string
  // Service interface url prefix
  VITE_GLOB_API_URL_PREFIX?: string
  // Upload url
  VITE_GLOB_UPLOAD_URL?: string
}
