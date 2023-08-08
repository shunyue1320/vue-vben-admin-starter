/**
 * @description: 登录参数
 */
export interface LoginParams {
  username: string
  password: string
}
/**
 * @description: 登录返回值
 */
export interface LoginResultModel {
  userId: string | number
  token: string
  role: RoleInfo
}

export interface RoleInfo {
  roleName: string
  value: string
}

/**
 * @description: 获取用户信息返回值
 */
export interface GetUserInfoModel {
  roles: RoleInfo[]
  // 用户id
  userId: string | number
  // 用户名
  username: string
  // 真实名字
  realName: string
  // 头像
  avatar: string
  // 介绍
  desc?: string
}
