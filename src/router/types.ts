import type { RouteRecordRaw, RouteMeta } from 'vue-router'

import { defineComponent } from 'vue'
import { RoleEnum } from '@/enums/roleEnum'

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

// @ts-ignore
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  name: string
  meta: RouteMeta
  component?: Component | string
  components?: Component
  children?: AppRouteRecordRaw[]
  props?: Recordable
  fullPath?: string
}
export type AppRouteModule = AppRouteRecordRaw

export interface MenuTag {
  type?: 'primary' | 'error' | 'warn' | 'success'
  content?: string
  dot?: boolean
}

export interface Menu {
  name: string

  icon?: string

  path: string

  // path contains param, auto assignment.
  paramPath?: string

  disabled?: boolean

  children?: Menu[]

  orderNo?: number

  roles?: RoleEnum[]

  meta?: Partial<RouteMeta>

  tag?: MenuTag

  hideMenu?: boolean
}
