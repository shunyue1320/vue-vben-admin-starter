import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'

import { createRouter, createWebHashHistory } from 'vue-router'
import { basicRoutes } from './routes'

// 白名单应该包含基本静态路由
const WHITE_NAME_LIST: string[] = []
const getRouteNames = (array: any[]) =>
  array.forEach((item) => {
    WHITE_NAME_LIST.push(item.name)
    getRouteNames(item.children || [])
  })
getRouteNames(basicRoutes)

/** 创建路由器 */
export const router = createRouter({
  // 创建一个 hash 历史记录。
  history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
  // 应该添加到路由的初始路由列表。
  routes: basicRoutes as unknown as RouteRecordRaw[], // 强制转换为 unknown 类型，然后再将其转换为 RouteRecordRaw[] 类型，这在编译时不会检查类型是否匹配，而是完全信任开发者自己进行类型转换
  // 是否应该禁止尾部斜杠。默认为假
  strict: true,
  // 指定滚动行为。这个功能只在支持 history.pushState 的浏览器中可用。
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

// 重置路由器
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route
    // 从路由器中删除不在白名单的路由
    if (name && !WHITE_NAME_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

/** 注册路由器 */
export function setupRouter(app: App<Element>) {
  app.use(router)
}
