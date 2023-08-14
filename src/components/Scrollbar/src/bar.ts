/**
 * @description 滚动条
 */
import {
  Ref,
  computed,
  defineComponent,
  getCurrentInstance,
  inject,
  onUnmounted,
  ref,
  h,
} from 'vue'
import { on, off } from '@/utils/domUtils'
import { renderThumbStyle, BAR_MAP } from './util'

export default defineComponent({
  name: 'Bar',

  props: {
    vertical: Boolean,
    size: String,
    move: Number,
  },

  setup(props) {
    const instance = getCurrentInstance()
    const thumb = ref()
    const wrap = inject('scroll-bar-wrap', {} as Ref<Nullable<HTMLElement>>) as any
    const bar = computed(() => {
      return BAR_MAP[props.vertical ? 'vertical' : 'horizontal']
    })
    const barStore = ref<Recordable>({})
    const cursorDown = ref()

    // 点击滚动时用于计算滚动条的位置
    const clickThumbHandler = (e: any) => {
      // 防止右键点击事件
      if (e.ctrlKey || e.button === 2) {
        return
      }
      window.getSelection()?.removeAllRanges() // 清除文本选中状态
      startDrag(e)
      // 计算点击位置与滚动条中心点的距离
      barStore.value[bar.value.axis] =
        e.currentTarget[bar.value.offset] -
        (e[bar.value.client] - e.currentTarget.getBoundingClientRect()[bar.value.direction])
    }

    // 鼠标按下滚动条空白区域时，滚动到对应位置
    const clickTrackHandler = (e: any) => {
      // 获取鼠标点击位置与滚动条顶部的距离
      const offset = Math.abs(
        e.target.getBoundingClientRect()[bar.value.direction] - e[bar.value.client],
      )
      // 获取滚动条的一半长度
      const thumbHalf = thumb.value[bar.value.offset] / 2
      // 获取滚动条的位置百分比
      const thumbPositionPercentage =
        ((offset - thumbHalf) * 100) / instance?.vnode.el?.[bar.value.offset]

      wrap.value[bar.value.scroll] =
        (thumbPositionPercentage * wrap.value[bar.value.scrollSize]) / 100
    }

    const startDrag = (e: any) => {
      e.stopImmediatePropagation()
      cursorDown.value = true
      on(document, 'mousemove', mouseMoveDocumentHandler)
      on(document, 'mouseup', mouseUpDocumentHandler)
      document.onselectstart = () => false
    }

    const mouseMoveDocumentHandler = (e: any) => {
      if (cursorDown.value === false) return
      const prevPage = barStore.value[bar.value.axis]

      if (!prevPage) return

      const offset =
        (instance?.vnode.el?.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]) *
        -1

      const thumbClickPosition = thumb.value[bar.value.offset] - prevPage
      const thumbPositionPercentage =
        ((offset - thumbClickPosition) * 100) / instance?.vnode.el?.[bar.value.offset]
      wrap.value[bar.value.scroll] =
        (thumbPositionPercentage * wrap.value[bar.value.scrollSize]) / 100
    }

    const mouseUpDocumentHandler = () => {
      cursorDown.value = false
      barStore.value[bar.value.axis] = 0
      off(document, 'mousemove', mouseMoveDocumentHandler)
      document.onselectstart = null
    }

    onUnmounted(() => {
      off(document, 'mouseup', mouseUpDocumentHandler)
    })

    return () =>
      h(
        'div',
        {
          class: ['scrollbar__bar', 'is-' + bar.value.key],
          onMousedown: clickTrackHandler,
        },
        h('div', {
          ref: thumb,
          class: 'scrollbar__thumb',
          onMousedown: clickThumbHandler,
          style: renderThumbStyle({
            size: props.size,
            move: props.move,
            bar: bar.value,
          }),
        }),
      )
  },
})
