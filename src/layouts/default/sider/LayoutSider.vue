<template>
  <div
    v-if="getMenuFixed && !getIsMobile"
    :style="getHiddenDomStyle"
    v-show="showClassSideBarRef"
  ></div>
  <LayoutSider
    v-show="showClassSideBarRef"
    ref="sideRef"
    breakpoint="lg"
    collapsible
    :class="getSiderClass"
    :width="getMenuWidth"
    :collapsed="getCollapsed"
    :collapsedWidth="getCollapsedWidth"
    :theme="getMenuTheme"
    @breakpoint="onBreakpointChange"
    v-bind="getTriggerAttr"
  >
    <LayoutMenu :theme="getMenuTheme" :menuMode="getMode" :splitType="getSplitType" />
    <!-- 右侧宽度设置拖动条 -->
    <DragBar ref="dragBarRef" />
  </LayoutSider>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, unref, CSSProperties } from 'vue'
  import { Layout } from 'ant-design-vue'
  import { useDesign } from '@/hooks/web/useDesign'
  import { useAppInject } from '@/hooks/web/useAppInject'
  import LayoutMenu from '../menu/index.vue'
  import DragBar from './DragBar.vue'
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting'
  import { useTrigger, useDragLine, useSiderEvent } from './useLayoutSider'
  import { MenuModeEnum, MenuSplitTyeEnum } from '@/enums/menuEnum'

  export default defineComponent({
    name: 'LayoutSideBar',
    components: { LayoutSider: Layout.Sider, LayoutMenu, DragBar },
    setup() {
      const { prefixCls } = useDesign('layout-sideBar')
      const { getIsMobile } = useAppInject()
      const { getTriggerAttr, getShowTrigger } = useTrigger(getIsMobile)

      const {
        getCollapsed,
        getMenuWidth,
        getSplit,
        getMenuTheme,
        getRealWidth,
        getMenuHidden,
        getMenuFixed,
        getIsMixMode,
        toggleCollapsed,
      } = useMenuSetting()

      const dragBarRef = ref(null)
      const sideRef = ref(null)

      useDragLine(sideRef, dragBarRef)

      const { getCollapsedWidth, onBreakpointChange } = useSiderEvent()

      const getMode = computed(() => {
        return unref(getSplit) ? MenuModeEnum.INLINE : null
      })

      const getSplitType = computed(() => {
        return unref(getSplit) ? MenuSplitTyeEnum.LEFT : MenuSplitTyeEnum.NONE
      })

      const showClassSideBarRef = computed(() => {
        return unref(getSplit) ? !unref(getMenuHidden) : true
      })

      const getSiderClass = computed(() => {
        return [
          prefixCls,
          {
            [`${prefixCls}--fixed`]: unref(getMenuFixed),
            [`${prefixCls}--mix`]: unref(getIsMixMode) && !unref(getIsMobile),
          },
        ]
      })

      const getHiddenDomStyle = computed((): CSSProperties => {
        const width = `${unref(getRealWidth)}px`
        return {
          width: width,
          overflow: 'hidden',
          flex: `0 0 ${width}`,
          maxWidth: width,
          minWidth: width,
          transition: 'all 0.2s',
        }
      })

      return {
        prefixCls,
        sideRef,
        dragBarRef,
        getIsMobile,
        getHiddenDomStyle,
        getSiderClass,
        getTriggerAttr,
        getCollapsedWidth,
        getMenuFixed,
        showClassSideBarRef,
        getMenuWidth,
        getCollapsed,
        getMenuTheme,
        onBreakpointChange,
        getMode,
        getSplitType,
        getShowTrigger,
        toggleCollapsed,
      }
    },
  })
</script>
