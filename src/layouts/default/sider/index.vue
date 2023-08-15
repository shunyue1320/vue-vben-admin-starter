<template>
  <Drawer
    v-if="getIsMobile"
    placement="left"
    :class="prefixCls"
    :width="getMenuWidth"
    :getContainer="null"
    :visible="!getCollapsed"
    @close="handleClose"
  >
    <Sider />
  </Drawer>
  <MixSider v-else-if="getIsMixSidebar" />
  <Sider v-else />
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { Drawer } from 'ant-design-vue'
  import { useDesign } from '@/hooks/web/useDesign'
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting'
  import { useAppInject } from '@/hooks/web/useAppInject'
  import Sider from './LayoutSider.vue'
  import MixSider from './MixSider.vue'

  export default defineComponent({
    name: 'SiderWrapper',
    components: { Sider, Drawer, MixSider },
    setup() {
      const { prefixCls } = useDesign('layout-sider-wrapper')
      const { getIsMobile } = useAppInject()
      const { setMenuSetting, getCollapsed, getMenuWidth, getIsMixSidebar } = useMenuSetting()

      function handleClose() {
        setMenuSetting({
          collapsed: true,
        })
      }

      return { prefixCls, getIsMobile, getCollapsed, handleClose, getMenuWidth, getIsMixSidebar }
    },
  })
</script>
