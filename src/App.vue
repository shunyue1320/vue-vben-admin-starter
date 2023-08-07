<template>
  <ConfigProvider :locale="getAntdLocale">
    <RouterView />
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from 'ant-design-vue'
  import { useLocale } from '@/locales/useLocale'
  import 'dayjs/locale/zh-cn'

  // 获取当前语言
  const { getAntdLocale } = useLocale()
</script>
