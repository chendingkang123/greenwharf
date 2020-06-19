import Taro from '@tarojs/taro'

const Factory = (params) => {
  const { noLoading, ..._params } = params
  !noLoading && Taro.showLoading()
  const mergeConfig = Object.assign({}, {
    header: {
      'content-type': 'application/json',
    }
  }, _params)
  // notice! 除了登录接口, 其他都需要在header加Authorization和将参数序列化
  if (mergeConfig.header['content-type'] !== 'application/x-www-form-urlencoded') {
    mergeConfig.header.Authorization =  `Bearer ${Taro.getStorageSync('token')}` || ''
    mergeConfig.data = JSON.stringify(mergeConfig.data)
  }
  return new Promise((resolve, reject) => {
    Taro
      .request(mergeConfig)
      .then(res => {
        !noLoading && Taro.hideLoading()
        const { statusCode, data } = res
        switch (statusCode) {
          case 500:
            Taro.showToast({
              title: data.msg || 'server error :d',
              icon: 'none'
            })
            break
          case 200:
            const { data: isSuccess } = data
            if (isSuccess === false) {
              Taro.showToast({
                title: data.msg || 'bad request',
                icon: 'none'
              })
              break
            } else {
              return resolve(data)
            }
          case 400:
            Taro.showToast({
              title: data.msg || 'bad request',
              icon: 'none'
            })
            break
          case 401:
            Taro.removeStorageSync('token')
            Taro.removeStorageSync('userInfo')
            Taro.removeStorageSync('wxUserInfo')
            // Taro.showToast({
            //   title: '请先登陆',
            //   icon: 'none'
            // })
            break
          case 404:
            Taro.showToast({
              title: 'not find',
              icon: 'none'
            })
            break
          default:
            Taro.showToast({
              title: 'unknow error',
              icon: 'none'
            })
            break
        }
        return reject(res)
      })
      .catch(error => {
        !noLoading && Taro.hideLoading()
        const { errMsg } = error
        Taro.showToast({
          title: errMsg === 'request:fail ' ? '网络错误' : errMsg,
          icon: 'none'
        })
        reject(error)
      })
    })
}

export default Factory
