import { defHttp } from '@/utils/http/axios'
import { ErrorMessageMode } from '#/axios'
import { GetUserInfoModel, LoginParams, LoginResultModel } from './model/userModel'

enum Api {
  Login = '/login',
  Logout = '/logout',
  GetUserInfo = '/getUserInfo',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
}

export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>({ url: Api.Login, params }, { errorMessageMode: mode })
}

export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' })
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout })
}
