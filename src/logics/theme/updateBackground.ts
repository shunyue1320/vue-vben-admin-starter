import { ThemeEnum } from '@/enums/appEnum'
import { useAppStore } from '@/store/modules/app'
import { setCssVar } from './util'
import { colorIsDark, lighten, darken } from '@/utils/color'

const HEADER_BG_COLOR_VAR = '--header-bg-color'
const HEADER_BG_HOVER_COLOR_VAR = '--header-bg-hover-color'
const HEADER_MENU_ACTIVE_BG_COLOR_VAR = '--header-active-menu-bg-color'

const SIDER_DARK_BG_COLOR = '--sider-dark-bg-color'
const SIDER_DARK_DARKEN_BG_COLOR = '--sider-dark-darken-bg-color'
const SIDER_LIGHTEN_BG_COLOR = '--sider-dark-lighten-bg-color'

/**
 * 更改顶部导航的背景色
 * @param color
 */
export function updateHeaderBgColor(color?: string) {
  const appStore = useAppStore()
  const darkMode = appStore.getDarkMode === ThemeEnum.DARK

  if (!color) {
    if (darkMode) {
      color = '#151515'
    } else {
      color = appStore.getHeaderSetting.bgColor
    }
  }

  // 背景颜色
  setCssVar(HEADER_BG_COLOR_VAR, color)

  // 悬停颜色 - 通过主题颜色的明暗来计算
  const hoverColor = lighten(color!, 6)
  setCssVar(HEADER_BG_HOVER_COLOR_VAR, hoverColor)
  setCssVar(HEADER_MENU_ACTIVE_BG_COLOR_VAR, hoverColor)

  // 判断颜色是否是深色，是就切换成深色主题
  const isDark = colorIsDark(color!)
  appStore.setProjectConfig({
    headerSetting: {
      theme: isDark || darkMode ? ThemeEnum.DARK : ThemeEnum.LIGHT,
    },
  })
}

/**
 * 更改左侧菜单的背景色
 * @param color  背景色
 */
export function updateSidebarBgColor(color?: string) {
  const appStore = useAppStore()

  const darkMode = appStore.getDarkMode === ThemeEnum.DARK
  if (!color) {
    if (darkMode) {
      color = '#212121'
    } else {
      color = appStore.getMenuSetting.bgColor
    }
  }

  setCssVar(SIDER_DARK_BG_COLOR, color)
  setCssVar(SIDER_DARK_DARKEN_BG_COLOR, darken(color!, 6))
  setCssVar(SIDER_LIGHTEN_BG_COLOR, lighten(color!, 5))

  // 只有当背景颜色为白色时，菜单的主题才会更改为 light
  const isLight = ['#fff', '#ffffff'].includes(color!.toLowerCase())
  appStore.setProjectConfig({
    menuSetting: {
      theme: isLight && !darkMode ? ThemeEnum.LIGHT : ThemeEnum.DARK,
    },
  })
}
