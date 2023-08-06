import type { LocaleSetting, LocaleType } from '#/config'

export const LOCALE: { [key: string]: LocaleType } = {
  ZH_CN: 'zh_CN',
  EN_US: 'en',
}

export const localeSetting: LocaleSetting = {
  showPicker: true,
  // Locale
  locale: LOCALE.ZH_CN,
  // Default locale
  fallback: LOCALE.ZH_CN,
  // 可用语言选择设置
  availableLocales: [LOCALE.ZH_CN, LOCALE.EN_US],
}
