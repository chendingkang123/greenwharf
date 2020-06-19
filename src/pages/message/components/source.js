// 接收类型
export const receiveTypes = [
  { label: '全部接收', value: '3' },
  { label: '全部不接收', value: '1' }
]

// 不接收原因
export const unreceiveReasonsV2 =  [{
  value: '1',
  label: '码头不具备接收能力',
  disabled: false
}, {
  value: '10',
  label: '填写不规范'
}, {
  value: '4',
  label: '其他原因',
}]

/**
 * 接收方式
 * 1 垃圾信息
 * 2 生活污水
 * 3 油污水
 * 4 岸电信息
 */
export const receiveOptions = {
  '1':
    [{
      value: '1',
      label: '投入垃圾桶',
      disabled: false
    }, {
      value: '2',
      label: '不投入垃圾桶',
      disabled: false
    }],
  '2':
    [{
      value: '1',
      label: '接入本码头生活污水处理设施',
      disabled: false
    }, {
      value: '2',
      label: '码头与相关单位签订协议接收',
      disabled: false
    }],
  '3':
    [{
      value: '1',
      label: '接入本码头船舶油污水处理设施',
      disabled: false
    }, {
      value: '2',
      label: '码头与相关单位签订协议接收',
      disabled: false
    }],
}

// --- 不可编辑选项 ----

// 接收类型
export const receiveTypesDisabled = [
  { label: '全部接收', value: '3', disabled: true },
  { label: '全部不接收', value: '1', disabled: true }
]

// 不接收原因
export const unreceiveReasonsDisabledV2 = [{
  value: '1',
  label: '码头不具备接收能力',
  disabled: true
}, {
  value: '10',
  label: '填写不规范',
  disabled: true
}, {
  value: '4',
  label: '其他原因',
  disabled: true
}]

export const receiveOptionsDisabled = {
  '1':
    [{
      value: '1',
      label: '投入垃圾桶',
      disabled: true
    }, {
      value: '2',
      label: '不投入垃圾桶',
      disabled: true
    }],
  '2':
    [{
      value: '1',
      label: '接入本码头生活污水处理设施',
      disabled: true
    }, {
      value: '2',
      label: '船方已和相关单位协议处理',
      disabled: true
    }],
  '3':
    [{
      value: '1',
      label: '接入本码头船舶油污水处理设施',
      disabled: true
    }, {
      value: '2',
      label: '船方已和相关单位协议处理',
      disabled: true
    }],
}
