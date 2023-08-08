import type { Router } from 'vue-router'

import { setRouteChange } from '@/logics/mitt/routeChange'
import { createPermissionGuard } from './permissionGuard'

// 不要更改下面创建顺序
export function setupRouterGuard(router: Router) {
  createPageGuard(router)
  createScrollGuard(router)
  createPermissionGuard(router) // 设置路由前置钩子，监听路由调整，动态添加路由
}

/** 监听路由更改, 并将已经加载好的页面设置缓存记录 */
function createPageGuard(router: Router) {
  // 用于记录页面是否已经加载
  const loadedPageMap = new Map<string, boolean>()

  router.beforeEach(async (to) => {
    // 页面已经加载，再次打开会更快，不需要进行加载和其他处理
    to.meta.loaded = !!loadedPageMap.get(to.path)

    // 监听路由更改
    setRouteChange(to)

    return true
  })

  router.afterEach((to) => {
    loadedPageMap.set(to.path, true)
  })
}

// 哈希路由切换时回到顶部
function createScrollGuard(router: Router) {
  const isHash = (href: string) => /^#/.test(href)

  const body = document.body

  router.afterEach((to) => {
    // @ts-ignore
    isHash((to as RouteLocationNormalized & { href: string })?.href) && body.scrollTo(0, 0)
    return true
  })
}
