/**
 * 用于监视路由更改以更改菜单和选项卡的状态。不需要监视路由，因为路由状态的更改会受到页面呈现时间的影响，而页面呈现时间会很慢
 */

import type { RouteLocationNormalized } from 'vue-router'

import { mitt } from '@/utils/mitt'
import { getRawRoute } from '@/utils'

const emitter = mitt()

const key = Symbol()

let lastChangeTab: RouteLocationNormalized

// 触发路由更改
export function setRouteChange(lastChangeRoute: RouteLocationNormalized) {
  const r = getRawRoute(lastChangeRoute)
  emitter.emit(key, r)
  lastChangeTab = r
}

// 监听路由更改
export function listenerRouteChange(
  callback: (route: RouteLocationNormalized) => void,
  immediate = true, // 立即的
) {
  // @ts-ignore
  emitter.on(key, callback)
  immediate && lastChangeTab && callback(lastChangeTab)
}

// 删除路由更改监听
export function removeRouteChangeListener() {
  emitter.clear()
}
