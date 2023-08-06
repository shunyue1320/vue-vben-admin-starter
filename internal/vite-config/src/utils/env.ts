import { join } from 'node:path';

import dotenv from 'dotenv';
import { readFile } from 'fs-extra';


/**
 * 获取当前环境下生效的配置文件名
 */
function getConfFiles() {
  // 从 npm script 中获取 mode 参数
  const script = process.env.npm_lifecycle_script as string;
  const reg = new RegExp('--mode ([a-z_\\d]+)');
  const result = reg.exec(script);
  if (result) {
    const mode = result[1];
    return ['.env', `.env.${mode}`];
  }
  return ['.env', '.env.production'];
}

/**
 * 获取以指定前缀开头的环境变量
 * @param match 前缀
 * @param confFiles 后缀
 */
export async function getEnvConfig(match = 'VITE_GLOB_', confFiles = getConfFiles()) {
  let envConfig = {};

  for (const confFile of confFiles) {
    try {
      const envPath = await readFile(join(process.cwd(), confFile), { encoding: 'utf8' });
      const env = dotenv.parse(envPath);
      envConfig = { ...envConfig, ...env };
    } catch (e) {
      console.error(`Error in parsing ${confFile}`, e);
    }
  }
  const reg = new RegExp(`^${match}`);
  Object.keys(envConfig).forEach((key) => {
    if (!reg.test(key)) {
      Reflect.deleteProperty(envConfig, key);
    }
  });
  return envConfig;
}