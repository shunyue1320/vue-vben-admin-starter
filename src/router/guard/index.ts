import type { Router } from 'vue-router'

import { setRouteChange } from '@/logics/mitt/routeChange'

// 不要更改下面创建顺序
export function setupRouterGuard(router: Router) {
  createPageGuard(router)
  createScrollGuard(router)
}

/** 通知路由更改, 页面已经加载设置缓存记录 */
function createPageGuard(router: Router) {
  // 用于记录页面是否已经加载
  const loadedPageMap = new Map<string, boolean>()

  router.beforeEach(async (to) => {
    // 页面已经加载，再次打开会更快，不需要进行加载和其他处理
    to.meta.loaded = !!loadedPageMap.get(to.path)

    // 通知路由更改
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
