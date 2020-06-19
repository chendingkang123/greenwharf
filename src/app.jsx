import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'

import './app.styl'
import 'taro-ui/dist/style/index.scss'
import { checkAndApplyUpdate } from "./utils/common"

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/message/index',
      'pages/mine/components/record',
      'pages/mine/index',
      'pages/message/components/handle',
      'pages/message/components/detail',
      'pages/index/index',
      'pages/mine/components/bind-info',
      'pages/mine/components/query-condition',
      'pages/login/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
      // enablePullDownRefresh: true
    },
    tabBar: {
      backgroundColor: '#fff',
      borderStyle: 'black',
      selectedColor: '#44b549',
      color: '#333',
      list: [
        {
          pagePath: 'pages/message/index',
          iconPath: 'static/images/message.png',
          selectedIconPath: "static/images/message_active.png",
          text: '消息'
        },
        {
          pagePath: 'pages/mine/index',
          iconPath: 'static/images/home.png',
          selectedIconPath: "static/images/home_active.png",
          text: '我的'
        }
      ]
    }
  }
  componentDidMount () {
  }

  componentDidShow () {
    // console.log('show')
    checkAndApplyUpdate()
  }

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
