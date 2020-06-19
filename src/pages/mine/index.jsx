import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.styl'

import { AtList, AtListItem } from 'taro-ui'
import { isNotSign } from '../common-methods'

const recordPath = '/pages/mine/components/record'
const bindPhonePath = '/pages/mine/components/bind-info'
const loginPath = '/pages/login/index'

/**
 * 该页面为码头方用户界面
 */
export default class Mine extends Component {

  config = {
    navigationBarTitleText: '我的'
  }

  state = {
    userInfo: {},
    wxUserInfo: {},
    isNotSign: true
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  async componentDidShow () {
    let userInfo = Taro.getStorageSync('userInfo') || {}
    let wxUserInfo = Taro.getStorageSync('wxUserInfo') || {}

    this.setState({
      userInfo,
      wxUserInfo,
      isNotSign: isNotSign()
    })
  }

  componentDidHide () { }

  routeTo(path) {
    if (path === loginPath) {
      const { phone = '' } = this.state.userInfo
      path = `${path}?phone=${phone}`
    }
    Taro.navigateTo({
      url: path
    })
  }

  render () {
    const { userInfo, wxUserInfo, isNotSign } = this.state
    return (
      <View className='mine'>
        <View className="area-userinfo">
          <View className="avatar">
            <Image mode="aspectFill" className="icon" src={wxUserInfo.avatarUrl} />
          </View>
          <View className="description">
            {
              isNotSign
                ? <View style="color: rgb(0, 167, 0);" onClick={() => this.routeTo(loginPath)}>点此登陆</View>
                :
                  <Block>
                    <View className="phone">{userInfo.phone || '请先填写必要信息'}</View>
                    <View className="update-phone" onClick={() => this.routeTo(bindPhonePath)}>
                      {userInfo.phone ? '修改' : '完善'}信息
                    </View>
                  </Block>
            }
          </View>
        </View>
        <AtList>
          <AtListItem iconInfo={{ color: '#333', value: 'calendar'}} title='审核记录' arrow='right' onClick={() => this.routeTo(recordPath)} />
        </AtList>
      </View>
    )
  }
}