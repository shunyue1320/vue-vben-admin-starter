import type { LocaleSetting, LocaleType } from '#/config'

import { defineStore } from 'pinia'

import { createLocalStorage } from '@/utils/cache'
import { LOCALE_KEY } from '@/enums/cacheEnum'
import { localeSetting } from '@/settings/localeSetting'
import { store } from '@/store'

interface LocaleState {
  localInfo: LocaleSetting
}

const ls = createLocalStorage()
const lsLocaleSetting = (ls.get(LOCALE_KEY) || localeSetting) as LocaleSetting

export const useLocaleStore = defineStore({
  id: 'app-locale',
  state: (): LocaleState => ({
    localInfo: lsLocaleSetting,
  }),
  getters: {
    getShowPicker(state): boolean {
      return !!state.localInfo?.showPicker
    },
    getLocale(state): LocaleType {
      return state.localInfo?.locale ?? 'zh_CN'
    },
  },
  actions: {
    /**
     * 设置多语言信息和缓存
     * @param info 多语言信息
     */
    setLocaleInfo(info: Partial<LocaleSetting>): void {
      this.localInfo = { ...this.localInfo, ...info }
      ls.set(LOCALE_KEY, this.localInfo)
    },
    /**
     * 初始化多语言信息并从本地缓存加载现有配置
     */
    initLocale(): void {
      this.setLocaleInfo({
        ...lsLocaleSetting,
        ...this.localInfo,
      })
    },
  },
})

// 在 setup 之外使用
export function useLocaleStoreWithOut() {
  return useLocaleStore(store)
}
