import { resolve } from 'node:path';


import dayjs from 'dayjs';
import { readPackageJSON } from 'pkg-types';
import { defineConfig, loadEnv, mergeConfig, type UserConfig } from 'vite';

import { createPlugins } from '../plugins';
import { generateModifyVars } from '../utils/modifyVars';
import { commonConfig } from './common';

interface DefineOptions {
  overrides?: UserConfig;
  options?: {};
}

function defineApplicationConfig(defineOptions: DefineOptions ={}) {
  const { overrides = {} } = defineOptions;

  return defineConfig(async ({ command, mode }) => {
    const root = process.cwd();
    const isBuild = command === 'build';
    const { VITE_USE_MOCK, VITE_BUILD_COMPRESS, VITE_ENABLE_ANALYZE } = loadEnv(mode, root);

    const defineData = await createDefineData(root);
    const plugins = await createPlugins({
      isBuild, // 生产环境需要添加压缩插件
      root, // 项目根目录
      enableAnalyze: VITE_ENABLE_ANALYZE === 'true', // 是否开启打包分析
      enableMock: VITE_USE_MOCK === 'true', // 是否开启mock
      compress: VITE_BUILD_COMPRESS, // 是否开启压缩
    })

    const pathResolve = (pathname: string) => resolve(root, '.', pathname);

    const applicationConfig: UserConfig = {
      resolve: {
        alias: [
          {
            find: 'vue-i18n',
            replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
          },
          // /@/xxxx => src/xxxx
          {
            find: /\/@\//,
            replacement: pathResolve('src') + '/',
          },
          // /#/xxxx => types/xxxx
          {
            find: /\/#\//,
            replacement: pathResolve('types') + '/',
          },
          // @/xxxx => src/xxxx
          {
            find: /@\//,
            replacement: pathResolve('src') + '/',
          },
          // #/xxxx => types/xxxx
          {
            find: /#\//,
            replacement: pathResolve('types') + '/',
          },
        ],
      },
      define: defineData,
      build: {
        target: 'es2015',
        cssTarget: 'chrome80',
        rollupOptions: {
          output: {
            // 输出文件名
            entryFileNames: 'assets/[name].js',
            manualChunks: { // 手动分包
              vue: ['vue', 'pinia', 'vue-router'], // Rollup 将会把这三个依赖包打包到名为 vue.js 的文件中，并存放 assets/vue.js 文件中
              antd: ['ant-design-vue', '@ant-design/icons-vue'], // antd 相关包
            },
          },
        },
      },
      css: {
        preprocessorOptions: {
          less: { // 配置 less 变量
            modifyVars: generateModifyVars(), // 定义全局样式变量
            javascriptEnabled: true, // 开启 less 的 js 解析
          },
        },
      },
      plugins,
    };

    const mergedConfig = mergeConfig(commonConfig(mode), applicationConfig);

    // 合并用户传递过来的配置
    return mergeConfig(mergedConfig, overrides);
  });
}

async function createDefineData(root: string) {
  try {
    const pkgJson = await readPackageJSON(root);
    const { dependencies, devDependencies, name, version } = pkgJson;
    const __APP_INFO__ = {
      pkg: { dependencies, devDependencies, name, version },
      lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }
    return {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    }
  } catch (error) {
    return {}
  }
}

export { defineApplicationConfig } 