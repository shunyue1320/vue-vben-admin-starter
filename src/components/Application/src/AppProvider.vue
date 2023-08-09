<script lang="ts">
  import { defineComponent, ref, toRefs } from 'vue'
  import { createAppProviderContext } from './useAppContext'
  import { prefixCls } from '@/settings/designSetting'

  export default defineComponent({
    name: 'AppProvider',
    inheritAttrs: false,
    props: {
      prefixCls: { type: String, default: prefixCls },
    },
    setup(props, { slots }) {
      const isMobile = ref(false)
      const { prefixCls } = toRefs(props)

      // inject 将变量注入全局
      createAppProviderContext({ prefixCls, isMobile })

      return () => slots.default?.()
    },
  })
</script>
