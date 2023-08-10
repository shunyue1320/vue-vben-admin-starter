import type { Router, RouteLocationRaw } from 'vue-router'

import { useRouter } from 'vue-router'
import { PageEnum } from '@/enums/pageEnum'

export type PathAsPageEnum<T> = T extends { path: string } ? T & { path: PageEnum } : T
export type RouteLocationRawEx = PathAsPageEnum<RouteLocationRaw>

/** 收集跳转报错 */
function handleError(e: Error) {
  console.error(e)
}

export function useGo(_router?: Router) {
  const { push, replace } = _router || useRouter()
  function go(opt: RouteLocationRawEx = PageEnum.BASE_HOME, isReplace = false) {
    isReplace ? replace(opt).catch(handleError) : push(opt).catch(handleError)
  }
  return go
}
