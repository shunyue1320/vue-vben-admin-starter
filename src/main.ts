import { createApp } from 'vue'

import App from './App.vue'
import { setupStore } from '@/store'
import { registerGlobComp } from '@/components/registerGlobComp'

async function bootstrap() {
  const app = createApp(App)

  // 配置存储
  setupStore(app)

  // // 初始化内部系统配置
  // initAppConfigStore();

  // 注册全局组件
  registerGlobComp(app)
}

bootstrap()
