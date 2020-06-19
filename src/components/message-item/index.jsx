import Taro, { Component } from '@tarojs/taro'
import { View, Text, Checkbox } from '@tarojs/components'
import './index.styl'

import { AtIcon, AtButton } from 'taro-ui'

/**
 * 该页面为码头方用户界面
 */
export default class MessageItem extends Component {
  static defaultProps = {
    isCheckbox: true,
    data: {}
  }
  state = {
    
  }

  componentWillMount () {

  }

  componentDidMount () {

  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  /**
   * type
   * 1 垃圾信息
   * 2 生活污水
   * 3 油污水
   * 4 岸电信息
   */
  generateTitle = type => {
    switch (type) {
      case 1:
        return '垃圾信息申报消息'
      case 2:
        return '生活污水申报消息'
      case 3:
        return '船油污水申报消息'
      case 4:
        return '岸电申报消息'
    }
  }
  
  render () {
    const { isCheckbox, selectSingle, routeTo, data, isDelete, delete: handleDelete } = this.props
    return (
      <View className="message-item">
        <View className="header">
          <View className="wrapper">
            {
              isCheckbox && data.checked !== undefined && (
                <CheckboxGroup onChange={() => selectSingle(data)}>
                  <View>
                    {
                      // notice! 这里必须data.checked, 使用从data解构的checked无法勾选
                    }
                    <Checkbox checked={data.checked} />
                  </View>
              </CheckboxGroup>
              )
            }
            <Text className="title">{this.generateTitle(data.declareType)}</Text>
          </View>
          <View className="time">{data.createTime || '-'}</View>
        </View>
        <View className="body" onClick={() => routeTo(data.id, data.status)}>
          {
            {
              1: 
                <Block>
                  <View>靠泊船名: {data.shipName}</View>
                  <View>经办人: {data.operator}</View>
                  <View>餐厨垃圾产生量: {data.kitchenWeight || 0}kg</View>
                  <View>其他垃圾产生量: {data.otherWeight || 0}kg</View>
                  <View>可回收垃圾产生量: {data.recyclableWeight || 0}kg</View>
                  <View>有害垃圾产生量: {data.hazardousWeight || 0}kg</View>
                </Block>,
              2: 
                <Block>
                  <View>靠泊船名: {data.shipName}</View>
                  <View>经办人: {data.operator}</View>
                  <View>生活污水产生量: {data.waterLiter || 0}升</View>
                </Block>,
              3:
                <Block>
                  <View>靠泊船名: {data.shipName}</View>
                  <View>经办人: {data.operator}</View>
                  <View>船油污水产生量: {data.oiledLiter || 0}升</View>
                </Block>,
              4:
                <Block>
                  <View>靠泊船名: {data.shipName}</View>
                  <View>经办人: {data.operator}</View>
                  <View>岸电使用量: {data.kwh || 0}千瓦</View>
                </Block>
            }[data.declareType]
          }
        </View>
        <View className="foot">
          <View className="status">
            <Text>{data.status === 1 ? '未审核' : '已审核'}</Text>
          </View>
          <View className="foot-r">
            {
              isDelete && (
                <View className="delete-wrapper" style="margin-right: 10rpx;" onClick={() => handleDelete(data)}>
                  <Text>删除</Text>
                  <AtIcon value="trash" size="14" />
                </View>
              )
            }
            {
              data.status === 1
                ?
                  <View onClick={() => routeTo(data.id, data.status)}>
                    <Text>马上处理</Text>
                    <AtIcon value="chevron-right" size="16" />
                  </View>
                : null
            }
          </View>
        </View>
      </View>
    )
  }
}
