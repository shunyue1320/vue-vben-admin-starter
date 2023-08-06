import { createApp } from 'vue'

import App from './App.vue'
import { setupStore } from '@/store'
import { registerGlobComp } from '@/components/registerGlobComp'
import { setupI18n } from '@/locales/setupI18n'

async function bootstrap() {
  const app = createApp(App)

  // 配置存储
  setupStore(app)

  // // 初始化内部系统配置
  // initAppConfigStore();

  // 注册全局组件
  registerGlobComp(app)

  // 多语言配置异步案例：语言文件可能从服务器端获取
  await setupI18n(app)
}

bootstrap()
