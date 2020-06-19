import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.styl'

import { AtForm, AtInput, AtRadio, AtTextarea } from 'taro-ui'

import { receiveOptionsDisabled, receiveTypesDisabled, unreceiveReasonsDisabledV2 } from './source'
import { WharfService } from '../../../service/wharf-service'

// 页面标题参数
const barParams = {
  1: { title: '垃圾申报(已审核)' },
  2: { title: '生活污水申报(已审核)' },
  3: { title: '船舶污水申报(已审核)' },
  4: { title: '岸电信息申报(已审核)' },
}

export default class Detail extends Component {
  state = {
    data: {},
  }
  async componentWillMount () {
    const { id } = this.$router.params
    const info = await WharfService.getAuditDeclare(+id)
    this.setState({
      data: info
    })
    Taro.setNavigationBarTitle(barParams[info.declareType])
  }

  componentDidMount () { }

  // 图片预览
  onPreview = (url) => {
    const urls = this.state.data.photoUrls
    Taro.previewImage({
      current: url,
      urls
    })
  }

  render () {
    const { data = {} } = this.state
    const { photoUrls = [] } = data
    const isUnReceive = data.receiveType === 1 // 接收类型是否为不接收
    const isNotShorePower = data.declareType !== 4 // 申报类型不是岸电
    return (
      <View className='declare-detail junk-detail main-layout'>
        <View className="title x-title">基本信息</View>
        <AtForm className='form'>
          <AtInput name='shipName' title='靠泊船名称' value={data.shipName || '-'} editable={false} />
          <AtInput name='operator' title='经办人' value={data.operator || '-'} editable={false} />
          <AtInput name='operator' title='联系方式' placeholder='请输入' value={data.operatorPhone} editable={false} />
          <AtInput name='wharfName' title='申报码头' value={data.wharfName || '-'} editable={false} />
          <AtInput name='date' title='申报日期' value={data.createTime || '-'} editable={false} />
        </AtForm>
        <View className="x-title">申报内容</View>
        <AtForm>
          {
            {
              1:
                <Block>
                  <AtInput name='kitchenWeight' title='餐厨垃圾' value={data.kitchenWeight || '0'} editable={false} />
                  <AtInput name='otherWeight' title='其他垃圾' value={data.otherWeight || '0'} editable={false} />
                  <AtInput name='recyclableWeight' title='可回收垃圾' value={data.recyclableWeight || '0'} editable={false} />
                  <AtInput name='hazardousWeight' title='有害垃圾' value={data.hazardousWeight || '0'} editable={false} />
                </Block>,
              2: <AtInput name='waterLiter' title='污水量' value={data.waterLiter || '0'} editable={false} />,
              3: <AtInput name='oiledLiter' title='油污水量' value={data.oiledLiter || '0'} editable={false} />,
              4: <AtInput name='shorePower' title='使用量' value={data.kwh || '0'} editable={false} />
            }[data.declareType]
          }
        </AtForm>
        <View className='x-title'>图片信息</View>
        <View style="background-color: #fff;">
          <View className="x-image-wrapper">
            {
              photoUrls !== null && photoUrls.length
                ? photoUrls.map((item, index) => (
                    <Image onClick={() => this.onPreview(item)} key={`${index}-img`} style="width: 100px; height: 100px; margin-right: 10px;" mode="aspectFit" src={item} />
                  ))
                : <Text>无图片</Text>
            }
          </View>
        </View>
        {
          // 非岸电申报才显示
          isNotShorePower && (
            <Block>
              <View className="x-title">选择接收类型</View>
              <AtRadio className="x-radio" options={receiveTypesDisabled} value={String(data.receiveType)} />
            </Block>
          )
        }
        {
          // 非岸电申报才显示
          isNotShorePower
            ?
              isUnReceive
                ? <Block>
                    <View className="x-title">不接收原因</View>
                    <AtRadio className="x-radio" options={unreceiveReasonsDisabledV2} value={String(data.unreceiveReason)} />
                    {
                      data.unreceiveReason === 4 && (
                        <AtTextarea value={data.unreceiveRemarks || '-'} count={false} disabled={true} />
                      )
                    }
                  </Block>
                : <Block>
                    <View className="x-title">接收方式</View>
                    <AtRadio options={receiveOptionsDisabled[data.declareType]} value={String(data.receiveOption)} />
                  </Block>

          : null
        }
      </View>
    )
  }
}
