import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.styl'

import { AtRadio } from 'taro-ui'
import { WharfService } from '../../../service/wharf-service'

const defaultQuery = {
  shipName: '',
  declareType: '0',
  status: '0',
  withInDays: '30',
}

export default class QueryCondition extends Component {

  config = {
    navigationBarTitleText: '条件筛选'
  }

  state = {
    ships: [],
    query: {},
    current: 0,
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  async componentDidShow () {
    const query = Object.assign({}, defaultQuery, Taro.getStorageSync('query'))
    let current = 0
    // 注意! userInfo为项目后台的用户信息, 而不是调用小程序接口返回的信息
    const userInfo = Taro.getStorageSync('userInfo')

    // 获取船信息&并在开头添加'全部'项
    const ships = await WharfService.getShips(userInfo.id)
    ships.unshift('全部')

    // Taro组件只接收字符串而非数字 -> 将其转为字符串
    query.declareType = String(query.declareType)
    query.status = String(query.status)
    query.withInDays = String(query.withInDays)

    // 若shipName不为空, 则便寻找该船在ships中的位置(current默认为0)
    if (query.shipName !== '') {
      current = ships.findIndex(item => item === query.shipName)
    }
    this.setState({
      ships,
      current,
      query
    })
  }

  componentDidHide () { }

  chooseCondition = name => {
    return (value) => {
      const query = {...this.state.query}
      query[name] = value
      this.setState({
        query
      })
    }
  }

  onClick(shipName, index) {
    const query = {...this.state.query}
    query.shipName = shipName
    this.setState({
      query,
      current: index
    })
  }

  // 提交时将筛选条件记录, 再次进入页面会从缓存中获取
  onSubmit = async () => {
    const { withInDays, shipName, declareType, status } = this.state.query
    const params = {
      shipName: shipName === '全部' ? '' : shipName,
      declareType: +declareType,
      status: +status,
      withInDays: +withInDays
    }
    Taro.setStorageSync('query', params)
    Taro.navigateBack()
  }

  render () {
    const { query, ships, current } = this.state
    return (
      <View className='main-layout query-condition-wrapper'>
        <View className='x-title'>选择船舶名称</View>
        <View className="container name">
          {
            ships.map((item, index) => (
              <View className={['item', current === index ? 'x-highlight' : '']} onClick={() => this.onClick(item, index)} key={`${item}-${index}`}>{item}</View>
            ))
          }
        </View>
        <View className='x-title'>审核类型</View>
        <AtRadio
          className="x-radio"
          options={[
            { label: '全部', value: '0' },
            { label: '垃圾', value: '1' },
            { label: '生活污水', value: '2' },
            { label: '船舶油污水', value: '3' },
            { label: '岸电', value: '4' },
          ]}
          value={query.declareType}
          onClick={this.chooseCondition('declareType')}
        />
        <View className='x-title'>申报状态</View>
          <AtRadio
            className="x-radio"
            options={[
              { label: '全部', value: '0' },
              { label: '未审核', value: '1' },
              { label: '已审核', value: '2' }
            ]}
            value={query.status}
            onClick={this.chooseCondition('status')}
          />
        <View className='x-title'>申报时间</View>
        <AtRadio
          className="x-radio"
          options={[
            { label: '全部', value: '0' },
            { label: '今天', value: '1' },
            { label: '一周内', value: '7' },
            { label: '一个月内', value: '30' },
            { label: '三个月内', value: '90' },
            { label: '一年内', value: '365' },
          ]}
          value={query.withInDays}
          onClick={this.chooseCondition('withInDays')}
        />
        <View className="button-wrapper" style="display: flex;">

          <View style="flex: 1; margin-right: 10rpx;">
            <Button size='normal' onClick={() => this.setState({
              query: defaultQuery
            })}>重置</Button>
          </View>
          <View style="flex: 1; margin-left: 10rpx;">
            <Button type='primary' size='normal' onClick={this.onSubmit}>确定</Button>
          </View>
        </View>
      </View>
    )
  }
}
