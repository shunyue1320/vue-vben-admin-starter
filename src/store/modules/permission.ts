import type { AppRouteRecordRaw, Menu } from '@/router/types'

import { toRaw } from 'vue'
import { defineStore } from 'pinia'

import { useAppStore } from './app'
import { useUserStore } from './user'
import projectSetting from '@/settings/projectSetting'
import { PermissionModeEnum } from '@/enums/appEnum'
import { asyncRoutes } from '@/router/routes'
import { filter } from '@/utils/helper/treeHelper'
import { flatMultiLevelRoutes } from '@/router/helper/routeHelper'
import { transformRouteToMenu } from '@/router/helper/menuHelper'
import { ERROR_LOG_ROUTE } from '@/router/routes/basic'
import { PageEnum } from '@/enums/pageEnum'
import { store } from '@/store'

interface PermissionState {
  // Permission code list
  // 权限代码列表
  permCodeList: string[] | number[]
  // Whether the route has been dynamically added
  // 路由是否动态添加
  isDynamicAddedRoute: boolean
  // To trigger a menu update
  // 触发菜单更新
  lastBuildMenuTime: number
  // Backstage menu list
  // 后台菜单列表
  backMenuList: Menu[]
  // 菜单列表
  frontMenuList: Menu[]
}

export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    // 权限代码列表
    permCodeList: [],
    // Whether the route has been dynamically added
    // 路由是否动态添加
    isDynamicAddedRoute: false,
    // To trigger a menu update
    // 触发菜单更新
    lastBuildMenuTime: 0,
    // Backstage menu list
    // 后台菜单列表
    backMenuList: [],
    // menu List
    // 菜单列表
    frontMenuList: [],
  }),
  getters: {
    getPermCodeList(state): string[] | number[] {
      return state.permCodeList
    },
    getBackMenuList(state): Menu[] {
      return state.backMenuList
    },
    getFrontMenuList(state): Menu[] {
      return state.frontMenuList
    },
    getLastBuildMenuTime(state): number {
      return state.lastBuildMenuTime
    },
    getIsDynamicAddedRoute(state): boolean {
      return state.isDynamicAddedRoute
    },
  },
  actions: {
    setFrontMenuList(list: Menu[]) {
      this.frontMenuList = list
    },
    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added
    },
    async buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
      const appStore = useAppStore()
      const userStore = useUserStore()

      let routes: AppRouteRecordRaw[] = []
      const roleList = toRaw(userStore.getRoleList) || []
      const { permissionMode = projectSetting.permissionMode } = appStore.getProjectConfig

      // 路由过滤器 在函数 filter 作为回调传入遍历使用
      const routeFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route
        // 抽出角色
        const { roles } = meta || {}
        if (!roles) return true
        // 进行角色权限判断
        return roleList.some((role) => roles.includes(role))
      }

      const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route
        // ignoreRoute 为 true 则路由仅用于菜单生成，不会在实际的路由表中出现
        const { ignoreRoute } = meta || {}
        // arr.filter 返回 true 表示该元素通过测试
        return !ignoreRoute
      }

      switch (permissionMode) {
        // 角色权限
        case PermissionModeEnum.ROLE:
          // 对非一级路由进行过滤
          routes = filter(asyncRoutes, routeFilter)
          // 对一级路由根据角色权限过滤
          routes = routes.filter(routeFilter)
          // 将多级路由转换为 2 级路由
          routes = flatMultiLevelRoutes(routes)
          break

        // 路由映射（默认进入该case）
        case PermissionModeEnum.ROUTE_MAPPING:
          // 对非一级路由进行过滤
          routes = filter(asyncRoutes, routeFilter)
          // 对一级路由再次根据角色权限过滤
          routes = routes.filter(routeFilter)
          // 将路由转换成菜单
          const menuList = transformRouteToMenu(routes, true)
          // 移除掉 ignoreRoute: true 的路由 非一级路由
          routes = filter(routes, routeRemoveIgnoreFilter)
          // 移除掉 ignoreRoute: true 的路由 一级路由；
          routes = routes.filter(routeRemoveIgnoreFilter)
          // 对菜单进行排序
          menuList.sort((a, b) => {
            return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0)
          })
          // 设置菜单列表
          this.setFrontMenuList(menuList)
          // 将多级路由转换为 2 级路由
          routes = flatMultiLevelRoutes(routes)
          break

        // 如果确定不需要做后台动态权限，请在下方注释整个判断
        // case PermissionModeEnum.BACK:
        // const { createMessage } = useMessage()
        // createMessage.loading({
        //   content: t('sys.app.menuLoading'),
        //   duration: 1,
        // })
        // // 模拟从后台获取权限码，
        // // 这个功能可能只需要执行一次，实际项目可以自己放在合适的时间
        // let routeList: AppRouteRecordRaw[] = []
        // try {
        //   await this.changePermissionCode()
        //   routeList = (await getMenuList()) as AppRouteRecordRaw[]
        // } catch (error) {
        //   console.error(error)
        // }
        // // 动态引入组件
        // routeList = transformObjToRoute(routeList)
        // //  后台路由到菜单结构
        // const backMenuList = transformRouteToMenu(routeList)
        // this.setBackMenuList(backMenuList)
        // // 删除 meta.ignoreRoute 项
        // routeList = filter(routeList, routeRemoveIgnoreFilter)
        // routeList = routeList.filter(routeRemoveIgnoreFilter)
        // routeList = flatMultiLevelRoutes(routeList)
        // routes = [PAGE_NOT_FOUND_ROUTE, ...routeList]
        // break
      }

      /** 根据设置的首页path，修正routes中的affix标记（固定首页） */
      const patchHomeAffix = (routes: AppRouteRecordRaw[]) => {
        if (!routes || routes.length === 0) return
        // 获取该用户的首页路径
        let homePath: string = userStore.getUserInfo.homePath || PageEnum.BASE_HOME

        function patcher(routes: AppRouteRecordRaw[], parentPath = '') {
          if (parentPath) parentPath = parentPath + '/'
          routes.forEach((route: AppRouteRecordRaw) => {
            const { path, children, redirect } = route
            const currentPath = path.startsWith('/') ? path : parentPath + path
            // 找到是当前用户首页的路由
            if (currentPath === homePath) {
              // 如果是重定向路由，那么将首页设置成重定向的目标路由
              if (redirect) {
                homePath = route.redirect! as string
                // 还要去寻找首页路由，设置首页路由 { affix: true } 到导航栏的顶部位置
              }
              // 设置当前用户首页到导航栏的顶部位置
              else {
                route.meta = Object.assign({}, route.meta, { affix: true })
                throw new Error('end')
              }
            }
            children && children.length > 0 && patcher(children, currentPath)
          })
        }

        try {
          patcher(routes)
        } catch (e) {
          // 已处理完毕跳出循环 （这里利用报错来跳出递归逻辑，类似 for 的 break）
        }
        return
      }

      // 添加错误日志路由
      routes.push(ERROR_LOG_ROUTE)
      patchHomeAffix(routes)
      return routes
    },
  },
})

// 需要在 setup 之外使用
export function usePermissionStoreWithOut() {
  return usePermissionStore(store)
}
