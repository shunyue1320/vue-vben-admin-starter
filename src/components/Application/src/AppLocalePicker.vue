<!-- 国际化语言切换组件 -->

<template>
  <Dropdown
    placement="bottom"
    :trigger="['click']"
    :dropMenuList="localeList"
    :selectedKeys="selectedKeys"
    @menu-event="handleMenuEvent"
    overlayClassName="app-locale-picker-overlay"
  >
    <span class="cursor-pointer flex items-center">
      <Icon class="text-base" icon="ion:language" />
      <span v-if="showText" class="ml-1">{{ getLocaleText }}</span>
    </span>
  </Dropdown>
</template>

<script lang="ts" setup>
  import type { LocaleType } from '#/config'
  import { DropMenu, Dropdown } from '@/components/Dropdown'
  import { computed, ref, unref, watchEffect } from 'vue'
  import { Icon } from '@iconify/vue'
  import { useLocale } from '@/locales/useLocale'
  import { localeList } from '@/settings/localeSetting'

  const props = defineProps({
    /**
     * 是否显示文本
     */
    showText: { type: Boolean, default: true },
    /**
     * 更改时是否刷新界面
     */
    reload: { type: Boolean },
  })

  const selectedKeys = ref<LocaleType[]>([])
  const { getLocale, changeLocale } = useLocale()

  const getLocaleText = computed(() => {
    const key = selectedKeys.value[0]
    if (!key) {
      return ''
    }
    return localeList.find((item) => item.event === key)?.text
  })

  watchEffect(() => {
    selectedKeys.value = [unref(getLocale)]
  })

  async function toggleLocale(lang: LocaleType) {
    await changeLocale(lang)
    selectedKeys.value = [lang]
    props.reload && location.reload()
  }

  function handleMenuEvent(menu: DropMenu) {
    if (unref(getLocale) === menu.event) {
      return
    }
    toggleLocale(menu.event as LocaleType)
  }
</script>

<style lang="less">
  .app-locale-picker-overlay {
    .ant-dropdown-menu-item {
      min-width: 160px;
    }
  }
</style>
