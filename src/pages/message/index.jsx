import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, CheckboxGroup } from '@tarojs/components'
import './index.styl'

import { AtTabs, AtTabsPane, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtActionSheet, AtActionSheetItem, AtTextarea } from 'taro-ui'
import MessageItem from '../../components/message-item'
import { isNotSign } from '../common-methods'
import { WharfService } from '../../service/wharf-service'
import { receiveOptions, unreceiveReasonsV2 } from './components/source'

const scrollTop = 0
const Threshold = 20

/**
 * 根据declareType的数据映射(这里的declareType跟tab下标一致, 0为全部, 如果要调整tabList, 需要做修改)
 */
const mapData = {
  '0': {
    listName: 'allDeclares',
  },
  '1': {
    listName: 'junkDeclares',
    batchMethod: 'batchAuditGarbageDeclare',
  },
  '2': {
    listName: 'lifeSewageDeclares',
    batchMethod: 'batchAuditLifeSewageDeclare',
  },
  '3': {
    listName: 'shipSewageDeclares',
    batchMethod: 'batchAuditShipSewageDeclare',
  },
  '4': {
    listName: 'shorePowerDeclares',
    batchMethod: 'batchAuditShorePowerDeclare',
  }
}

const batchOperat = { // 批量操作对应申报的值; 如batchOperat为1是, 就表示当前进行批量申报的是垃圾, 以此类推...
  '1': false, // 垃圾申报批量操作的值
  '2': false, // 生活污水...
  '3': false, // 船舶油污水...
  '4': false, // 岸电...
}

export default class Message extends Component {

  config = {
    navigationBarTitleText: '申报消息'
  }

  state = {
    current: 0,
    tabList: [
      { title: '全部' },
      { title: '垃圾' },
      { title: '生活污水' },
      { title: '船舶油污水' },
      { title: '岸电' },
    ],

    allDeclares: [], // 全部申报
    junkDeclares: [], // 垃圾申报
    lifeSewageDeclares: [], // 生活污水申报
    shipSewageDeclares: [], // 船油污水申报
    shorePowerDeclares: [], // 岸电申报

    batchOperat: batchOperat,
    restHeight: 0,
    isOpened: false, // 是否显示AtActionSheet
    batchOperatType: '', // 批量操作类型('1' -> 不接收, '3' -> 接收)
    isOpenModal: false, // 是否显示模态框(填写其他原因)
    tempParams: {}, // 临时保存参数变量; 如果选择其他原因, 则会已选的参数临时保存至tempParams
    isNotSign: false, // 是否为未登陆
    isDeleteModal: false, // 是否显示删除确认
    currentMessage: {}
  }

  async componentWillMount () {}

  onShareAppMessage() {
    return {
      title: '绿水青山, 蓝天白云',
      path: `/pages/message/index`,
      imageUrl: require('../../static/images/share-v2.png')
    }
  }

  componentDidMount () {
    const windowHeight = Taro.getSystemInfoSync().windowHeight
    const windowWidth = Taro.getSystemInfoSync().windowWidth
    // 计算rpx
    const restHeight = windowHeight * 750 / windowWidth - (88 /* tab栏高度 */)
    this.setState({
      restHeight,
    })
  }

  componentWillUnmount () { }

  async componentDidShow () {
    await this.getUnapprovedDeclares().catch(error => console.log(error))
    this.setState({
      isNotSign: isNotSign()
    })
  }

  componentDidHide () {
    this.setState({
      batchOperat: batchOperat
    })
  }

  handleClick (value) {
    this.setState({
      current: value,
      isOpened: false,
    })
  }
  /**
   * 全选&取消全选
   * @description 将操作的列表深拷贝后修改状态, 再更新state
   */
  onSelectAll = () => {
    const { list, listName, current } = this.getListInfo()
    const batchOperat = this.getBatchOperat()
    for (const item of list) {
      if (batchOperat[current]) {
        item.checked = true
      }
      else {
        item.checked = false
      }
    }
    const keyValueObj = {
      [listName]: list,
      batchOperat,
    }
    this.setState(keyValueObj)
  }
  /**
   * 选择单个消息
   * @description same as above
   */
  selectSingle = (data) => {
    const { list, listName, current } = this.getListInfo()
    const targetDeclare = list.find(item => +item.id === +data.id)
    // 这里直接改了list里面的数据(引用类型)
    targetDeclare.checked = !targetDeclare.checked
    const batchOperat = this.getBatchOperat()
    batchOperat[current] = list.every(item => item.checked) // 当前tab下的所有选项都选中时, 将下方的'全选'勾上
    const keyValueObj = {
      [listName]: list,
      batchOperat,
    }
    this.setState(keyValueObj)
  }

