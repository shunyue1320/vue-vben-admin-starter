import type { UserInfo } from '#/store'
import type { ErrorMessageMode } from '#/axios'
import type { GetUserInfoModel, LoginParams } from '@/api/sys/model/userModel'

import { defineStore } from 'pinia'

import { RoleEnum } from '@/enums/roleEnum'
import { store } from '@/store'
import { getAuthCache, setAuthCache } from '@/utils/auth'
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum'
import { doLogout, getUserInfo, loginApi } from '@/api/sys/user'
import { PageEnum } from '@/enums/pageEnum'
import { router } from '@/router'
import { isArray } from '@/utils/is'
import { usePermissionStore } from '@/store/modules/permission'
import { RouteRecordRaw } from 'vue-router'
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic'

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
    async login(
      params: LoginParams & {
        goHome?: boolean
        mode?: ErrorMessageMode
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params
        const data = await loginApi(loginParams, mode)
        const { token } = data

        // 保存 token
        this.setToken(token)
        return this.afterLoginAction(goHome)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    /**
     * 登录之后的操作 路由注册等
     * @param goHome 是否跳转到首页
     */
    async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null
      // 获取用户信息
      const userInfo = await this.getUserInfoAction()

      const sessionTimeout = this.sessionTimeout
      // 如果是因为会话超时而重新登录，则不需要重置路由
      if (sessionTimeout) {
        this.setSessionTimeout(false)
      } else {
        // 重置路由
        const permissionStore = usePermissionStore()
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction()
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw)
          })
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw)
          permissionStore.setDynamicAddedRoute(true)
        }
        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME))
      }
      return userInfo
    },
    /**
     * 请求用户信息，拿到用的角色列表
     * @returns 返回用户信息
     */
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null
      const userInfo = await getUserInfo()
      const { roles = [] } = userInfo
      if (isArray(roles)) {
        const roleList = roles.map((item) => item.value) as RoleEnum[]
        this.setRoleList(roleList)
      } else {
        userInfo.roles = []
        this.setRoleList([])
      }
      this.setUserInfo(userInfo)
      return userInfo
    },
    /**
     * @description: 退出登录
     * @param goHome 是否跳转到登录页
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await doLogout()
        } catch {
          console.log('注销Token失败')
        }
        this.setToken(undefined)
        this.setSessionTimeout(false)
        this.setUserInfo(null)
        goLogin && router.push(PageEnum.BASE_LOGIN)
      }
    },
  },
})

// 在 setup 之外使用
export function useUserStoreWithOut() {
  return useUserStore(store)
}
