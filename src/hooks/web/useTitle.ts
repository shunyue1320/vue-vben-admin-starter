/**
 * 监听页面更改和动态更改网站标题
 */
import { unref, watch } from 'vue'
import { useTitle as usePageTitle } from '@vueuse/core'

import { useGlobSetting } from '@/hooks/setting'
import { useI18n } from '@/hooks/web/useI18n'
import { REDIRECT_NAME } from '@/router/constant'
import { useRouter } from 'vue-router'
import { useLocaleStore } from '@/store/modules/locale'

export function useTitle() {
  const { title } = useGlobSetting()
  const { t } = useI18n()
  const { currentRoute } = useRouter()
  const localeStore = useLocaleStore()
  const pageTitle = usePageTitle()

  // 监听路由变化和语言变化
  watch(
    [() => currentRoute.value.path, () => localeStore.getLocale],
    () => {
      const route = unref(currentRoute)

      if (route.name === REDIRECT_NAME) {
        return
      }

      const tTitle = t(route?.meta?.title as string)
      pageTitle.value = tTitle ? ` ${tTitle} - ${title} ` : `${title}`
    },
    { immediate: true }, // 立即监听
  )
}
