import type { InjectionKey, UnwrapRef } from 'vue'

import { inject, reactive, readonly as defineReadonly, provide } from 'vue'

type ShallowUnwrap<T> = {
  [P in keyof T]: UnwrapRef<T[P]>
}

export interface CreateContextOptions {
  readonly?: boolean // 是否只读
  createProvider?: boolean // 是否创建provider
  native?: boolean // 是否原生
}

export function createContext<T>(
  context: any,
  key: InjectionKey<T> = Symbol(),
  options: CreateContextOptions = {},
) {
  const { readonly = true, createProvider = true, native = false } = options
  const state = reactive(context)
  const provideData = readonly ? defineReadonly(state) : state
  createProvider && provide(key, native ? state : provideData)
  return { state }
}

export function useContext<T>(key: InjectionKey<T>, native?: boolean): T
export function useContext<T>(
  key: InjectionKey<T> = Symbol(),
  defaultValue: any,
): ShallowUnwrap<T> {
  return inject(key, defaultValue || {})
}
