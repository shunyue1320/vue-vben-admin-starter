import type { ProjectConfig } from '#/config'
import { MenuTypeEnum, MenuModeEnum, TriggerEnum, MixSidebarTriggerEnum } from '@/enums/menuEnum'
import { CacheTypeEnum } from '@/enums/cacheEnum'
import {
  ContentEnum,
  PermissionModeEnum,
  ThemeEnum,
  RouterTransitionEnum,
  SettingButtonPositionEnum,
  SessionTimeoutProcessingEnum,
} from '@/enums/appEnum'
import { SIDE_BAR_BG_COLOR_LIST, HEADER_PRESET_BG_COLOR_LIST } from './designSetting'

const primaryColor = '#0960bd'

// ⚠️注意：更改后需要清除浏览器缓存
const setting: ProjectConfig = {
  // 是否显示配置按钮
  showSettingButton: true,

  // 是否显示主题切换按钮
  showDarkModeToggle: true,

  // `Settings` 按钮位置
  settingButtonPosition: SettingButtonPositionEnum.AUTO,

  // 权限模式
  permissionMode: PermissionModeEnum.ROUTE_MAPPING,

  // 权限相关缓存存储在 sessionStorage 或 localStorage 中
  permissionCacheType: CacheTypeEnum.LOCAL,

  // 会话超时处理
  sessionTimeoutProcessing: SessionTimeoutProcessingEnum.ROUTE_JUMP,

  // 颜色
  themeColor: primaryColor,

  // 网站灰色模式，用于可能悼念的日期开启
  grayMode: false,

  // 色弱模式
  colorWeak: false,

  // 是否取消菜单，顶部，多选项卡页面显示，适用于可能嵌入其他系统
  fullContent: false,

  // 内容模式
  contentMode: ContentEnum.FULL,

  // 是否显示 logo
  showLogo: true,

  // 是否显示页脚
  showFooter: false,

  // 头部配置
  headerSetting: {
    // 头部背景颜色
    bgColor: HEADER_PRESET_BG_COLOR_LIST[0],
    // 固定在顶部
    fixed: true,
    // 是否显示头部
    show: true,
    // 主题
    theme: ThemeEnum.LIGHT,
    // 是否开启锁屏功能
    useLockPage: true,
    // 是否显示全屏按钮
    showFullScreen: true,
    // 是否显示文档按钮
    showDoc: true,
    // 是否显示消息中心按钮
    showNotice: true,
    // 是否显示菜单搜索按钮
    showSearch: true,
  },

  // 菜单配置
  menuSetting: {
    // 菜单背景颜色
    bgColor: SIDE_BAR_BG_COLOR_LIST[0],
    // 是否固定住菜单
    fixed: true,
    // 是否显示折叠菜单按钮
    collapsed: false,
    // 当 sider 因为响应式布局而隐藏时
    collapsedShowTitle: false,
    // 是否可以拖动, 仅限于打开左侧菜单，鼠标在菜单右侧有一个拖动条
    canDrag: false,
    // 是否显示 不存在 dom
    show: true,
    // 是否隐藏 存在 dom
    hidden: false,
    // 菜单宽度
    menuWidth: 210,
    // 菜单模式
    mode: MenuModeEnum.INLINE,
    // 菜单类型
    type: MenuTypeEnum.SIDEBAR,
    // 菜单主题
    theme: ThemeEnum.DARK,
    // 拆分菜单
    split: false,
    // 顶部菜单布局
    topMenuAlign: 'center',
    // 折叠触发器的位置
    trigger: TriggerEnum.HEADER,
    // 打开手风琴模式，只显示一个菜单
    accordion: true,
    // 在路由切换时关闭左侧混合菜单
    closeMixSidebarOnChange: false,
    // 模块打开方法 'click' | 'hover'
    mixSideTrigger: MixSidebarTriggerEnum.CLICK,
    // 修复了扩展菜单
    mixSideFixed: false,
  },

  // 多标签
  multiTabsSetting: {
    cache: false,
    show: true,
    // 是否可以拖放排序选项卡
    canDrag: true,
    // 启用快速操作
    showQuick: true,
    // 是否显示刷新按钮
    showRedo: true,
    // 是否显示折叠按钮
    showFold: true,
  },

  // 动画配置
  transitionSetting: {
    // 是否打开页面切换动画, 禁用状态还将禁用页面加载
    enable: true,

    // 路由基本切换动画: 动画类型 'zoom-fade' | 'zoom-out' | 'fade-slide' | 'fade' | 'fade-bottom' | 'fade-scale'
    basicTransition: RouterTransitionEnum.FADE_SIDE,

    // 是否打开页面切换加载, 仅当 enable= true 时打开
    openPageLoading: true,

    // 是否打开顶部进度条
    openNProgress: false,
  },

  // 是否启用KeepAlive缓存最好在开发期间关闭，否则每次都需要清除缓存
  openKeepAlive: true,

  // 屏幕自动锁定时间，0不锁定屏幕。单位分钟默认值0
  lockTime: 0,

  // 是否显示面包屑
  showBreadCrumb: true,

  // 是否显示面包屑图标
  showBreadCrumbIcon: false,

  // 使用错误处理程序插件
  useErrorHandle: false,

  // 是否打开返回顶部
  useOpenBackTop: true,

  // 是否可以嵌入 iframe 页面
  canEmbedIFramePage: true,

  // 切换接口时是否删除未关闭的消息并通知
  closeMessageOnSwitch: true,

  // 切换接口时是否取消已发送但未响应的http请求。如果启用想覆盖单个接口。可以在单独的界面中设置
  removeAllHttpPending: false,
}

export default setting
