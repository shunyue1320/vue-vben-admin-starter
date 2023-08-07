import type { ProjectConfig } from '#/config'

import { useAppStore } from '@/store/modules/app'
import { useLocaleStore } from '@/store/modules/locale'
import { Persistent } from '@/utils/cache/persistent'
import { getCommonStoragePrefix, getStorageShortName } from '@/utils/env'
import { PROJ_CFG_KEY } from '@/enums/cacheEnum'
import { deepMerge } from '@/utils'
import projectSetting from '@/settings/projectSetting'
import { updateGrayMode } from './theme/updateGrayMode'
import { updateColorWeak } from './theme/updateColorWeak'
import { updateDarkTheme } from './theme/dark'
import { ThemeEnum } from '@/enums/appEnum'
import { updateHeaderBgColor, updateSidebarBgColor } from './theme/updateBackground'

/** 初始项目配置 */
export function initAppConfigStore() {
  const localeStore = useLocaleStore()
  const appStore = useAppStore()

  let projCfg: ProjectConfig = Persistent.getLocal(PROJ_CFG_KEY) as ProjectConfig
  projCfg = deepMerge(projectSetting, projCfg || {})

  const darkMode = appStore.getDarkMode
  const {
    colorWeak,
    grayMode,
    headerSetting: { bgColor: headerBgColor } = {},
    menuSetting: { bgColor } = {},
  } = projCfg

  try {
    grayMode && updateGrayMode(grayMode) // 更新 dom 灰色模式
    colorWeak && updateColorWeak(colorWeak) // 更新 dom 色弱模式
  } catch (error) {
    console.log(error)
  }

  // 设置项目配置： 本地缓存有取本地缓存，否则取 @/settings/projectSetting
  appStore.setProjectConfig(projCfg)

  // 设置黑暗模式主题
  updateDarkTheme(darkMode)
  if (darkMode === ThemeEnum.DARK) {
    updateHeaderBgColor()
    updateSidebarBgColor()
  } else {
    headerBgColor && updateHeaderBgColor(headerBgColor)
    bgColor && updateSidebarBgColor(bgColor)
  }

  // 初始化语言设置： 本地缓存有取本地缓存，否则取 @/settings/localeSetting
  localeStore.initLocale()

  setTimeout(() => {
    clearObsoleteStorage()
  }, 16)
}

/** 删除历史版本的项目设置缓存 */
export function clearObsoleteStorage() {
  const commonPrefix = getCommonStoragePrefix()
  const shortPrefix = getStorageShortName()

  ;[localStorage, sessionStorage].forEach((item: Storage) => {
    Object.keys(item).forEach((key) => {
      if (key && key.startsWith(commonPrefix) && !key.startsWith(shortPrefix)) {
        item.removeItem(key)
      }
    })
  })
}
