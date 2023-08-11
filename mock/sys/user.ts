import { resultError, resultSuccess } from '../_util'

export function createFakeUserList() {
  return [
    {
      userId: '1',
      username: 'vben',
      realName: 'Vben Admin',
      avatar: '',
      desc: 'manager',
      password: '123456',
      token: 'fakeToken1',
      homePath: '/dashboard/analysis',
      roles: [
        {
          roleName: 'Super Admin',
          value: 'super',
        },
      ],
    },
    {
      userId: '2',
      username: 'test',
      password: '123456',
      realName: 'test user',
      avatar: '',
      desc: 'tester',
      token: 'fakeToken2',
      homePath: '/dashboard/workbench',
      roles: [
        {
          roleName: 'Tester',
          value: 'test',
        },
      ],
    },
  ]
}

export default [
  {
    url: '/basic-api/login',
    timeout: 200,
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body
      const checkUser = createFakeUserList().find(
        (item) => item.username === username && password === item.password,
      )
      if (!checkUser) {
        return resultError('Incorrect account or password！')
      }
      const { userId, username: _username, token, realName, desc, roles } = checkUser
      return resultSuccess({
        roles,
        userId,
        username: _username,
        token,
        realName,
        desc,
      })
    },
  },
]
