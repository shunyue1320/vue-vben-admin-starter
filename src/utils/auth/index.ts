import { CacheTypeEnum, TOKEN_KEY } from '@/enums/cacheEnum'
import { Persistent, BasicKeys } from '@/utils/cache/persistent'
import projectSetting from '@/settings/projectSetting'

// 系统设置中获取权限缓存类型
const { permissionCacheType } = projectSetting
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL

export function getToken() {
  return getAuthCache(TOKEN_KEY)
}

export function getAuthCache<T>(key: BasicKeys) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession
  return fn(key) as T
}

export function setAuthCache(key: BasicKeys, value) {
  const fn = isLocal ? Persistent.setLocal : Persistent.setSession
  return fn(key, value, true)
}

export function clearAuthCache(immediate = true) {
  const fn = isLocal ? Persistent.clearLocal : Persistent.clearSession
  return fn(immediate)
}
