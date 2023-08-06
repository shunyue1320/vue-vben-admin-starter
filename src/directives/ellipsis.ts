/**
 * 实现在元素上自动截取文字，并添加省略号的效果。
 * <div v-ellipsis="{ value: [80, 2], arg: 'multiple' }">{{text}}</div>
 */

import type { CSSProperties, DirectiveBinding, ObjectDirective, App } from 'vue'

interface IValue {
  width?: number
  line?: number
}

interface IOptions {
  [key: string]: CSSProperties
}

const cssProperties: IOptions = {
  single: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  multiple: {
    display: '-webkit-box',
    overflow: 'hidden',
    wordBreak: 'break-all',
  },
}

const Ellipsis: ObjectDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding<Array<IValue>>) {
    const { value = [100, 1], arg = 'single' } = binding
    const [width, line] = value
    Object.entries(cssProperties[arg]).forEach(([key, value]) => {
      el.style[key] = value
    })
    el.style.width = `${width}px`
    if (arg === 'multiple') {
      el.style.webkitLineClamp = `${line}`
      el.style.webkitBoxOrient = 'vertical'
    }
  },
}

export function setupEllipsisDirective(app: App) {
  app.directive('ellipsis', Ellipsis)
}

export default Ellipsis
