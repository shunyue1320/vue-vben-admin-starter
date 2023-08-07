<template>
  <ConfigProvider :locale="getAntdLocale">
    <RouterView />
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from 'ant-design-vue'
  import { useLocale } from '@/locales/useLocale'
  import { useTitle } from '@/hooks/web/useTitle'
  import 'dayjs/locale/zh-cn'

  // 获取当前语言
  const { getAntdLocale } = useLocale()

  // 监听路由变化动态设置页面标题
  useTitle()
</script>
