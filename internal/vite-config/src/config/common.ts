import { presetTypography, presetUno } from 'unocss'
import UnoCSS from 'unocss/vite'
import type { UserConfig } from 'vite'

const commonConfig: (mode: string) => UserConfig = (mode) => ({
  server: {
    host: true,
  },
  esbuild: {
    // 删除 console 和 debugger
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
  build: {
    reportCompressedSize: false, // 不显示压缩后的尺寸
    chunkSizeWarningLimit: 1500, // 超过 1500kb 会提示
    rollupOptions: {
      // TODO: Prevent memory overflow
      maxParallelFileOps: 3, // 并行文件操作的最大数量
    },
  },
  plugins: [
    UnoCSS({
      presets: [presetUno(), presetTypography()], // 预设
    }),
  ],
})
export { commonConfig }
