import type {
  ProjectConfig,
  HeaderSetting,
  MenuSetting,
  TransitionSetting,
  MultiTabsSetting,
} from '#/config'
import type { BeforeMiniState } from '#/store'

import { defineStore } from 'pinia'

import { ThemeEnum } from '@/enums/appEnum'
import { Persistent } from '@/utils/cache/persistent'
import { PROJ_CFG_KEY, APP_DARK_MODE_KEY } from '@/enums/cacheEnum'
import { darkMode } from '@/settings/designSetting'
import { store } from '@/store'
import { deepMerge } from '@/utils'
import { resetRouter } from '@/router'

interface AppState {
  darkMode?: ThemeEnum
  // 页面加载状态
  pageLoading: boolean
  // 项目配置
  projectConfig: ProjectConfig | null
  // 当窗口缩小时，记住一些状态，并在窗口恢复时恢复这些状态
  beforeMiniInfo: BeforeMiniState
}

let timeId: TimeoutHandle

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    darkMode: undefined,
    pageLoading: false,
    projectConfig: Persistent.getLocal(PROJ_CFG_KEY),
    beforeMiniInfo: {},
  }),
  getters: {
    getPageLoading(state): boolean {
      return state.pageLoading
    },
    getDarkMode(state): 'light' | 'dark' | string {
      return state.darkMode || localStorage.getItem(APP_DARK_MODE_KEY) || darkMode
    },
    getBeforeMiniInfo(state): BeforeMiniState {
      return state.beforeMiniInfo
    },
    getProjectConfig(state): ProjectConfig {
      return state.projectConfig || ({} as ProjectConfig)
    },
    getHeaderSetting(): HeaderSetting {
      return this.getProjectConfig.headerSetting
    },
    getMenuSetting(): MenuSetting {
      return this.getProjectConfig.menuSetting
    },
    getTransitionSetting(): TransitionSetting {
      return this.getProjectConfig.transitionSetting
    },
    getMultiTabsSetting(): MultiTabsSetting {
      return this.getProjectConfig.multiTabsSetting
    },
  },
  actions: {
    setPageLoading(loading: boolean): void {
      this.pageLoading = loading
    },
    setDarkMode(mode: ThemeEnum): void {
      this.darkMode = mode
      localStorage.setItem(APP_DARK_MODE_KEY, mode)
    },
    setBeforeMiniInfo(state: BeforeMiniState): void {
      this.beforeMiniInfo = state
    },
    setProjectConfig(config: DeepPartial<ProjectConfig>): void {
      this.projectConfig = deepMerge(this.projectConfig || {}, config) as ProjectConfig
      Persistent.setLocal(PROJ_CFG_KEY, this.projectConfig)
    },
    setMenuSetting(setting: Partial<MenuSetting>): void {
      this.projectConfig!.menuSetting = deepMerge(this.projectConfig!.menuSetting, setting)
      Persistent.setLocal(PROJ_CFG_KEY, this.projectConfig)
    },
    async resetAllState() {
      resetRouter()
      Persistent.clearAll()
    },
    async setPageLoadingAction(loading: boolean): Promise<void> {
      if (loading) {
        clearTimeout(timeId)
        // 防止 loading 页面闪烁
        timeId = setTimeout(() => {
          this.setPageLoading(loading)
        }, 50)
      } else {
        this.setPageLoading(loading)
        clearTimeout(timeId)
      }
    },
  },
})

// 在 setup 之外使用
export function useAppStoreWithOut() {
  return useAppStore(store)
}
