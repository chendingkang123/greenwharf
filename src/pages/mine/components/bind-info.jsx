import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.styl'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { PublicService } from '../../../service/public-service'

export default class BindInfo extends Component {

  state = {
    formData: {
      phone: '',
      username: '',
      verifyCode: ''
    },
    messageData: {},
    sendText: '发送验证码'
  }
  componentWillMount () {
    const { phone: phone = '', realName: username = '' } = Taro.getStorageSync('userInfo')
    this.setState({
      formData: {
        phone,
        username,
        verifyCode: '',
      }
    })
    // 两个不为空时 -> 修改信息, 反之 -> 完善信息
    Taro.setNavigationBarTitle({
      title: phone && username  ? '修改信息' : '完善信息'
    })
  }
  componentDidMount () { }
  componentWillUnmount () { }
  componentDidShow () {}
  componentDidHide () { }
  onChange = (param) => {
    return (value) => {
      const copyFormData = {...this.state.formData}
      copyFormData[param] = value
      this.setState({
        formData: copyFormData
      })
    }
  }
  // 提交
  onSubmit = async () => {
    const { formData: { phone, verifyCode, username }, messageData } = this.state
    if (!phone) {
      return Taro.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
    }
    if (!username) {
      return Taro.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
    }
    if (!verifyCode) {
      return Taro.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    }
    const { id } = messageData
    const params = {
      id,
      code: verifyCode,
      username,
    }
    // 记录绑定信息
    Taro.setStorage({
      key: 'bindInfo',
      data: {
        phone,
        username,
      }
    })
    const isSuccess = await PublicService.bindPhone(params)
    const { nextPath } = this.$router.params
    if (isSuccess) {
      // 绑定成功后重新获取信息存储
      const userInfo = await PublicService.getUserInfo()
      Taro.setStorageSync('userInfo', userInfo)
      Taro.showToast({
        title: '操作成功',
        icon: 'success'
      })
      const timer = setTimeout(() => {
        this.setState({
          formData: {
            phone: '',
            verifyCode: ''
          },
        })
        // 携带返回页面(nextPath)
        if (nextPath) {
          Taro.switchTab({
            url: nextPath
          })
        } else {
          Taro.navigateBack()
        }
        clearTimeout(timer)
      }, 1000)
    }
  }
  // 限制短信发送
  handleDelay = () => {
    let timer = null
    const messageData = {...this.state.messageData}
    const excute = () => {
      if (timer) {
        clearTimeout(timer)
      }
      if (messageData.coolDownTime > 0) {
        messageData.coolDownTime -= 1
        const sendText = `${messageData.coolDownTime}秒后发送`
        timer = setTimeout(() => {
          this.setState({
            sendText,
            messageData,
          })
          excute()
        }, 1000)
      } else {
        this.setState({
          sendText: '发送验证码',
        })
      }
    }
    excute()
  }
  // 发生验证码
  sendVCode = async () => {
    const { coolDownTime } = this.state.messageData
    if (coolDownTime > 0) {
      return Taro.showToast({
        title: `请稍后再发送`,
        icon: 'none'
      })
    }
    const phoneN = this.state.formData.phone
    if (!phoneN || !/1[3456789]\d{9}/.test(phoneN)) {
      return Taro.showToast({
        title: phoneN ? '请输入正确的手机号' : '请输入手机号',
        icon: 'none'
      })
    }
    const messageData = await PublicService.sendVerifyCode(phoneN)
    if (messageData.id) {
      Taro.showToast({
        title: '发送成功',
        icon: 'success'
      })
      this.setState({
        messageData
      }, this.handleDelay)
    } else {
      Taro.showToast({
        title: '发送失败',
        icon: 'none'
      })
    }
  }
  render () {
    const { formData, sendText } = this.state
    return (
      <View className='update-wrapper'>
        <View className='x-title'>请填写以下信息</View>
        <AtForm>
          <AtInput clear name='phone' title='手机号码' placeholder='请输入' value={formData.phone} onChange={this.onChange('phone')} />
          <AtInput clear name='username' title='姓名' placeholder='请输入' value={formData.username} onChange={this.onChange('username')} />
          <AtInput name='verifyCode' title='短信验证码' placeholder='请输入' value={formData.verifyCode} onChange={this.onChange('verifyCode')} >
            <View style="width: 180rpx; color: #44b549;" onClick={this.sendVCode}>{sendText}</View>
          </AtInput>
        </AtForm>
        <View style="margin: 32rpx;">
          <AtButton className="x-button" type='primary' size='normal' onClick={this.onSubmit}>提交</AtButton>
        </View>
      </View>
    )
  }
}
