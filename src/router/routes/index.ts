import type { AppRouteModule, AppRouteRecordRaw } from '@/router/types'

import { t } from '@/hooks/web/useI18n'
import { PageEnum } from '@/enums/pageEnum'

// 遍历目录导入路由（import.meta.glob() 直接引入文件夹下所有的模块 Vite 独有的功能）
const modules = import.meta.glob('./modules/**/*.ts', { eager: true })
const routeModuleList: AppRouteModule[] = []
Object.keys(modules).forEach((key) => {
  const mod = (modules as Recordable)[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routeModuleList.push(...modList)
})

export const asyncRoutes = [...routeModuleList]

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/sys/login/Login.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
}

// 根路由
export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
}

// 未经许可的基本路由
export const basicRoutes = [
  LoginRoute,
  RootRoute,
  // REDIRECT_ROUTE, // 重定向路由
  // PAGE_NOT_FOUND_ROUTE, // 404页面
]
