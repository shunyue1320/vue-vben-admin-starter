import { Ref, computed, ref, unref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useThrottleFn } from '@vueuse/core'
import { MenuSplitTyeEnum } from '@/enums/menuEnum'
import { useMenuSetting } from '@/hooks/setting/useMenuSetting'
import { useAppInject } from '@/hooks/web/useAppInject'
import { usePermissionStore } from '@/store/modules/permission'
import { getChildrenMenus, getCurrentParentPath, getMenus, getShallowMenus } from '@/router/menus'
import { Menu } from '@/router/types'

export function useSplitMenu(splitType: Ref<MenuSplitTyeEnum>) {
  const menusRef = ref<Menu[]>([])
  const { currentRoute } = useRouter()
  const { getIsMobile } = useAppInject()
  const permissionStore = usePermissionStore()
  const { setMenuSetting, getIsHorizontal, getSplit } = useMenuSetting()

  const throttleHandleSplitLeftMenu = useThrottleFn(handleSplitLeftMenu, 50)

  // 监听菜单位置不在左侧
  const splitNotLeft = computed(
    () => unref(splitType) !== MenuSplitTyeEnum.LEFT && !unref(getIsHorizontal),
  )

  // 拆分菜单
  const getSplitLeft = computed(
    () => !unref(getSplit) || unref(splitType) !== MenuSplitTyeEnum.LEFT,
  )

  const getSpiltTop = computed(() => unref(splitType) === MenuSplitTyeEnum.TOP)

  // 普通模式
  const normalType = computed(() => {
    return unref(splitType) === MenuSplitTyeEnum.NONE || !unref(getSplit)
  })

  // 路由变化处理拆分左侧菜单
  watch(
    [() => unref(currentRoute).path, () => unref(splitType)],
    async ([path]: [string, MenuSplitTyeEnum]) => {
      if (unref(splitNotLeft) || unref(getIsMobile)) return
      const { meta } = unref(currentRoute)
      const currentActiveMenu = meta.currentActiveMenu as string
      let parentPath = await getCurrentParentPath(path)
      if (!parentPath) {
        parentPath = await getCurrentParentPath(currentActiveMenu)
      }
      parentPath && throttleHandleSplitLeftMenu(parentPath)
    },
    {
      immediate: true,
    },
  )

  // 监听菜单改变 （动态菜单）
  watch(
    [() => permissionStore.getLastBuildMenuTime, () => permissionStore.getBackMenuList],
    () => {
      genMenus()
    },
    {
      immediate: true,
    },
  )

  // 监听拆分菜单更改
  watch(
    () => getSplit.value,
    () => {
      if (unref(splitNotLeft)) return
      genMenus()
    },
  )

  // 处理左侧菜单拆分
  async function handleSplitLeftMenu(parentPath: string) {
    if (unref(getSplitLeft) || unref(getIsMobile)) return

    // 左分离模式
    const children = await getChildrenMenus(parentPath)

    if (!children || !children.length) {
      setMenuSetting({ hidden: true })
      menusRef.value = []
      return
    }

    setMenuSetting({ hidden: false })
    menusRef.value = children
  }

  // 获取菜单
  async function genMenus() {
    // 正常模式
    if (unref(normalType) || unref(getIsMobile)) {
      menusRef.value = await getMenus()
      return
    }

    // split-top 模式
    if (unref(getSpiltTop)) {
      const shallowMenus = await getShallowMenus()

      menusRef.value = shallowMenus
      return
    }
  }

  return { menusRef }
}
