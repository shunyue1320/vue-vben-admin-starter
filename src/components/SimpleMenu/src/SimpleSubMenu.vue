<template>
  <!-- 有子路由 -->
  <SubMenu
    :name="item.path"
    v-if="menuHasChildren(item)"
    :class="[getLevelClass, theme]"
    :collapsedShowTitle="collapsedShowTitle"
  >
    <template #title>
      <Icon v-if="getIcon" :icon="getIcon" :size="16" />

      <div v-if="collapsedShowTitle && getIsCollapseParent" class="mt-2 collapse-title">
        {{ getI18nName }}
      </div>

      <span v-show="getShowSubTitle" :class="['ml-2', `${prefixCls}-sub-title`]">
        {{ getI18nName }}
      </span>
      <SimpleMenuTag :item="item" :collapseParent="!!collapse && !!parent" />
    </template>
    <template
      v-for="childrenItem in item.children || []"
      :key="childrenItem.paramPath || childrenItem.path"
    >
      <SimpleSubMenu v-bind="$props" :item="childrenItem" :parent="false" />
    </template>
  </SubMenu>
  <!-- 没有子路由 -->
  <MenuItem :name="item.path" v-else v-bind="$props" :class="getLevelClass">
    <Icon v-if="getIcon" :icon="getIcon" :size="16" />
    <div v-if="collapsedShowTitle && getIsCollapseParent" class="mt-1 collapse-title">
      {{ getI18nName }}
    </div>
    <template #title>
      <span :class="['ml-2', `${prefixCls}-sub-title`]">
        {{ getI18nName }}
      </span>
      <SimpleMenuTag :item="item" :collapseParent="getIsCollapseParent" />
    </template>
  </MenuItem>
</template>

<script lang="ts">
  import type { PropType } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Icon } from '@iconify/vue'
  import { useDesign } from '@/hooks/web/useDesign'
  import { computed, defineComponent } from 'vue'
  import { Menu } from '@/router/types'
  import { propTypes } from '@/utils/propTypes'
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent'
  import MenuItem from './components/MenuItem.vue'
  import SubMenu from './components/SubMenuItem.vue'

  export default defineComponent({
    name: 'SimpleSubMenu',
    components: {
      SubMenu,
      MenuItem,
      SimpleMenuTag: createAsyncComponent(() => import('./SimpleMenuTag.vue')),
      Icon,
    },
    props: {
      item: {
        type: Object as PropType<Menu>,
        default: () => ({}),
      },
      parent: propTypes.bool,
      collapsedShowTitle: propTypes.bool,
      collapse: propTypes.bool,
      theme: propTypes.oneOf(['dark', 'light']),
    },
    setup(props) {
      const { t } = useI18n()
      const { prefixCls } = useDesign('simple-menu')

      const getIcon = computed(() => props.item?.icon)
      const getI18nName = computed(() => t(props.item?.name))
      const getShowSubTitle = computed(() => !props.collapse || !props.parent)
      const getIsCollapseParent = computed(() => !!props.collapse && !!props.parent)
      const getLevelClass = computed(() => {
        return [
          {
            [`${prefixCls}__parent`]: props.parent,
            [`${prefixCls}__children`]: !props.parent,
          },
        ]
      })

      function menuHasChildren(menuTreeItem: Menu): boolean {
        return (
          !menuTreeItem.meta?.hideChildrenInMenu &&
          Reflect.has(menuTreeItem, 'children') &&
          !!menuTreeItem.children &&
          menuTreeItem.children.length > 0
        )
      }

      return {
        prefixCls,
        menuHasChildren,
        getIcon,
        getI18nName,
        getShowSubTitle,
        getLevelClass,
        getIsCollapseParent,
      }
    },
  })
</script>
