import type { RouteLocationNormalized } from 'vue-router'
import type { LockInfo, UserInfo } from '#/store'
import type { ProjectConfig } from '#/config'

import { toRaw } from 'vue'
import { pick, omit } from 'lodash-es'

import {
  TOKEN_KEY,
  USER_INFO_KEY,
  ROLES_KEY,
  LOCK_INFO_KEY,
  PROJ_CFG_KEY,
  APP_LOCAL_CACHE_KEY,
  APP_SESSION_CACHE_KEY,
  MULTIPLE_TABS_KEY,
} from '@/enums/cacheEnum'
import { Memory } from './memory'
import { DEFAULT_CACHE_TIME } from '@/settings/encryptionSetting'
import { createLocalStorage, createSessionStorage } from '@/utils/cache'

interface BasicStore {
  [TOKEN_KEY]: string | number | null | undefined // token
  [USER_INFO_KEY]: UserInfo // 用户信息
  [ROLES_KEY]: string[] // 角色信息
  [LOCK_INFO_KEY]: LockInfo // 锁屏信息
  [PROJ_CFG_KEY]: ProjectConfig // 项目配置信息
  [MULTIPLE_TABS_KEY]: RouteLocationNormalized[] // 多标签页列表
}

export type BasicKeys = keyof BasicStore

type LocalStore = BasicStore
type SessionStore = BasicStore

type LocalKeys = keyof LocalStore
type SessionKeys = keyof SessionStore

// 当用户刷新页面，重启浏览器或者关闭打开了该应用程序窗口的标签页时，localMemory 中的数据会丢失，而将其缓存在本地存储中可以保证其可以在下次打开应用程序时被恢复。
const ls = createLocalStorage()
const ss = createSessionStorage()

// 将键值对存储在本地内存中的操作，使得后续读取该 key 对应的 value 时速度更快，因为它不必进行类型转换。
const localMemory = new Memory(DEFAULT_CACHE_TIME)
const sessionMemory = new Memory(DEFAULT_CACHE_TIME)

/** 初始化持久数据 */
function initPersistentMemory() {
  const localCache = ls.get(APP_LOCAL_CACHE_KEY)
  const sessionCache = ss.get(APP_SESSION_CACHE_KEY)
  localCache && localMemory.resetCache(localCache)
  sessionCache && sessionMemory.resetCache(sessionCache)
}

export class Persistent {
  static getLocal<T>(key: LocalKeys) {
    return localMemory.get(key)?.value as Nullable<T>
  }

  static setLocal(key: LocalKeys, value: LocalStore[LocalKeys], immediate = false): void {
    localMemory.set(key, toRaw(value))
    immediate && ls.set(APP_LOCAL_CACHE_KEY, localMemory.getCache)
  }

  static removeLocal(key: LocalKeys, immediate = false): void {
    localMemory.remove(key)
    immediate && ls.set(APP_LOCAL_CACHE_KEY, localMemory.getCache)
  }

  static clearLocal(immediate = false): void {
    localMemory.clear()
    immediate && ls.clear()
  }

  static getSession<T>(key: SessionKeys) {
    return sessionMemory.get(key)?.value as Nullable<T>
  }

  static setSession(key: SessionKeys, value: SessionStore[SessionKeys], immediate = false): void {
    sessionMemory.set(key, toRaw(value))
    immediate && ss.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache)
  }

  static removeSession(key: SessionKeys, immediate = false): void {
    sessionMemory.remove(key)
    immediate && ss.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache)
  }

  static clearSession(immediate = false): void {
    sessionMemory.clear()
    immediate && ss.clear()
  }

  static clearAll(immediate = false) {
    sessionMemory.clear()
    localMemory.clear()
    if (immediate) {
      ls.clear()
      ss.clear()
    }
  }
}

function beforeunloadChange() {
  // TOKEN_KEY 在登录或注销时已经写入到storage了，此处为了解决同时打开多个窗口时token不同步的问题
  // LOCK_INFO_KEY 在锁屏和解锁时写入，此处也不应修改
  ls.set(APP_LOCAL_CACHE_KEY, {
    ...omit(localMemory.getCache, LOCK_INFO_KEY),
    ...pick(ls.get(APP_LOCAL_CACHE_KEY), [TOKEN_KEY, USER_INFO_KEY, LOCK_INFO_KEY]),
  })
  ss.set(APP_SESSION_CACHE_KEY, {
    ...omit(sessionMemory.getCache, LOCK_INFO_KEY),
    ...pick(ss.get(APP_SESSION_CACHE_KEY), [TOKEN_KEY, USER_INFO_KEY, LOCK_INFO_KEY]),
  })
}

function storageChange(e: StorageEvent) {
  const { key, newValue, oldValue } = e

  // 如果其他标签页执行了 clear 清除缓存, 则本标签页也清除缓存
  if (!key) {
    Persistent.clearAll()
    return
  }

  // 如果其他标签页修改了 APP_LOCAL_CACHE_KEY 和 APP_SESSION_CACHE_KEY 则清除对应缓存
  if (!!newValue && !!oldValue) {
    if (APP_LOCAL_CACHE_KEY === key) {
      Persistent.clearLocal()
    }
    if (APP_SESSION_CACHE_KEY === key) {
      Persistent.clearSession()
    }
  }
}

// 浏览器即将卸载页面之前触发: 删除
window.addEventListener('beforeunload', beforeunloadChange)
// 同一域名下的不同窗口或标签页之间共享相同的 localStorage 数据时，当其中一个窗口更新了 localStorage 数据时会触发 storage 事件
window.addEventListener('storage', storageChange)

initPersistentMemory()
