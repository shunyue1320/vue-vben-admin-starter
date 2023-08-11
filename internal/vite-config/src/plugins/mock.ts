/**
 * 用于开发和生产的模拟插件。
 * https://github.com/anncwb/vite-plugin-mock
 */
import { viteMockServe } from 'vite-plugin-mock'

export function configMockPlugin({ isBuild }: { isBuild: boolean }) {
  return viteMockServe({
    ignore: /^_/,
    mockPath: 'mock',
    localEnabled: !isBuild,
    prodEnabled: isBuild,
    injectCode: `
      import { setupProdMockServer } from '../mock/_createProductionServer';

      setupProdMockServer();
      `,
  })
}
