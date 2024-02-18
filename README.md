## 简介

声网 Miniapp SDK 是一个全新的 SDK，能支持在小程序端实现如下功能：

- 音视频通话
- 音视频直播

结合微信小程序，能实现如下场景：

- 线上课堂：1 对 1 及 1 对多线上小班课，老师、学生实时互动
- 在线医疗：突破医疗资源的地域限制，实现多方视频会诊，降低诊断成本
- 高端客服：对高价值的 VIP 客户提供远程视频服务，1 对 1 实时交流
- 远程报警：一键报警，通过实时视频通信，为警方提供一手现场情况
- 银行开户：实时视频认证，清晰画质、超低延时、隐私保护，提升开户效率

声网 Miniapp SDK 的 {@link Client} 类提供声网 RTC SDK 的核心功能，包含如下 API：

- {@link Client.init}：初始化对象
- {@link Client.setRole}：设置用户角色
- {@link Client.join}：加入频道
- {@link Client.publish}：发布音视频流
- {@link Client.unpublish}：停止发布音视频流
- {@link Client.subscribe}：订阅远端音视频流
- {@link Client.unsubscribe}：停止订阅远端音视频流
- {@link Client.muteLocal}：停止发送本地音视频流
- {@link Client.unmuteLocal}：恢复发送本地音视频流
- {@link Client.mute}：停止接收远端音视频流
- {@link Client.unmute}：继续接收远端音视频流
- {@link Client.startChannelMediaRelay}：开始跨频道媒体流转发
- {@link Client.updateChannelMediaRelay}：更新媒体流转发的频道
- {@link Client.stopChannelMediaRelay}：停止跨频道媒体流转发
- {@link Client.on}：监听事件
- {@link Client.off}：取消监听事件
- {@link Client.rejoin}：重新加入频道
- {@link Client.renewToken}：更新 Token
- {@link Client.setAudioCodec}：设置 IoT 设备的音频编码格式。
- {@link Client.setRemoteVideoStreamType}：设置订阅的视频流类型
- {@link Client.updatePusherNetStatus}：上报推流过程中的网络状态
- {@link Client.updatePusherStateChange}：上报推流状态
- {@link Client.updatePlayerNetStatus}：上报拉流过程中的网络状态
- {@link Client.updatePlayerStateChange}：上报拉流状态
- {@link Client.leave}：退出频道
- {@link Client.destroy}：销毁客户端对象

声网 Miniapp SDK for Wechat 的 {@link Log} 方法提供声网 RTC SDK 的日志相关功能，包含如下 API：

- {@link Log.setLogLevel}：设置小程序 SDK 输出日志等级
- {@link Log.uploadLogs}：上传 SDK 日志至服务器

## 错误码

声网 Miniapp SDK 在调用 API 或运行时，可能会返回一个错误码对象，也可能会返回一个错误码。详见[错误码和警告码](https://doc.shengwang.cn/doc/rtc/mini-program/error-code)进行排查。
