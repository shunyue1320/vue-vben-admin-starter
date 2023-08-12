import type { PropType as VuePropType } from 'vue'

declare global {
  declare type PropType<T> = VuePropType<T>
  declare type Nullable<T> = T | null
  declare type Recordable<T = any> = Record<string, T>

  declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>
  }

  declare type TimeoutHandle = ReturnType<typeof setTimeout>
}

declare module 'vue' {
  export type JSXComponent<Props = any> =
    | { new (): ComponentPublicInstance<Props> }
    | FunctionalComponent<Props>
}
