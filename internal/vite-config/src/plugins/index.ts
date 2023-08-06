import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { type PluginOption } from 'vite';
import purgeIcons from 'vite-plugin-purge-icons';

import { createAppConfigPlugin } from './appConfig';
import { configHtmlPlugin } from './html';
import { configSvgIconsPlugin } from './svgSprite';
import { configCompressPlugin } from './compress';
import { configVisualizerConfig } from './visualizer';
import { configMockPlugin } from './mock';

interface Options {
  isBuild: boolean;
  root: string;
  compress: string;
  enableMock?: boolean;
  enableAnalyze?: boolean;
}


async function createPlugins({ isBuild, root, enableAnalyze, enableMock, compress }: Options) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [vue(), vueJsx()];

  const appConfigPlugin = await createAppConfigPlugin({ root, isBuild });
  vitePlugins.push(appConfigPlugin);

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin({ isBuild }));

  // vite-plugin-svg-icons
  vitePlugins.push(configSvgIconsPlugin({ isBuild }));

  // vite-plugin-purge-icons
  vitePlugins.push(purgeIcons());

  // 以下插件仅适用于生产环境
  if (isBuild) {
    // rollup-plugin-gzip
    vitePlugins.push(
      configCompressPlugin({
        compress,
      }),
    );
  }
  
  // rollup-plugin-visualizer
  if (enableAnalyze) {
    vitePlugins.push(configVisualizerConfig());
  }

  // vite-plugin-mock
  if (enableMock) {
    vitePlugins.push(configMockPlugin({ isBuild }));
  }

  return vitePlugins;
}

export { createPlugins };