import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.styl'

import { PublicService } from '../../service/public-service'

export default class Login extends Component {

  config = {
    navigationBarTitleText: '授权申请'
  }

  componentWillMount () {}

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  // 获取用户信息
  onGetUserInfo = async (e) => {
    console.log(e.detail)
    const { errMsg, rawData } = e.detail
    if (errMsg === 'getUserInfo:ok') {
      Taro.setStorageSync('wxUserInfo', JSON.parse(rawData))
    }
    this.onSign()
  }
  /**
   * 登陆
   * @description 如果当前用户没有注册, 将调用注册接口; 如果当前用户没有绑定手机号, 将跳转到手机绑定页面.
   */
  // onSign = async () => {
  //   await this.handleAuth()
  //   const currentUser = await this.getUserInfo()
  //   if (currentUser === null) {
  //     await PublicService.registerWharf()
  //   }
  //   if (!currentUser || !currentUser.phone) {
  //     return Taro.redirectTo({
  //       url: '/pages/mine/components/bind-info?nextPath=/pages/message/index'
  //     })
  //   }
  //   Taro.switchTab({
  //     url: '/pages/message/index'
  //   })
  // }
  onSign = async () => {
    const userId = await this.handleRegister()
    await this.handleAuth(userId)
    const currentUser = await this.getUserInfo()
    if (!currentUser || !currentUser.phone) {
      return Taro.redirectTo({
        url: '/pages/mine/components/bind-info?nextPath=/pages/message/index'
      })
    }
    Taro.switchTab({
      url: '/pages/message/index'
    })
  }
  // 注册并返回一个userId
  handleRegister = async () => {
    Taro.showLoading()
    let isNetWorkError = false
    let accountInfo = {}
    const res = await Taro.login().catch(error => {
      Taro.hideLoading()
      isNetWorkError = true
    })
    if (!isNetWorkError) {
      accountInfo = Taro.getAccountInfoSync()
    }
    return await PublicService.registerWharf({
      appId: accountInfo.miniProgram ? accountInfo.miniProgram.appId : '',
      jsCode: res ? res.code : ''
    })
  }
  /**
   * 授权处理
   * @notice expires_in单位为秒
   */
  handleAuth = async (userId) => {
    const res = await Taro.login()
    const accountInfo = Taro.getAccountInfoSync()
    const params = {
      username: userId,
      password: res ? res.code : '',
      grant_type: 'password',
      client_id: 'ShipGarbageApp',
      group_no: 'ShipGarbageReceiving',
      client_secret: 'secret',
      password_type: 'wechat_jscode',
      appid: (accountInfo && accountInfo.miniProgram) ? accountInfo.miniProgram.appId : ''
    }
    const { access_token, expires_in } = await PublicService.getToken(params)
    const expirationTime = Date.now() + expires_in * 1000
    Taro.setStorageSync('token', access_token)
    Taro.setStorageSync('expirationTime', expirationTime)
  }
  // 获取用户信息(这个用户信息为后台存储的用户信息)
  getUserInfo = async () => {
    const res = await PublicService.getUserInfo()
    if (res) {
      Taro.setStorageSync('userInfo', res)
    }
    return res
  }

  goBack = () => {
    Taro.switchTab({
      url: '/pages/message/index'
    })
    // Taro.redirectTo({
    //   url: '/pages/message/index'
    // })
  }
  render () {
    return (
      <View className='login'>
        <View className="auth">
          <View className="logo-wrapper">
            <Image className="logo" src={require("../../static/images/logo_v2.png")} />
          </View>
          <View className="description">
            <View className="item">* 绿色港口申请以下授权</View>
            <View className="item">获取您的公开信息(头像, 昵称等)</View>
          </View>

          <View className="btn-wrapper">
            <Button
              className="action x-default"
              onClick={this.goBack}
              >
              拒绝
            </Button>
            <Button
              type="primary"
              className="action"
              openType="getUserInfo"
              onGetuserinfo={this.onGetUserInfo}>
              授权登录
            </Button>
          </View>
        </View>
      </View>
    )
  }
}