  // 选择批量操作
  onBatchOperat = (actionType) => {
    const keyValueObj = {
      batchOperatType: actionType,
      isOpened: true
    }
    this.setState(keyValueObj)
  }
  // 批量操作
  async handleBatchOperat(params={}) {
    const batchMethod = this.getBatchMethod()
    const { list } = this.getListInfo(false)
    const ids = []
    for (const item of list) {
      if (item.checked) {
        ids.push(item.id)
      }
    }
    if (!ids.length) {
      return Taro.showToast({
        title: '请勾选消息',
        icon: 'none'
      })
    }
    params.declareIdsToReceive = ids
    const { code, msg } = await WharfService[batchMethod](params)
    if (code === 200) {
      Taro.showToast({
        title: msg || '处理成功',
        icon: 'none'
      })
      const timer = setTimeout(() => {
        clearTimeout(timer)
        this.getUnapprovedDeclares()
      }, 1000)
    }
  }
  // 进入申报处理|详情页面
  routeTo = (id, status) => {
    let url
    if (status === 2) {
      url = `/pages/message/components/detail?id=${id}`
    } else {
      url = `/pages/message/components/handle?id=${id}`
    }
    Taro.navigateTo({
      url,
    })
  }
  /**
   * 获取未申报消息
   * 1 垃圾信息
   * 2 生活污水
   * 3 油污水
   * 4 岸电信息
   */
  getUnapprovedDeclares = async () => {
    const { data = [] } = await WharfService.getUnapprovedDeclares()
    const userInfo = Taro.getStorageSync('userInfo') || {}
    // 没有手机号时, 将强制跳转到绑定手机号页面
    if (!userInfo.phone) {
      return Taro.navigateTo({
        url: '/pages/mine/components/bind-info'
      })
    }
    const copyDeclares = JSON.parse(JSON.stringify(data))
    const keyValueObj = {
      junkDeclares: [],
      lifeSewageDeclares: [],
      shipSewageDeclares: [],
      shorePowerDeclares: [],
      allDeclares: copyDeclares,
    }
    for (const item of copyDeclares) {
      const copyItem = {...item}
      const type = copyItem.declareType
      copyItem.checked = false // 添加checked属性, 用于勾选操作
      if (type === 1) {
        keyValueObj.junkDeclares.push(copyItem)
      } else if (type === 2) {
        keyValueObj.lifeSewageDeclares.push(copyItem)
      } else if (type === 3) {
        keyValueObj.shipSewageDeclares.push(copyItem)
      } else {
        keyValueObj.shorePowerDeclares.push(copyItem)
      }
    }
    this.setState(keyValueObj)
  }
  // 动作面板
  onActionSheet = (option) => {
    const { batchOperatType } = this.state
    const params = {
      batchReceiveType: +batchOperatType,
      batchRemarks: option.value === '4' ? '' : option.label // 其他原因时,将batchRemarks设置为空字符串, 优先用desc
    }
    const keyValueObj = {
      isOpened: false
    }
    // 批量接收
    if (batchOperatType === '3') {
      params.batchReceiveOption = +option.value
      this.handleBatchOperat(params)
    }
    // 批量不接收
    else {
      const reason = option.value
      params.batchUnreceiveReason = +reason
      // - 选择其他原因时, 需要手动添加原因后提交
      if (reason === '4') {
        keyValueObj.isOpenModal = true
        keyValueObj.tempParams = params
      }
      else {
        this.handleBatchOperat(params)
      }
    }
    this.setState(keyValueObj)
  }
  // 组合动作
  composeAction = () => {
    const { tempParams } = this.state
    if (tempParams.batchRemarks === '') {
      return Taro.showToast({
        title: '请输入其他原因内容',
        icon: 'none'
      })
    }
    this.handleBatchOperat(tempParams)
    this.setState({
      isOpenModal: false,
      tempParams: {}
    })
  }
  onChange = (e) => {
    const copyTempParams = {...this.tempParams}
    copyTempParams.batchRemarks = e.target.value
    this.setState({
      tempParams: copyTempParams
    })
  }
  // 获取切换后的批量操作,
  getBatchOperat = () => {
    const { current } = this.state
    const batchOperat = {...this.state.batchOperat}
    batchOperat[current] = !batchOperat[current]
    return batchOperat
  }
  // 获取数据列表信息(列表、列表名称、列表在mapData中的对应key(current))
  getListInfo = (isDeep=true) => {
    const { current } = this.state
    const { listName } = mapData[current]
    const list = this.state[listName]
    return {
      list: isDeep ? JSON.parse(JSON.stringify(list)) : list,
      listName,
      current
    }
  }
  // 获取批量操作方法
  getBatchMethod = () => {
    const { current } = this.state
    const { batchMethod } = mapData[current]
    return batchMethod
  }
  beforeDelete = (data) => {
    this.setState({
      isDeleteModal: true,
      currentMessage: data,
    })
  }
  // 删除申报消息 
  deleteMessage = async () => {
    const { declareType, id } = this.state.currentMessage
    let res
    switch (declareType) {
      case 1:
        res = await WharfService.deleteGarbageDeclare(id)
        break
      case 2:
        res = await WharfService.deleteLifeSewageDeclare(id)
        break
      case 3:
        res = await WharfService.deleteShipSewageDeclare(id)
        break
      case 4:
        res = await WharfService.deleteShorePowerDeclare(id)
        break
    }
    if (res && res.data) {
      this.getUnapprovedDeclares()
      Taro.showToast({
        title: '删除成功',
        icon: 'success'
      })
    } else {
      Taro.showToast({
        title: '删除失败'
      })
    }
    this.setState({
      isDeleteModal: false,
    })
  }
  render () {
    const {
      tabList = [], junkDeclares = [], batchOperat, restHeight,
      allDeclares = [], lifeSewageDeclares = [],
      shorePowerDeclares = [], shipSewageDeclares = [], isOpened, batchOperatType, isNotSign } = this.state
    const batchRestHeight = restHeight - (88 /*批量操作高度*/ + 5/*修正*/)
    const { current, list } = this.getListInfo(false)
    const isChecked = batchOperat[current]
    const isReceive = batchOperatType === '3' // 是否为选择接收
    const isShorePower = current === 4 // 当前(current)是否为岸电信息
    const options = isReceive ? receiveOptions[current] : unreceiveReasonsV2
    const tipMsg = isNotSign ? '您好, 请登陆' : '暂无数据'
    return (
      <View className='message'>
        <AtTabs className="x-tabs" scroll current={current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={current} index={0} >
            <ScrollView
              scrollY
              scrollWithAnimation
              style={{height: `${restHeight}rpx`}}
              scrollTop={scrollTop}
              lowerThreshold={Threshold}
              upperThreshold={Threshold}
            >
              {
                allDeclares.length
                  ?  allDeclares.map((item, index) => (
                      <MessageItem
                        isCheckbox={false}
                        isDelete={true}
                        data={item}
                        key={`${item.id}-${index}`}
                        routeTo={this.routeTo}
                        delete={this.beforeDelete} />
                    ))
                  : <View style="text-align: center; padding: 20rpx;">{tipMsg}</View>
              }
            </ScrollView>
          </AtTabsPane>
          <AtTabsPane current={current} index={1}>
            <ScrollView
              scrollY
              scrollWithAnimation
              style={{height: `${batchRestHeight}rpx`}}
              scrollTop={scrollTop}
              lowerThreshold={Threshold}
              upperThreshold={Threshold}
            >
              {
                junkDeclares.length
                  ? junkDeclares.map((item, index) => (
                      <MessageItem
                        data={item}
                        key={`${item.id}-${index}`}
                        selectSingle={this.selectSingle}
                        routeTo={this.routeTo}
                        isDelete={true}
                        delete={this.beforeDelete} />
                    ))
                  : <View style="text-align: center; padding: 20rpx;">{tipMsg}</View>
              }
            </ScrollView>
          </AtTabsPane>
          <AtTabsPane current={current} index={2}>
            <ScrollView
              scrollY
              scrollWithAnimation
              style={{height: `${batchRestHeight}rpx`}}
              scrollTop={scrollTop}
              lowerThreshold={Threshold}
              upperThreshold={Threshold}
            >
              {
                lifeSewageDeclares.length
                  ? lifeSewageDeclares.map((item, index) => (
                      <MessageItem
                        data={item}
                        key={`${item.id}-${index}`}
                        selectSingle={this.selectSingle}
                        routeTo={this.routeTo}
                        isDelete={true}
                        delete={this.beforeDelete} />
                    ))
                  : <View style="text-align: center; padding: 20rpx;">{tipMsg}</View>
              }
            </ScrollView>
          </AtTabsPane>
          <AtTabsPane current={current} index={3}>
            <ScrollView
              scrollY
              scrollWithAnimation
              style={{height: `${batchRestHeight}rpx`}}
              scrollTop={scrollTop}
              lowerThreshold={Threshold}
              upperThreshold={Threshold}
            >
              {
                shipSewageDeclares.length
                  ? shipSewageDeclares.map((item, index) => (
                      <MessageItem
                        data={item}
                        key={`${item.id}-${index}`}
                        selectSingle={this.selectSingle}
                        routeTo={this.routeTo}
                        isDelete={true}
                        delete={this.beforeDelete} />
                    ))
                  : <View style="text-align: center; padding: 20rpx;">{tipMsg}</View>
              }
            </ScrollView>
          </AtTabsPane>
          <AtTabsPane current={current} index={4}>
            <ScrollView
              scrollY
              scrollWithAnimation
              style={{height: `${batchRestHeight}rpx`}}
              scrollTop={scrollTop}
              lowerThreshold={Threshold}
              upperThreshold={Threshold}
            >
              {
                shorePowerDeclares.length
                  ? shorePowerDeclares.map((item, index) => (
                      <MessageItem
                        data={item}
                        key={`${item.id}-${index}`}
                        selectSingle={this.selectSingle}
                        routeTo={this.routeTo}
                        isDelete={true}
                        delete={this.beforeDelete} />
                    ))
                  : <View style="text-align: center; padding: 20rpx;">{tipMsg}</View>
              }
            </ScrollView>
          </AtTabsPane>
        </AtTabs>
        {
          // 只在不是全部而且对应list的数组长度不为0时显示
          current !== 0 && list.length && (
            <View className="batch-actions">
              <CheckboxGroup onChange={this.onSelectAll}>
                <View>
                  <Checkbox checked={isChecked} />
                  <Text>{isChecked ? '取消全选' : '全选' }</Text>
                </View>
              </CheckboxGroup>
              <View className="buttions">
                {
                  // 生活污水&油污水与岸电区别显示
                  isShorePower
                    ? <AtButton className="x-button" style="width: 180rpx;" type="primary" size="small" onClick={() => this.handleBatchOperat()}>批量确认</AtButton>
                    : <Block>
                        <AtButton className="x-button" style="width: 180rpx;" type="primary" size="small" onClick={() => this.onBatchOperat('3', current)}>批量接收</AtButton>
                        <View style="width: 10rpx;"></View>
                        <AtButton className="x-button" style="width: 180rpx;" type="primary" size="small" onClick={() => this.onBatchOperat('1', current)}>批量不接收</AtButton>
                      </Block>
                }
              </View>
            </View>
          )
        }
        <AtActionSheet onClose={() => this.setState({ isOpened: false })} isOpened={isOpened} title={isReceive ? '接收方式' : '不接收原因'}>
          {
            options && options.map(item => (
              <AtActionSheetItem key={item.value} onClick={() => this.onActionSheet(item)}>
                {item.label}
              </AtActionSheetItem>
            ))
          }
        </AtActionSheet>
        {
          isNotSign && (
            <View className="btn-sign-wrapper">
              <Button type="primary" onClick={
                () => Taro.navigateTo({
                  url: '/pages/login/index'
                })
              }>点此登陆</Button>
            </View>
          )
        }
        
        <AtModal isOpened={this.state.isOpenModal}>
          <AtModalHeader>其他原因</AtModalHeader>
          <AtModalContent>
            {
              this.state.isOpenModal && <AtTextarea count={false} onChange={this.onChange} />
            }
          </AtModalContent>
          <AtModalAction>
            <Button onClick={() => this.setState({ isOpenModal: false })}>取消</Button>
            <Button style="color: #44b549;" onClick={this.composeAction}>确定</Button>
          </AtModalAction>
        </AtModal>

        <AtModal isOpened={this.state.isDeleteModal}>
          <AtModalHeader>提示</AtModalHeader>
          <AtModalContent>
            即将删除申报消息, 是否继续?
          </AtModalContent>
          <AtModalAction>
          <Button onClick={() => this.setState({ isDeleteModal: false })}>取消</Button>
            <Button style="color: #44b549;" onClick={this.deleteMessage}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
