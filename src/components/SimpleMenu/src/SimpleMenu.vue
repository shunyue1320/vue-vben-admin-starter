<template>
  <Menu
    v-bind="getBindValues"
    :activeName="activeName"
    :openNames="getOpenKeys"
    :class="prefixCls"
    :activeSubMenuNames="activeSubMenuNames"
    @select="handleSelect"
  >
    <template v-for="item in items" :key="item.path">
      <SimpleSubMenu
        v-if="item?.meta?.hideMenu"
        :item="item"
        :parent="true"
        :collapsedShowTitle="collapsedShowTitle"
        :collapse="collapse"
      />
    </template>
  </Menu>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref, toRefs, PropType, computed, watch, unref } from 'vue'
  import { useRouter, RouteLocationNormalizedLoaded } from 'vue-router'
  import { useDesign } from '@/hooks/web/useDesign'
  import { isFunction, isUrl } from '@/utils/is'
  import { openWindow } from '@/utils'
  import { propTypes } from '@/utils/propTypes'
  import { listenerRouteChange } from '@/logics/mitt/routeChange'
  import type { Menu as MenuType } from '@/router/types'
  import Menu from './components/Menu.vue'
  import SimpleSubMenu from './SimpleSubMenu.vue'
  import type { MenuState } from './types'
  import { useOpenKeys } from './useOpenKeys'
  import { REDIRECT_NAME } from '@/router/constant'

  export default defineComponent({
    name: 'SimpleMenu',
    components: {
      Menu,
      SimpleSubMenu,
    },
    inheritAttrs: false,
    props: {
      items: {
        type: Array as PropType<MenuType[]>,
        default: () => [],
      },
      collapse: propTypes.bool,
      mixSider: propTypes.bool,
      theme: propTypes.string,
      accordion: propTypes.bool.def(true),
      collapsedShowTitle: propTypes.bool,
      beforeClickFn: {
        type: Function as PropType<(key: string) => Promise<boolean>>,
      },
      isSplitMenu: propTypes.bool,
    },
    emits: ['menuClick'],
    setup(props, { attrs, emit }) {
      const currentActiveMenu = ref('')
      const isClickGo = ref(false)
      const menuState = reactive<MenuState>({
        activeName: '',
        openNames: [],
        activeSubMenuNames: [],
      })

      const { currentRoute } = useRouter()
      const { prefixCls } = useDesign('simple-menu')
      const { items, accordion, mixSider, collapse } = toRefs(props)

      const { setOpenKeys, getOpenKeys } = useOpenKeys(
        menuState,
        items,
        accordion,
        mixSider as any,
        collapse as any,
      )

      const getBindValues = computed(() => ({ ...attrs, ...props }))

      watch(
        () => props.collapse,
        (collapse) => {
          if (collapse) {
            menuState.openNames = []
          } else {
            setOpenKeys(currentRoute.value.path)
          }
        },
        { immediate: true },
      )
      watch(
        () => props.items,
        () => {
          if (!props.isSplitMenu) {
            return
          }
          setOpenKeys(currentRoute.value.path)
        },
        { flush: 'post' },
      )

      // 监听器路由更改
      listenerRouteChange((route) => {
        if (route.name === REDIRECT_NAME) return
        currentActiveMenu.value = route.meta?.currentActiveMenu as string
        handleMenuChange(route)

        if (unref(currentActiveMenu)) {
          menuState.activeName = unref(currentActiveMenu)
          setOpenKeys(unref(currentActiveMenu))
        }
      })

      async function handleMenuChange(route?: RouteLocationNormalizedLoaded) {
        if (unref(isClickGo)) {
          isClickGo.value = false
          return
        }

        const path = (route || unref(currentRoute)).path
        menuState.activeName = path
        setOpenKeys(path)
      }

      async function handleSelect(key: string) {
        if (isUrl(key)) {
          openWindow(key)
          return
        }

        const { beforeClickFn } = props
        if (beforeClickFn && isFunction(beforeClickFn)) {
          const flag = await beforeClickFn(key)
          if (!flag) return
        }

        emit('menuClick', key)

        isClickGo.value = true
        setOpenKeys(key)
        menuState.activeName = key
      }

      return {
        prefixCls,
        getBindValues,
        handleSelect,
        getOpenKeys,
        ...toRefs(menuState),
      }
    },
  })
</script>

<style lang="less">
  @import url('./index.less');
</style>
