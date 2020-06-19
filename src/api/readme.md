# 污染物接收(码头)接口

默认属性
```text
baseURL: SG
headers: {'Content-Type': 'application/json'}
```

* 接口模块
  * public 公共模块
  * wharf 码头模块

## 公共模块

+ 获取盐值和id: getSaltAndId()
  - baseURL: CA
  - path: /Salt/IdAndSalt
  - method: POST
  - param: {userKey: string, userKeyType: number}
+ 获取手机验证码: sendVerifyCode()
  - path: /api/Phone/SendBindPhoneVCode
  - method: POST
  - param: (Phone: string)
+ 绑定手机号: bindPhone()
  - path: /api/Phone/SendBindPhoneVCode
  - method: POST
  - param: {phone: string, username: string}
+ 获取token|刷新token: getToken()
  - baseURL: CA
  - path: /connect/token
  - method: POST
  - param: {username: string, password: string, grant_type: string; client_id: string, group_no: string, client_secret: string, password_type: string, appid: string}
  - headers: {'Content-Type': 'application/x-www-form-urlencoded'}
+ 注册用户: registerWharf()
  - path: /api/User/RegisterWharfUser
  - method: POST
  - param: {appId: string, jsCode: string}
+ 获取用户信息: getUserInfo()
  - path: /api/User/GetCurrentUserInfo
  - method: POST

## 码头模块

+ 审核垃圾申报: auditGarbageDeclare()
  - path: /api/DockReceiveGarbage/InsertDockReceiveGarbage
  - method: POST
  - param: {declareId: string, receiveType: number, remarks: string, receiveOption?<选择接收时添加>: number, unreceiveReason?<选择不接收时添加: number}
+ 审核生活污水申报: auditLifeSewageDeclare()
  - path: /api/DockReceiveWater/InsertDockReceiveWater
  - method: POST
  - param: {declareId: string, receiveType: number, remarks: string, receiveOption?<选择接收时添加>: number, unreceiveReason?<选择不接收时添加: number}
+ 审核船油污水申报: auditShipSewageDeclare()
  - path: /api/DockReceiveOiledWater/InsertDockReceiveOiledWater
  - method: POST
  - param: {declareId: string, receiveType: number, remarks: string, receiveOption?<选择接收时添加>: number, unreceiveReason?<选择不接收时添加: number}
+ 审核岸电信息申报: auditShorePowerDeclare()
  - path: /api/DockReceivePower/InsertDockReceivePower
  - method: POST
  - param: {declareId: string}
+ 批量审核垃圾申报: batchAuditGarbageDeclare()
  - path: /api/DockReceiveGarbage/BatchReceiveGarbage
  - method: POST
  - param: {declareIdsToReceive: string[], batchReceiveType: number, batchRemarks: string, batchReceiveOption?<选择接收时添加>: number, batchUnreceiveReason?<选择不接收时添加>: number}
+ 批量审核生活污水申报: batchAuditLifeSewageDeclare()
  - path: /api/DockReceiveWater/BatchReceiveWater
  - method: POST
  - param: {declareIdsToReceive: string[], batchReceiveType: number, batchRemarks: string, batchReceiveOption?<选择接收时添加>: number, batchUnreceiveReason?<选择不接收时添加>: number}
+ 批量审核船油污水申报: batchAuditShipSewageDeclare()
  - path: /api/DockReceiveOiledWater/BatchReceiveOiledWater
  - method: POST
  - param: {declareIdsToReceive: string[], batchReceiveType: number, batchRemarks: string, batchReceiveOption?<选择接收时添加>: number, batchUnreceiveReason?<选择不接收时添加>: number}
+ 批量审核岸电信息申报: batchAuditShorePowerDeclare()
  - path: /api/DockReceivePower/BatchReceivePower
  - method: POST
  - param: {declareIdsToReceive: string[]}
+ 获取未审批申报记录: getUnapprovedDeclares()
  - path: /api/DockDeclare/GetUserAllUnapprovedDeclare
  - method: POST
+ 获取申报记录详情: getDeclare()
  - path: /api/DockDeclare/GetDeclareDetailById
  - method: POST
  - param: (id: string)
+ 获取已审核申报记录详情: getAuditDeclare()
  - path: /api/DockDeclare/GetReceiveDetailById
  - method: POST
  - param: (id: string)
+ 获取船舶名称: getShips()
  - path: /api/DockDeclare/GetUserDeclareShipNames
  - method: POST
  - param: (id: string)
+ 查询条件获取申报记录: getDeclaresWithCondition()
  - path: /api/DockDeclare/GetUserAllDeclareWithCondition
  - method: POST
  - param: {shipName: string, declareType: number, status: 0, withInDays: number}
