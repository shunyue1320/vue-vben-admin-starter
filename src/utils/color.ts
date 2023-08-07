/**
 * 判断是否是十六进制颜色值.
 * 输入形式可为 #fff000 #f00
 * @param   String  color 十六进制颜色值
 * @return  Boolean
 */
export function isHexColor(color: string) {
  const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
  return reg.test(color)
}

/**
 * 将HEX颜色转换为RGB
 * @param {string} hex 要变换的颜色
 * @returns 返回RGB颜色
 */
export function hexToRGB(hex: string) {
  let sHex = hex.toLowerCase()
  if (isHexColor(hex)) {
    if (sHex.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sHex.slice(i, i + 1).concat(sHex.slice(i, i + 1))
      }
      sHex = sColorNew
    }
    const sColorChange: number[] = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sHex.slice(i, i + 2)))
    }
    return 'RGB(' + sColorChange.join(',') + ')'
  }
  return sHex
}

/** 判断给定的颜色是否为暗色 */
export function colorIsDark(color: string) {
  if (!isHexColor(color)) return
  const [r, g, b] = hexToRGB(color)
    .replace(/(?:\(|\)|rgb|RGB)*/g, '')
    .split(',')
    .map((item) => Number(item))
  return r * 0.299 + g * 0.578 + b * 0.114 < 192
}

/**
 * 给定百分比值，使HEX颜色变暗
 * @param {string} color 颜色
 * @param {number} amount 比值
 * @returns {string} 返回变暗的颜色
 */
export function darken(color: string, amount: number) {
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color
  amount = Math.trunc((255 * amount) / 100)
  return `#${subtractLight(color.substring(0, 2), amount)}${subtractLight(
    color.substring(2, 4),
    amount,
  )}${subtractLight(color.substring(4, 6), amount)}`
}

/**
 * 给定一个十六进制颜色值和一个数值，将该颜色减少一定量的亮度
 * @param {string} color 颜色
 * @param {number} amount 减亮比值
 * @returns {string} 返回减少一定量亮度的颜色
 */
function subtractLight(color: string, amount: number) {
  const cc = parseInt(color, 16) - amount
  const c = cc < 0 ? 0 : cc
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}

/**
 * 将传入的十六进制颜色转换为整数，并将其加上给定的亮度值。然后，它会检查结果是否大于 255，并在必要时返回 255。最后，它将新的整数颜色值转换回十六进制格式并将其返回。
 * 将通过的百分比与十六进制颜色的R、G、B相加
 * @param {string} color The color to change
 * @param {number} amount The amount to change the color by
 * @returns {string} The processed part of the color
 */
function addLight(color: string, amount: number) {
  const cc = parseInt(color, 16) + amount
  const c = cc > 255 ? 255 : cc
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}

/**
 * 添加亮度到给定的颜色中并返回新 HEX 颜色。
 * @param {string} color 要更改的颜色
 * @param {number} amount 更改颜色的百分比
 * @returns {string} 返回处理后的颜色 #xxxxxx
 */
export function lighten(color: string, amount: number) {
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color
  amount = Math.trunc((255 * amount) / 100)
  return `#
  ${addLight(color.substring(0, 2), amount)}
  ${addLight(color.substring(2, 4), amount)}
  ${addLight(color.substring(4, 6), amount)}`
}
