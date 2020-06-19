/*******************
 *== 码头方模块接口 ==*
 *******************/

import fetch from '../fetch'
import { SG } from '../../utils/api-urls'

function joinUrl(url) {
  return `${SG}${url}`
}

/**
 * 审核垃圾申报
 */
export async function auditGarbageDeclare(params) {
  const { data } = await fetch({
    url: joinUrl('/api/DockReceiveGarbage/InsertDockReceiveGarbage'),
    method: 'post',
    data: params
  })
  return data
}

/**
 * 批量审核垃圾申报
 */
export async function batchAuditGarbageDeclare(params) {
  const res = await fetch({
    url: joinUrl('/api/DockReceiveGarbage/BatchReceiveGarbage'),
    method: 'post',
    data: params
  })
  return res
}

/**
 * 审核生活污水申报
 * @param {*} params 
 */
export async function auditLifeSewageDeclare(params) {
  const { data } = await fetch({
    url: joinUrl('/api/DockReceiveWater/InsertDockReceiveWater'),
    method: 'post',
    data: params,
  })
  return data
}

/**
 * 批量审核生活污水申报
 * @param {*} params 
 */
export async function batchAuditLifeSewageDeclare(params) {
  const res = await fetch({
    url: joinUrl('/api/DockReceiveWater/BatchReceiveWater'),
    method: 'post',
    data: params,
  })
  return res
}

/**
 * 审核岸电信息申报
 * @param {*} params 
 */
export async function auditShorePowerDeclare(params) {
  const { data } = await fetch({
    url: joinUrl('/api/DockReceivePower/InsertDockReceivePower'),
    method: 'post',
    data: params,
  })
  return data
}

/**
 * 批量审核岸电信息申报
 * @param {*} params 
 */
export async function batchAuditShorePowerDeclare(params) {
  const res = await fetch({
    url: joinUrl('/api/DockReceivePower/BatchReceivePower'),
    method: 'post',
    data: params,
  })
  return res
}
/**
 * 审核船油污水申报
 * @param {*} params 
 */
export async function auditShipSewageDeclare(params) {
  const { data } = await fetch({
    url: joinUrl('/api/DockReceiveOiledWater/InsertDockReceiveOiledWater'),
    method: 'post',
    data: params,
  })
  return data
}

/**
 * 批量审核船油污水申报
 * @param {*} params 
 */
export async function batchAuditShipSewageDeclare(params) {
  const res = await fetch({
    url: joinUrl('/api/DockReceiveOiledWater/BatchReceiveOiledWater'),
    method: 'post',
    data: params,
  })
  return res
}

/**
 * 获取未审批申报记录
 */
export async function getUnapprovedDeclares() {
  const res = await fetch({
    url: joinUrl('/api/DockDeclare/GetUserAllUnapprovedDeclare'),
    method: 'post'
  })
  return res || {}
}

/**
 * 获取申报记录详情
 */
export async function getDeclare(id) {
  const { data } = await fetch({
    url: joinUrl('/api/DockDeclare/GetDeclareDetailById'),
    method: 'post',
    data: id
  })
  return data
}

/**
 * 获取已审核申报记录详情
 */
export async function getAuditDeclare(id) {
  const { data } = await fetch({
    url: joinUrl('/api/DockDeclare/GetReceiveDetailById'),
    method: 'post',
    data: id
  })
  return data
}

/**
 * 根据用户Id获取所有关联码头下的申报记录中的船舶名称
 */
export async function getShips(id) {
  const { data } = await fetch({
    url: joinUrl('/api/DockDeclare/GetUserDeclareShipNames'),
    method: 'post',
    data: id
  })
  return data
}

/**
 * 查询条件获取所有码头用户相关的申报记录详情
 */
export async function getDeclaresWithCondition(params) {
  const res = await fetch({
    url: joinUrl('/api/DockDeclare/GetUserAllDeclareWithCondition'),
    method: 'post',
    data: params
  })
  return res
}

/**
 * 删除垃圾
 */
export async function deleteGarbageDeclare(params) {
  const res = await fetch({
    url: joinUrl('/api/DockDeclareGarbage/DeleteDockDeclareGarbage'),
    method: 'post',
    data: params
  })
  return res
}

/**
 * 删除生活污水
 */
export async function deleteLifeSewageDeclare(params) {
  const res = await fetch({
    url: joinUrl('/api/DockDeclareWater/DeleteDockDeclareWater'),
    method: 'post',
    data: params
  })
  return res
}


/**
 * 删除岸电
 */
export async function deleteShorePowerDeclare(params) {
  const res = await fetch({
    url: joinUrl('/api/DockDeclarePower/DeleteDockDeclarePower'),
    method: 'post',
    data: params
  })
  return res
}

/**
 * 删除油污水
 */
export async function deleteShipSewageDeclare(params) {
  const res = await fetch({
    url: joinUrl('/api/DockDeclareOiledWater/DeleteDockDeclareOiledWater'),
    method: 'post',
    data: params
  })
  return res
}