import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import './index.styl'

import { AtTabs, AtTabsPane, AtFab, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import MessageItem from '../../../components/message-item'
import { WharfService } from '../../../service/wharf-service'

export default class Record extends Component {

  config = {
    navigationBarTitleText: '审核记录'
  }

  state = {
    current: 0,
    tabList: [
      { title: '全部' },
      { title: '未审核' },
      { title: '已审核' }
    ],
    auditDeclares: [],
    notAuditDeclares: [],
    allDeclares: [],
    restHeight: 0,
    currentMessage: {},
    isDeleteModal: false,
  }

  componentWillMount () { }

  componentDidMount () {
    const windowHeight = Taro.getSystemInfoSync().windowHeight
    const windowWidth = Taro.getSystemInfoSync().windowWidth
    // 计算rpx
    const restHeight = windowHeight * 750 / windowWidth - 88
    this.setState({
      restHeight,
    })
  }

  componentWillUnmount () { }

  componentDidShow () {
    this.getDeclares()
  }

  componentDidHide () { }

  // 获取全部申报记录
  getDeclares = async () => {
    const query = Taro.getStorageSync('query') || {
      shipName: '',
      declareType: 0,
      status: 0,
      withInDays: 30
    }
    const { data } = await WharfService.getDeclaresWithCondition(query)
    const copyDeclares = JSON.parse(JSON.stringify(data))
    const keyValueObj = {
      allDeclares: copyDeclares,
      auditDeclares: [],
      notAuditDeclares: []
    }
    for (const item of copyDeclares) {
      const copyItem = {...item}
      const status = copyItem.status
      if (status === 1) {
        keyValueObj.notAuditDeclares.push(copyItem)
      } else if (status === 2) {
        keyValueObj.auditDeclares.push(copyItem)
      }
    }
    this.setState(keyValueObj)
  }
  handleClick (value) {
    this.setState({
      current: value
    })
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
      this.getDeclares()
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
    const { tabList, allDeclares, auditDeclares, notAuditDeclares, current, restHeight } = this.state
    const scrollStyle = {
      height: `${restHeight}rpx`
    }
    const scrollTop = 0
    const Threshold = 20
    return (
      <View className='message'>
        <AtTabs className="x-tabs" current={current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={current} index={0} >
            <ScrollView
              className='scrollview'
              scrollY
              scrollWithAnimation
              style={scrollStyle}
              scrollTop={scrollTop}
              lowerThreshold={Threshold}
              upperThreshold={Threshold}
            >
              {
                allDeclares.length
                  ? allDeclares.map((item, index) => (
                      <MessageItem
                        isCheckbox={false}
                        data={item}
                        key={`${item.id}-${index}`}
                        routeTo={this.routeTo}
                        isDelete={true}
                        delete={this.beforeDelete} />
                    ))
                  : <View style="text-align: center; padding: 20rpx;">暂无数据</View>
              }
            </ScrollView>
          </AtTabsPane>
          <AtTabsPane current={current} index={1}>
            <ScrollView
              className='scrollview'
              scrollY
              scrollWithAnimation
              style={scrollStyle}
              scrollTop={scrollTop}
              lowerThreshold={Threshold}
              upperThreshold={Threshold}
            >
              {
                notAuditDeclares.length
                  ? notAuditDeclares.map((item, index) => (
                      <MessageItem
                        isCheckbox={false}
                        data={item}
                        key={`${item.id}-${index}`}
                        routeTo={this.routeTo}
                        isDelete={true}
                        delete={this.beforeDelete} />
                    ))
                  : <View style="text-align: center; padding: 20rpx;">暂无数据</View>
              }
            </ScrollView>
          </AtTabsPane>
          <AtTabsPane current={current} index={2}>
            <ScrollView
              className='scrollview'
              scrollY
              scrollWithAnimation
              style={scrollStyle}
              scrollTop={scrollTop}
              lowerThreshold={Threshold}
              upperThreshold={Threshold}
            >
              {
                auditDeclares.length
                  ? auditDeclares.map((item, index) => (
                      <MessageItem
                        isCheckbox={false}
                        data={item}
                        key={`${item.id}-${index}`}
                        routeTo={this.routeTo}
                        isDelete={true}
                        delete={this.beforeDelete} />
                    ))
                  : <View style="text-align: center; padding: 20rpx;">暂无数据</View>
              }
            </ScrollView>
          </AtTabsPane>
        </AtTabs>
        <View className="x-fab-wrapper">
          <AtFab className="x-fab" onClick={() => Taro.navigateTo({ url: '/pages/mine/components/query-condition' })}>
            <Text className=''>查询</Text>
          </AtFab>
        </View>
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
