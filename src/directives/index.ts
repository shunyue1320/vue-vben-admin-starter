/**
 * 配置和注册全局指令
 */
import type { App } from 'vue'
import { setupEllipsisDirective } from './ellipsis'

export function setupGlobDirectives(app: App) {
  setupEllipsisDirective(app) // 实现在元素上自动截取文字，并添加省略号的效果。
}
