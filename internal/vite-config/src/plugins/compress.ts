/**
 * 用于打包和输出gzip。请注意，这在Vite中无法正常工作，具体原因仍在调查中
 * https://github.com/anncwb/vite-plugin-compression
 */
import type { PluginOption } from 'vite';
import compressPlugin from 'vite-plugin-compression';

export function configCompressPlugin({
  compress,
  deleteOriginFile = false,
}: {
  compress: string,
  deleteOriginFile?: boolean,
}) {
  const compressList = compress.split(',');

  const plugins: PluginOption[] = [];

  if (compressList.includes('gzip')) {
    plugins.push(
      compressPlugin({
        ext: '.gz',
        deleteOriginFile,
      })
    )
  }

  if (compressList.includes('brotli')) {
    plugins.push(
      compressPlugin({
        ext: '.gz',
        algorithm: 'brotliCompress',
        deleteOriginFile,
      })
    )
  }

  return plugins;
}