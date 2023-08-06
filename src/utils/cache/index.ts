import type { CreateStorageParams } from './storageCache'

import { createStorage as create } from './storageCache'
import { enableStorageEncryption, DEFAULT_CACHE_TIME } from '@/settings/encryptionSetting'
import { getStorageShortName } from '@/utils/env'

export type Options = Partial<CreateStorageParams>

const createOptions = (storage: Storage, options: Options = {}): Options => {
  return {
    // 调试模式下没有加密
    hasEncrypt: enableStorageEncryption,
    timeout: DEFAULT_CACHE_TIME, // 缓存时间
    storage, // 缓存方式
    prefixKey: getStorageShortName(), // 缓存前缀
    ...options,
  }
}

export const createStorage = (storage: Storage = sessionStorage, options: Options = {}) => {
  return create(createOptions(storage, options))
}

export const createLocalStorage = (options: Options = {}) => {
  return createStorage(localStorage, { ...options, timeout: DEFAULT_CACHE_TIME })
}

export const createSessionStorage = (options: Options = {}) => {
  return createStorage(sessionStorage, { ...options, timeout: DEFAULT_CACHE_TIME })
}

export const WebStorage = create(createOptions(sessionStorage))
export default WebStorage
