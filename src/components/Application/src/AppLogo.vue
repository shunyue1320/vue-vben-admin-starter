<template>
  <div class="anticon" :class="getAppLogoClass" @click="goHome">
    <img src="@/assets/images/logo.png" alt="logo" />
    <div class="ml-2 truncate md:opacity-100" :class="getTitleClass" v-show="showTitle">
      {{ title }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, unref } from 'vue'
  import { useDesign } from '@/hooks/web/useDesign'
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting'
  import { useGlobSetting } from '@/hooks/setting'
  import { useUserStore } from '@/store/modules/user'
  import { PageEnum } from '@/enums/pageEnum'
  import { useGo } from '@/hooks/web/usePage'

  const props = defineProps({
    /** 当前父组件的主题  */
    theme: { type: String, validator: (v: string) => ['light', 'dark'].includes(v) },
    /** 是否显示标题 */
    showTitle: { type: Boolean, default: true },
    /** 始终显示标题 */
    alwaysShowTitle: { type: Boolean },
  })

  const { prefixCls } = useDesign('app-logo')
  const { getCollapsedShowTitle } = useMenuSetting()
  const { title } = useGlobSetting()

  const getAppLogoClass = computed(() => [
    prefixCls,
    props.theme,
    { 'collapsed-show-title': unref(getCollapsedShowTitle) },
  ])

  const getTitleClass = computed(() => [
    `${prefixCls}__title`,
    {
      'xs:opacity-0': !props.alwaysShowTitle,
    },
  ])

  const userStore = useUserStore()
  const { go } = useGo()

  function goHome() {
    go(userStore.getUserInfo.homePath || PageEnum.BASE_HOME)
  }
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-app-logo';

  .@{prefix-cls} {
    display: flex;
    align-items: center;
    padding-left: 7px;
    transition: all 0.2s ease;
    cursor: pointer;

    &.light {
      border-bottom: 1px solid @border-color-base;
    }

    &.collapsed-show-title {
      padding-left: 20px;
    }

    &.light &__title {
      color: @primary-color;
    }

    &.dark &__title {
      color: @white;
    }

    &__title {
      transition: all 0.5s;
      font-size: 16px;
      font-weight: 700;
      line-height: normal;
    }
  }
</style>
