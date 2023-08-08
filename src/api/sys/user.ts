import { defHttp } from '@/utils/http/axios'
import { ErrorMessageMode } from '#/axios'
import { LoginParams, LoginResultModel } from './model/userModel'

export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: '/login',
      params,
    },
    {
      errorMessageMode: mode,
    },
  )
}
