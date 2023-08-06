import type { GlobEnvConfig } from '#/config'
import pkg from '../../package.json'

// 用于获取环境变量
const getVariableName = (title: string) => {
  // title = 'VITE_GLOB_APP_TITLE'
  function strToHex(str: string) {
    const result: string[] = []
    for (let i = 0; i < str.length; ++i) {
      const hex = str.charCodeAt(i).toString(16)
      result.push(('000' + hex).slice(-4))
    }
    return result.join('').toUpperCase()
  }

  return `__PRODUCTION__${strToHex(title) || '__APP'}__CONF__`.toUpperCase().replace(/\s/g, '')
}

/** 获取通用存储前缀 */
export function getCommonStoragePrefix() {
  const { VITE_GLOB_APP_TITLE } = getAppEnvConfig()
  return `${VITE_GLOB_APP_TITLE.replace(/\s/g, '_')}__${getEnv()}`.toUpperCase()
}

/** 根据版本生成缓存名 */
export function getStorageShortName() {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase()
}

/** 获取 env 环境变量 */
export function getAppEnvConfig() {
  const ENV_NAME = getVariableName(import.meta.env.VITE_GLOB_APP_TITLE)
  const ENV = (import.meta.env.DEV
    ? // 获取全局配置（打包时将独立提取配置）
      (import.meta.env as unknown as GlobEnvConfig)
    : window[ENV_NAME as any]) as unknown as GlobEnvConfig

  const { VITE_GLOB_APP_TITLE, VITE_GLOB_API_URL, VITE_GLOB_API_URL_PREFIX, VITE_GLOB_UPLOAD_URL } =
    ENV

  return {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
  }
}

/**
 * @description: 开发模式
 */
export const devMode = 'development'

/**
 * @description: 生产模式
 */
export const prodMode = 'production'

/**
 * @description: 获取环境变量
 * @returns:
 * @example:
 */
export function getEnv(): string {
  return import.meta.env.MODE
}

/**
 * @description: 是否是开发模式
 * @returns:
 * @example:
 */
export function isDevMode(): boolean {
  return import.meta.env.DEV
}

/**
 * @description: 是否是生产模式
 * @returns:
 * @example:
 */
export function isProdMode(): boolean {
  return import.meta.env.PROD
}
