/**
 *  用于快速创建SVG精灵的Vite插件。将 SVG 图标文件打包成 Vue 组件并注册到应用程序中 组件： SvgIcon.vue
 * https://github.com/anncwb/vite-plugin-svg-icons
 */
import { resolve } from 'node:path';

import { PluginOption } from "vite";
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

export function configSvgIconsPlugin({ isBuild }: { isBuild: boolean }) {
  const svgIconPlugin = createSvgIconsPlugin({
    iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
    svgoOptions: isBuild,
  });
  return svgIconPlugin as PluginOption;
}