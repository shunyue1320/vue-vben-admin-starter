import 'uno.css'
import '@/design/index.less'
import 'ant-design-vue/dist/antd.less'

import { createApp } from 'vue'

import App from './App.vue'
import { setupStore } from '@/store'
import { initAppConfigStore } from '@/logics/initAppConfig'
import { registerGlobComp } from '@/components/registerGlobComp'
import { setupI18n } from '@/locales/setupI18n'
import { setupGlobDirectives } from '@/directives'
import { setupRouter, router } from '@/router'
import { setupRouterGuard } from '@/router/guard'
import { setupErrorHandle } from '@/logics/error-handle'

async function bootstrap() {
  const app = createApp(App)

  // pinia状态管理注册
  setupStore(app)

  // 项目系统配置初始化
  initAppConfigStore()

  // 全局组件注册
  registerGlobComp(app)

  // 国际化多语言配置 异步案例：语言文件可能从服务器端获取
  await setupI18n(app)

  // 路由配置
  setupRouter(app)

  // 路由守卫
  setupRouterGuard(router)

  // 全局指令注册
  setupGlobDirectives(app)

  // 全局错误处理注册
  setupErrorHandle(app)

  app.mount('#app')
}

bootstrap()
