import { readPackageJSON } from 'pkg-types';

import { getEnvConfig } from '../utils/env';
import { createContentHash } from '../utils/hash';

const PLUGIN_NAME = 'app-config';
const GLOBAL_CONFIG_FILE_NAME = '_app.config.js';

async function createAppConfigPlugin({
  root,
  isBuild
}: {
  root: string;
  isBuild: boolean;
}) {

  if (!isBuild) {
    return {
      name: PLUGIN_NAME,
    };
  }

  let publicPath: string;
  let source: string;
  const { version = '' } = await readPackageJSON(root);
  
  return {
    name: PLUGIN_NAME,
    async configResolved(_config) { // configResolved 钩子在配置解析完成后执行
      let appTitle = _config?.env?.VITE_GLOB_APP_TITLE ?? '';
      appTitle = appTitle.replace(/\s/g, '_').replace(/-/g, '_');
      publicPath = _config.base;
      source = await getConfigSource(appTitle);
    },
    async transformIndexHtml(html: string) {
      publicPath = publicPath.endsWith('/') ? publicPath : `${publicPath}/`;

      // 给 index.html 添加 <script src="/_app.config.js?v=2.10.0-4f45fbec89ff"></script>
      const appConfigSrc = `${
        publicPath || '/'
      }${GLOBAL_CONFIG_FILE_NAME}?v=${version}-${createContentHash(source)}`;

      return {
        html,
        tags: [
          {
            tag: 'script',
            attrs: {
              src: appConfigSrc,
            }
          }
        ]
      }
    }
  }
}


/** 获取配置文件变量名 */
function getVariableName(title: string) {
  function strToHex(str: string) {
    const result: string[] = [];
    for (let i = 0; i < str.length; i++) {
      const hex = str.charCodeAt(i).toString(16);
      result.push(('000' + hex).slice(-4));
    }
    return result.join('').toUpperCase();
  }

  // __PRODUCTION__APP__CONF__
  return `__PRODUCTION__${strToHex(title) || '__APP'}__CONF__`.toUpperCase().replace(/\s/g, '');
}


async function getConfigSource(appTitle: string) {
  const config = await getEnvConfig();
  const variableName = getVariableName(appTitle);
  const windowVariable = `window.${variableName}`;
  // 确保变量不会被修改
  let source = `${windowVariable}=${JSON.stringify(config)};`;
  source += `
  Object.freeze(${windowVariable});
  Object.defineProperty(window, "${variableName}", {
    configurable: false,
    writable: false,
  });
`.replace(/\s/g, '');
  return source;
}
export { createAppConfigPlugin };