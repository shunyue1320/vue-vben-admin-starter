<template>
  <Layout :class="prefixCls">
    <Layout :class="[layoutClass]">
      <LayoutSideBar v-if="getShowSidebar" />
      <Layout :class="`${prefixCls}-main`">
        <LayoutMultipleHeader />
        <LayoutContent />
      </Layout>
    </Layout>
  </Layout>
  <div>
    layout
    <RouterView />
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, unref } from 'vue'
  import { Layout } from 'ant-design-vue'
  import { useDesign } from '@/hooks/web/useDesign'
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting'
  import LayoutSideBar from './sider/index.vue'
  import LayoutMultipleHeader from './header/MultipleHeader.vue'
  import LayoutContent from './content/index.vue'

  export default defineComponent({
    name: 'DefaultLayout',
    components: {
      Layout,
      LayoutSideBar,
      LayoutMultipleHeader,
      LayoutContent,
    },
    setup() {
      const { prefixCls } = useDesign('default-layout')
      const { getShowSidebar, getIsMixSidebar, getShowMenu } = useMenuSetting()

      const layoutClass = computed(() => {
        let cls: string[] = ['ant-layout']
        if (unref(getIsMixSidebar) || unref(getShowMenu)) {
          cls.push('ant-layout-has-sider')
        }
        return cls
      })

      return {
        getShowSidebar,
        prefixCls,
        layoutClass,
      }
    },
  })
</script>

<style lang="less"></style>
