import { isDevMode } from '@/utils/env'

// 系统默认缓存时间（7天 单位秒）
export const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7

// aes 加密密钥
export const cacheCipher = {
  key: '_11111000001111@',
  iv: '@11111000001111_',
}

// 系统缓存是否使用 aes 加密, 不是开发环境时使用
export const enableStorageEncryption = !isDevMode()
