/******************
 *== 公共模块接口 ==*
 ******************/

import fetch from '../fetch'
import { CA, SG } from '../../utils/api-urls'

function joinUrl(url) {
  return `${SG}${url}`
}

/**
 * 获取token|刷新token
 * @notice 无文档, 注意这个接口的'Content-Type'
 * @param {GetToken} params 
 * @interface GetToken {
 *   username: string,
 *   password: string,
 *   grant_type: string,
 *   client_id: string,
 *   client_secret: string,
 *   refresh_token?: string,
 *   vcode_id?: number,
 * }
 * @returns {Promise<any>}
 */
export async function getToken(params) {
  const data = await fetch({
    url: `${CA}/connect/token`,
    method: 'post',
    data: params,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  })
  return data
}

/**
 * 获取码头列表
 */
// export async function getWharfs() {
//   const { data } = await fetch({
//     url: joinUrl('/api/DockWharf/GetAllWharf'),
//     method: 'post',
//   })
//   return data
// }

/**
 * 发送验证码
 * @param {string} phoneNum
 */
export async function sendVerifyCode(phoneNum) {
  const { data } = await fetch({
    url: joinUrl('/api/Phone/SendBindPhoneVCode'),
    method: 'post',
    data: phoneNum
  })
  return data
}

/**
 * 绑定手机号
 * @param {Object} params
 */
export async function bindPhone(params) {
  const { data } = await fetch({
    url: joinUrl('/api/Phone/BindPhone'),
    method: 'post',
    data: params
  })
  return data
}

/**
 * 注册码头方
 */
export async function registerWharf(params) {
  const { data } = await fetch({
    url: joinUrl('/api/User/RegisterWharfUser'),
    method: 'post',
    data: params,
  })
  return data
}

/**
 * 获取当前用户信息
 * 返回null时, 表示该用户没有在后台注册过
 * @returns {Promise<null|Object>}
 */
export async function getUserInfo() {
  const { data } = await fetch({
    url: joinUrl('/api/User/GetCurrentUserInfo'),
    method: 'post'
  })
  return data
}
