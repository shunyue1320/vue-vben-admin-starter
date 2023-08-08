import type { UserInfo } from '#/store'

import { defineStore } from 'pinia'

import { RoleEnum } from '@/enums/roleEnum'
import { store } from '@/store'
import { getAuthCache, setAuthCache } from '@/utils/auth'
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum'

interface UserState {
  userInfo: Nullable<UserInfo>
  token?: string
  roleList: RoleEnum[]
  sessionTimeout: boolean
  lastUpdateTime: number
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    userInfo: null,
    token: undefined,
    roleList: [], // 角色列表
    sessionTimeout: false, // 会话是否超时
    lastUpdateTime: 0, // 上次更新时间
  }),
  getters: {
    getUserInfo(state): UserInfo {
      return state.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {}
    },
    getToken(state): string {
      return state.token || getAuthCache<string>(TOKEN_KEY)
    },
    getRoleList(state): RoleEnum[] {
      return state.roleList.length > 0 ? state.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY)
    },
    getSessionTimeout(state): boolean {
      return state.sessionTimeout
    },
    getLastUpdateTime(state): number {
      return state.lastUpdateTime
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ?? '' // 对于null或未定义的值，将其设置为空字符串
      setAuthCache(TOKEN_KEY, this.token)
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList
      setAuthCache(ROLES_KEY, roleList)
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info
      this.lastUpdateTime = new Date().getTime()
      setAuthCache(USER_INFO_KEY, info)
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag
    },
    resetState() {
      this.userInfo = null
      this.token = ''
      this.roleList = []
      this.sessionTimeout = false
    },
  },
})

// 在 setup 之外使用
export function useUserStoreWithOut() {
  return useUserStore(store)
}
