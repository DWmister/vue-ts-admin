import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, getUserInfo } from '@/api/users'
import { getToken, setToken, removeToken, getProp, setProp, removeProp } from '@/utils/cookies'
import store from '@/store'

export interface IUserState {
  token: string
  name: string
  avatar: string
  roles: string[]
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public name = getProp('name') || ''
  public avatar = getProp('avatar') || ''
  public roles: string[] = []

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Action
  public async Login(userInfo: { username: string, password: string }) {
    let { username, password } = userInfo
    username = username.trim()
    const { data } = await login({ username, password })
    setToken(data.token)
    setProp('name', data.name)
    setProp('avatar', data.avatar)
    this.SET_TOKEN(data.token)
    this.SET_NAME(data.name)
    this.SET_AVATAR(data.avatar)
  }

  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }

  @Action
  public async GetUserInfo() {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }
    const { data } = await getUserInfo({ /* Your params here */ })
    // const data = {
    //   user: {
    //     roles: ['admin'],
    //     avatar: 'https://wework.qpic.cn/bizmail/saHYIvB2RH2BLjTqpib3WKo1OD3HLdFKdeQIJicQQvhnv3Bib7hTHCiaOg/0',
    //     name: 'admin'
    //   }
    // }
    if (!data) {
      throw Error('Verification failed, please Login again.')
    }
    const { roles, name, avatar } = data.user
    // roles must be a non-empty array
    if (!roles || roles.length <= 0) {
      throw Error('GetUserInfo: roles must be a non-null array!')
    }
    this.SET_ROLES(roles)
    this.SET_NAME(name)
    this.SET_AVATAR(avatar)
  }

  @Action
  public async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    removeToken()
    removeProp('name')
    removeProp('avatar')
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }
}

export const UserModule = getModule(User)
