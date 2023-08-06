import UTF8, { parse } from 'crypto-js/enc-utf8'
import pkcs7 from 'crypto-js/pad-pkcs7'
import ECB from 'crypto-js/mode-ecb'
import { encrypt, decrypt } from 'crypto-js/aes'
import Base64 from 'crypto-js/enc-base64'
import md5 from 'crypto-js/md5'

export interface EncryptionParams {
  key: string
  iv: string
}

export class AesEncryption {
  private key
  private iv

  constructor(opt: Partial<EncryptionParams> = {}) {
    const { key, iv } = opt
    if (key) {
      this.key = parse(key)
    }
    if (iv) {
      this.iv = parse(iv)
    }
  }

  get getOptions() {
    return {
      mode: ECB,
      padding: pkcs7,
      iv: this.iv,
    }
  }

  /** 通过AES加密 */
  encryptByAES(cipherText: string) {
    return encrypt(cipherText, this.key, this.getOptions).toString()
  }

  /** 通过AES解密 */
  decryptByAES(cipherText: string) {
    return decrypt(cipherText, this.key, this.getOptions).toString(UTF8)
  }
}

/** 按基数 64 加密 */
export function encryptByBase64(cipherText: string) {
  return UTF8.parse(cipherText).toString(Base64)
}

/** 按基数 64 解密 */
export function decodeByBase64(cipherText: string) {
  return Base64.parse(cipherText).toString(UTF8)
}

/** 按 MD5 加密 */
export function encryptByMd5(password: string) {
  return md5(password).toString()
}
