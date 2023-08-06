import { createApp } from 'vue';

import App from './App.vue';
import { setupStore } from '@/store';

async function bootstrap() {
  const app = createApp(App);

  // 配置存储
  setupStore(app);
}

bootstrap();
