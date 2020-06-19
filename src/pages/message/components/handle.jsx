import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.styl'

import { AtForm, AtInput, AtRadio, AtTextarea } from 'taro-ui'

import { receiveOptions, receiveTypes, unreceiveReasonsV2 } from './source'
import { WharfService } from '../../../service/wharf-service'

/**
 * 页面标题参数
 */
const barParams = {
  1: { title: '垃圾申报' },
  2: { title: '生活污水申报' },
  3: { title: '船舶污水申报' },
  4: { title: '岸电信息申报' },
}

// 提交方法
const submitMethods = {
  1: 'auditGarbageDeclare',
  2: 'auditLifeSewageDeclare',
  3: 'auditShipSewageDeclare',
  4: 'auditShorePowerDeclare'
}

export default class Handle extends Component {
  state = {
    data: {},
    formData: {
      receiveType: '3',
      receiveOption: '1',
      unreceiveReason: '1',
      remarks: ''
    },
  }
  async componentWillMount () {
    const { id } = this.$router.params
    const info = await WharfService.getDeclare(+id)
    this.setState({
      data: info,
      isZeroDeclare: this.zeroDeclare(info)
    })
    Taro.setNavigationBarTitle(barParams[info.declareType])
  }

  componentDidMount () { }

  onChange = (param, reasons=[]) => {
    return (value) => {
      const copyFormData = {...this.state.formData}
      copyFormData[param] = value
      // 选中其他原因时(value=4), remarks手动填写
      if (reasons.length && value !== '4') {
        const reasonOps = reasons.find(item => item.value === value)
        // desc是比较详细的描述
        copyFormData.remarks = reasonOps.desc || reasonOps.label
      }
      this.setState({
        formData: copyFormData
      })
    }
  }

  // 是否是零申报
  zeroDeclare = (data) => {
    if (data.declareType === 1) {
      return +data.hazardousWeight === 0 && +data.kitchenWeight === 0 && +data.otherWeight === 0 && +data.recyclableWeight === 0
    }
    else if (data.declareType === 2) {
      return +data.waterLiter === 0
    }
    else if (data.declareType === 3) {
      return +data.oiledLiter === 0
    }
    else {
      return +data.kwh === 0
    }
  }

  onSubmit = async () => {
    const { receiveOption, receiveType, unreceiveReason, remarks } = this.state.formData
    const { declareType, id } = this.state.data
    const params = {
      declareId: id,
      receiveType: +receiveType,
    }
    // 零申报不需要接收方式和接收类型, 即只有不是零申报时, 猜添加unreceiveReason, receiveOption, remarks
    if (!this.state.isZeroDeclare) {
      // 全部不接收(receiveType=1) -> 添加remarks
      if (receiveType === '1') {
        params.unreceiveReason = +unreceiveReason
        if (params.unreceiveReason === 4) {
          if (remarks === '') {
            return Taro.showToast({
              title: '请填写其他原因',
              icon: 'none'
            })
          }
          params.remarks = remarks
        }
        else {
          const reasonOps = unreceiveReasonsV2.find(item => item.value === unreceiveReason)
          params.remarks = reasonOps.desc || reasonOps.label
        }
      }
      // 全部不接收
      else {
        params.receiveOption = +receiveOption
      }
    }
    const submitMethod = submitMethods[declareType]
    const isSuccess = await WharfService[submitMethod](params)
    if (isSuccess) {
      Taro.showToast({
        title: '处理成功',
        icon: 'success'
      })
      const timer = setTimeout(() => {
        clearTimeout(timer)
        Taro.navigateBack()
      }, 1500)
    }
  }

  // 图片预览
  onPreview = (url) => {
    const urls = this.state.data.photoUrls
    Taro.previewImage({
      current: url,
      urls
    })
  }

  onTextareaChange = (e) => {
    const val = e.detail.value
    if (val) {
      const copyFormData = {...this.state.formData}
      copyFormData.remarks = val
      this.setState({
        formData: copyFormData
      })
    }
  }

  render () {
    const { formData, data, isZeroDeclare } = this.state
    const currentReceiveOps = receiveOptions[data.declareType]
    const { photoUrls = [] } = data
    const isNotShorePower = data.declareType !== 4 // 申报类型不是岸电
    return (
      <View className='main-layout message-detail junk-detail'>
        <View className="title x-title">基本信息</View>
        <AtForm className='form'>
          <AtInput name='shipName' title='靠泊船名称' value={data.shipName || '-'} editable={false} />
          <AtInput name='operator' title='经办人' value={data.operator || '-'} editable={false} />
          <AtInput name='operator' title='联系方式' value={data.operatorPhone || '-'} editable={false} />
          <AtInput name='wharfName' title='申报码头' value={data.wharfName || '-'} editable={false} />
          <AtInput name='date' title='申报日期' value={data.createTime || '-'} editable={false} />
        </AtForm>
        <View className="x-title">
          申报内容
        </View>
        <AtForm>
          {
            {
              1:
                <Block>
                  <AtInput name='kitchenWeight' title='餐厨垃圾' value={data.kitchenWeight || '0'} editable={false} />
                  <AtInput name='otherWeight' title='其他垃圾' value={data.otherWeight || '0'} editable={false}/>
                  <AtInput name='recyclableWeight' title='可回收垃圾' value={data.recyclableWeight || '0'} editable={false} />
                  <AtInput name='hazardousWeight' title='有害垃圾' value={data.hazardousWeight || '0'} editable={false} />
                </Block>,
              2: <AtInput name='waterLiter' title='污水量' value={data.waterLiter || '0'} editable={false} />,
              3: <AtInput name='oiledLiter' title='油污水量' value={data.oiledLiter || '0'} editable={false} />,
              4: <AtInput name='shorePower' title='使用量' value={data.kwh || '0'} editable={false} />
            }[data.declareType]
          }

          <AtInput title='零申报原因' value={data.remarks || '-'} editable={false} />
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
          // 零申报不需要接收类型和接收方式
          !isZeroDeclare && (
            <Block>
              {
                // 岸电没有接收类型和接收方式
                isNotShorePower && (
                  <Block>
                    <View className="x-title">选择接收类型</View>
                    <AtRadio
                      className="x-radio"
                      options={receiveTypes}
                      value={formData.receiveType}
                      onClick={this.onChange('receiveType')}
                    />
                  </Block>
                )
              }
              {
                // 需要注意的是, 传到后台的变量为数字类型, 而AtRadio等组件需要的是字符串类型
                isNotShorePower
                  ? formData.receiveType === '1'
                      ? <Block>
                          <View className="x-title">不接收原因</View>
                            <AtRadio
                              className="x-radio"
                              options={unreceiveReasonsV2}
                              value={formData.unreceiveReason}
                              onClick={this.onChange('unreceiveReason')}
                            />
                        </Block>
                      : <Block>
                          <View className="x-title">接收方式</View>
                          <AtRadio
                            className="x-radio"
                            options={currentReceiveOps}
                            value={formData.receiveOption}
                            onClick={this.onChange('receiveOption')}
                          />
                        </Block>
                  : null
              }
              {
                // 选中其他原因时显示
                formData.unreceiveReason === '4' && (
                  <Block>
                    <AtTextarea
                      value={formData.remarks}
                      onChange={this.onTextareaChange}
                      count={false}
                      placeholder='请输入' />
                  </Block>
                )
              }
            </Block>
          )
        }
        <View className="button-wrapper">
          <Button type='primary' size='normal' onClick={this.onSubmit}>确认提交</Button>
        </View>
      </View>
    )
  }
}
