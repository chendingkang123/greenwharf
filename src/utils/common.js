import Taro from '@tarojs/taro'

/**
 * 用户是否已经授权
 * @param {String} scopeType 授权类型
 * @returns {Promise<boolean>}
 */
export function isAuthoraze(scopeType='scope.userLocation') {
  return new Promise((resolve, reject) => {
    Taro.getSetting({
      success(res) {
        if (!res.authSetting[scopeType]) {
          Taro.authorize({
            scope: scopeType,
            success() {
              return resolve(true)
            },
            fail() {
              return resolve(false)
            }
          })
        } else {
          return resolve(true)
        }
      },
      fail(error) {
        reject(error)
      }
    })
  })
}

/**
 * 获取当前地理位置
 * @returns {Promise<any>} 地理位置信息
 */
export function getLocation() {
  return new Promise((resolve, reject) => {
    Taro.getLocation({
      type: 'wgs84',
      success(res) {
        resolve(res)
      },
      fail(error) {
        reject(error)
      }
    })
  })
}

export function getUserInfo() {
  return new Promise((resolve, reject) => {
    Taro.getUserInfo({
      success(res) {
        resolve(res)
      },
      fail(error) {
        reject(error)
      }
    })
  })
}

/**
 * 引导授权
 * @param {String} scopeType 授权类型
 * @returns {Promise<boolean>} 用户授权与否
 */
export function guideAuthoraze(scopeType, msg) {
  return new Promise((resolve) => {
    Taro.showModal({
      title: '提示',
      content: '需要您进行授权使',
      success(res) {
        if (res.confirm) {
          Taro.openSetting({
            success(res) {
              return res.authSetting[scopeType]
                ? resolve(true)
                : resolve(false)
            }
          })
        } else {
          return resolve(false)
        }
      },
      fail() {
        return resolve(false)
      }
    })
  })
}

// 检查和应用新版本
export function checkAndApplyUpdate() {
  if (Taro.canIUse("getUpdateManager")) {
    const updateManager = Taro.getUpdateManager()
    updateManager.onCheckForUpdate((isHasUpdate) => {
      if (isHasUpdate) {
        updateManager.onUpdateReady(() => {
          Taro.showModal({
            title: '自动更新提示',
            content: '新版本已经准备好，是否重启应用?',
            success(res) {
              if (res.confirm) {
                updateManager.applyUpdate()
              }
            }
          })
        })
        updateManager.onUpdateFailed(() => {
          Taro.showModal({
            title: '自动更新失败',
            content: '新版版已经上线, 请您删除当前小程序, 重新打开即可应用新版本'
          })
        })
      }
    })
  } else {
    Taro.showModal({
      title: '温馨提示',
      content: '当前微信版本过低, 无法使用自动更新功能, 请将微信升级到最新版本后重试。'
    })
  }
}