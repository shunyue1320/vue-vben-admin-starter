/**
 * 插件最小化并使用index.html中的ejs模板语法。
 * https://github.com/anncwb/vite-plugin-html
 */
import { PluginOption } from "vite";
import { createHtmlPlugin } from 'vite-plugin-html';

export function configHtmlPlugin({ isBuild }: { isBuild: boolean }) {
  const htmlPlugin: PluginOption[] = createHtmlPlugin({
    minify: isBuild,
  })
  return htmlPlugin;
}