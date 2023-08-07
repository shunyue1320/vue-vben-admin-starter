import { AppRouteRecordRaw } from '@/router/types'

import { t } from '@/hooks/web/useI18n'
import { PageEnum } from '@/enums/pageEnum'

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
