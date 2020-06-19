import Taro from '@tarojs/taro'

// 判断登陆状态(没有token||expirationTime过期)
export function isNotSign() {
  const expirationTime = Taro.getStorageSync('expirationTime')
  const token = Taro.getStorageSync('token')
  return !token || expirationTime < Date.now()
}
