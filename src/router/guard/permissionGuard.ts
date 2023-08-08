import type { RouteRecordRaw, Router } from 'vue-router'

import { PageEnum } from '@/enums/pageEnum'
import { RootRoute } from '../routes'

import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic'
import { useUserStoreWithOut } from '@/store/modules/user'
import { usePermissionStoreWithOut } from '@/store/modules/permission'

const ROOT_PATH = RootRoute.path
const LOGIN_PATH = PageEnum.BASE_LOGIN
const whitePathList: PageEnum[] = [LOGIN_PATH]

/** 设置路由前置钩子，监听路由调整，动态添加路由 */
export function createPermissionGuard(router: Router) {
  const userStore = useUserStoreWithOut()
  const permissionStore = usePermissionStoreWithOut()

  router.beforeEach(async (to, from, next) => {
    // 自定义的用户首页（可以每个用户都不相同）
    if (
      from.path === ROOT_PATH &&
      to.path === PageEnum.BASE_HOME &&
      userStore.getUserInfo.homePath &&
      userStore.getUserInfo.homePath !== PageEnum.BASE_HOME
    ) {
      next(userStore.getUserInfo.homePath)
      return
    }

    const token = userStore.getToken

    // 白名单可以直接进入页面
    if (whitePathList.includes(to.path as PageEnum)) {
      // 要跳转到登录页面，但是如果token存在，直接跳转到首页
      if (to.path === LOGIN_PATH && token) {
        const isSessionTimeout = userStore.getSessionTimeout
        try {
          await userStore.afterLoginAction()
          if (!isSessionTimeout) {
            next((to.query?.redirect as string) || '/')
            return
          }
        } catch {
          // not handle
        }
      }
      next()
      return
    }

    // token不存在，跳转到登录页面
    if (!token) {
      // 页面不需要身份验证直接跳转
      if (to.meta.ignoreAuth) {
        next()
        return
      }

      // 重定向登录页面
      const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
        path: LOGIN_PATH,
        replace: true,
      }
      // 重定向到登录页面时，带上当前页面的路径，登录成功后跳转到当前页面
      if (to.path) {
        redirectData.query = {
          redirect: to.path,
        }
      }
      next(redirectData)
      return
    }

    // 处理登录后跳转到404页面
    if (
      from.path === LOGIN_PATH &&
      to.name === PAGE_NOT_FOUND_ROUTE.name &&
      to.fullPath !== (userStore.getUserInfo.homePath || PageEnum.BASE_HOME)
    ) {
      next(userStore.getUserInfo.homePath || PageEnum.BASE_HOME)
      return
    }

    // 在上次获取时间为空时获取userinfo
    if (userStore.getLastUpdateTime === 0) {
      try {
        await userStore.getUserInfoAction()
      } catch (err) {
        next()
        return
      }
    }

    // 已经添加过动态路由则继续
    if (permissionStore.getIsDynamicAddedRoute) {
      next()
      return
    }

    // 添加动态路由
    const routes = await permissionStore.buildRoutesAction()
    routes.forEach((route) => {
      router.addRoute(route as unknown as RouteRecordRaw)
    })
    router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw)
    permissionStore.setDynamicAddedRoute(true) // 设置已经添加过动态路由

    if (to.name === PAGE_NOT_FOUND_ROUTE.name) {
      // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
      next({ path: to.fullPath, replace: true, query: to.query })
    } else {
      // 存在重定向路由则跳转到重定向路由
      const redirectPath = (from.query.redirect || to.path) as string
      const redirect = decodeURIComponent(redirectPath)
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
      next(nextData)
    }
  })
}
