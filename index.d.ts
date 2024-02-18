export interface Client {
    /**
     * 初始化客户端对象。
     *
     * @param appId 你的小程序项目的 App ID。
     * @param onSuccess 方法调用成功时执行的回调函数。无返回值。
     * @param onFailure 方法调用失败时执行的回调函数。返回值为错误码和错误信息。
     */
    init(appId: string,
         onSuccess?: () => void,
         onFailure?: (err: {code: number, reason: string}) => void
    ): Promise;
    /**
     * 设置用户角色。
     *
     * 该方法设置用户角色。小程序端的用户角色默认为主播，因此在同时满足以下条件的使用场景中，必须调用该接口将小程序端的用户角色设置为观众再进入频道。
     * - 小程序 SDK 与 Native SDK 互通
     * - Native 端频道模式为直播模式
     * - 小程序作为观众端加入频道
     *
     * 注：如果在主播已 publish 的状态下调用该方法将用户角色设置为 audience，会导致之前的推流地址无效。
     * @param role 用户角色。选择如下一种角色：
     * - broadcaster：(默认) 将用户角色设置为主播。主播可以调用 {@link publish} 和 {@link unpublish} 方法。
     * - audience：将用户角色设置为观众。观众不能调用 {@link publish} 和 {@link unpublish} 方法。
     * @param onSuccess 方法调用成功时执行的回调函数。无返回值。
     * @param onFailure 方法调用失败时执行的回调函数。返回值为错误码和错误信息。
     */
    setRole(role: string,
            onSuccess?: () => void,
            onFailure?: (err: {code: number, reason: string}) => void
    ): Promise;
    /**
     * 加入频道。
     *
     * @param channelKey 在 app 服务器端生成的用于鉴权的 Token：
     * - 安全要求不高：你可以使用控制台生成的临时 Token，详见[获取临时 Token](https://docs.agora.io/cn/Agora%20Platform/token?platform=All%20Platforms#temptoken)。
     * - 安全要求高：将值设为你的服务端生成的正式 Token，详见[从服务端生成 Token](https://docs.agora.io/cn/Interactive%20Broadcast/token_server_cpp?platform=CPP)。
     * @param channel 频道名，能标识直播频道的字符串。
     * @param uid 指定用户的 ID。32 位无符号整数。建议设置范围：1 到 (2³² - 1)，并保证唯一。如果不指定 uid（即设为 null），服务器会报错。
     * @param isAudioOnly 是否为纯音频场景：
     * - `true`：纯音频场景。
     * - `false`：非纯音频场景。
     * @param onSuccess 方法调用成功时执行的回调函数。返回值为用户 ID。
     * @param onFailure 方法调用失败时执行的回调函数。返回值为错误码和错误信息。
     */
     join(
      channelKey: string,
      channel: string,
      uid: number,
      isAudioOnly: boolean,
      onSuccess?: (uid: number) => void,
      onFailure?: (err: {code: number, reason: string}) => void
   ): Promise;
    /**
     * 发布本地音视频流。
     *
     * 该方法将本地音视频流发布到 SD-RTN。互动直播中，调用该 API 的用户即默认为主播。
     * @param onSuccess 方法调用成功时执行的回调函数。返回值为音视频流的推流地址。
     * @param onFailure 方法调用失败时执行的回调函数。返回值为错误码和错误信息。
     */
    publish(onSuccess?: (url: string) => void,
            onFailure?: (err: {code: number, reason: string}) => void
    ): Promise;
    /**
     * 停止发布本地音视频流。
     * @param onSuccess 方法调用成功时执行的回调函数。无返回值。
     * @param onFailure 方法调用失败时执行的回调函数。返回值为错误码和错误信息。
     */
    unpublish(onSuccess?: () => void,
              onFailure?: (err: any) => void
    ): Promise;
    /**
     * 订阅远端音视频流。
     *
     * 该方法从 SD-RTN 订阅并接收远端音视频流。
     *
     * @param uid 要订阅的远端用户 ID。
     * @param options 设置是否订阅视频或音频。
     * @param onSuccess 方法调用成功时执行的回调函数。返回值为音视频的拉流地址。
     * @param onFailure 方法调用失败时执行的回调函数。返回值为错误码和错误信息。
     */
    subscribe(uid: number,
              options?:
              /**
               * @param audio 是否订阅音频流：
               * - `true`：（默认）订阅。
               * - `false`：不订阅。
               * @param video 是否订阅视频流：
               * - `true`：（默认）订阅。
               * - `false`：不订阅。
               */
              { audio?: boolean; video?: boolean },
              onSuccess?: (url: string) => void,
              onFailure?: (err: any) => void
    ): Promise;
    /**
     * 停止订阅远端音视频流。
     *
     * 该方法停止从 SD-RTN 订阅并接收远端音视频流。
     * @param uid 要停止订阅的远端用户 ID。
     * @param onSuccess 方法调用成功时执行的回调函数。无返回值。
     * @param onFailure 方法调用成功时执行的回调函数。返回值为错误码和错误信息。
     */
    unsubscribe(uid: number,
                onSuccess?: () => void,
                onFailure?: (err: any) => void
    ): Promise;
    /**
     * 停止发送本地用户的音视频流。
     * @param target 选择停止发送哪一种流，有三种选择：
     * - audio：本地用户发送的音频流，即声音。
     * - video：本地用户发送的视频流，即视频画面。
     * - all：本地用户发送的音视频流，即声音和视频画面。
     * @param onSuccess 方法调用成功时执行的回调函数。无返回值。
     * @param onFailure 方法调用失败时执行的回调函数。返回值为错误码和错误信息。
     */
    muteLocal(target: string,
              onSuccess?: () => void,
              onFailure?: (err: {code: number, reason: string}) => void
    ): Promise;
    /**
     * 恢复发送本地用户的音视频流。
     * @param target 选择恢复发送哪一种流，有三种选择：
     * - audio：本地用户发送的音频流，即声音。
     * - video：本地用户发送的视频流，即视频画面。
     * - all：本地用户发送的音视频流，即声音和视频画面。
     * @param onSuccess 方法调用成功时执行的回调函数。无返回值。
     * @param onFailure 方法调用失败时执行的回调函数。返回值为错误码和错误信息。
     */
    unmuteLocal(target: string,
                onSuccess?: () => void,
                onFailure?: (err: {code: number, reason: string}) => void
    ): Promise;
    /**
     * 停止接收远端用户的音视频流。
     *
     * @param uid 远端用户的 ID。
     * @param target 选择停止接收哪一种流，有三种选择：
     * - audio：本地用户发送的音频流，即声音。
     * - video：本地用户发送的视频流，即视频画面。
     * - all：本地用户发送的音视频流，即声音和视频画面。
     * @param onSuccess 方法调用成功时执行的回调函数。无返回值。
     * @param onFailure 方法调用失败时执行的回调函数。返回值为错误码和错误信息。
     */
    mute(uid: number,
         target: string,
         onSuccess?: ()=> void,
         onFailure?: (err: {code: number, reason: string}) => void
    ): Promise;
    /**
     * 恢复接收远端用户的音视频流。
     * @param uid 远端用户的 ID。
     * @param target 选择停止接收哪一种流，有三种选择：
     * - audio：本地用户发送的音频流，即声音。
     * - video：本地用户发送的视频流，即视频画面。
     * - all：本地用户发送的音视频流，即声音和视频画面。
     * @param onSuccess 方法调用成功时执行的回调函数。无返回值。
     * @param onFailure 方法调用失败时执行的回调函数。返回值为错误码和错误信息。
     */
    unmute(uid: number,
           target: string,
           onSuccess?: ()=> void,
           onFailure?: (err: {code: number, reason: string}) => void
    ): Promise;

    /**
     * 用户被服务器禁止。
     * 
     * @since v2.5.4
     * 
     * 当你在服务端踢除频道内的用户后，被踢出频道的用户会收到该回调。
     */
    on(event: "client-banned"
    ): void;
    /**
     * 通知应用程序发生错误。
     * 该回调中会包含详细的错误码和错误信息。
     */
    on(event: "error",
       callback: (evt: {code: number, reason: string}) => void
    ): void;
    /**
     * 通知应用程序已添加远端音视频流。
     * 该回调中会包含已添加的远端用户 ID。
     */
    on(event: "stream-added",
       callback: (evt: {uid: number}) => void
    ): void;
    /**
     * 通知应用程序已删除远端音视频流。
     * 该回调中会包含已删除的远端用户 ID。
     */
    on(event: "stream-removed",
       callback: (evt: {uid: number}) => void
    ): void;
    /**
     * 通知应用程序已更新 Url 地址。
     * 该回调中会包含远端用户的 ID 和更新后的拉流地址。
     */
    on(event: "update-url",
       callback: (evt: {uid: number, url: string}) => void
    ): void;
    /**
     * 通知应用程序远端视频已旋转。
     * 该回调中会包含视频的旋转信息以及远端用户的 ID。
     */
    on(event: "video-rotation",
       callback: (evt: {rotation: number, uid: number}) => void
    ): void;

    /**
     * Token 已过期回调。
     *
     * @since v2.5.3
     *
     * 在 token 过期后，会收到该回调。
     *
     * 一般情况下，在收到该消息之后，应向服务端重新申请 token，并调用 {@link join} 方法传入新的 token 重新加入频道。
     *
     */
    on(event: "token-privilege-did-expire"
    ): void;

    /**
     * Token 服务即将过期回调。
     *
     * @since v2.5.3
     *
     * 在调用 {@link join} 时如果指定了 Token，由于 Token 具有一定的时效，在通话过程中如果 Token 即将失效，SDK 会提前 30 秒触发该回调，提醒 App 更新 Token。当收到该回调时，你需要重新在服务端生成新的 Token，
     * 然后调用 {@link renewToken} 将新生成的 Token 传给 SDK。
     *
     */
    on(event: "token-privilege-will-expire"
    ): void;
    /**
     * 取消监听流事件。
     * @param event 想要取消监听的流事件。
     */
    off(event: string): void;
    /**
     * 重新加入频道。
     *
     * 该方法让用户重新加入 AgoraRTC 频道。如果你的小程序中有切后台的场景需求，请确保使用该方法做好重连机制。
     * @param channelKey 在 app 服务器端生成的用于鉴权的 Token：
     * - 安全要求不高：你可以使用控制台生成的临时 Token，详见[获取临时 Token](https://docs.agora.io/cn/Agora%20Platform/token?platform=All%20Platforms#temptoken)。
     * - 安全要求高：将值设为你的服务端生成的正式 Token，详见[从服务端生成 Token](https://docs.agora.io/cn/Interactive%20Broadcast/token_server_cpp?platform=CPP)。
     * @param channel 频道名，能标识直播频道的字符串。
     * @param uid 指定用户的 ID。32 位无符号整数。建议设置范围：1 到 (2^32-1)，并保证唯一性。如果不指定 uid（即设为 null），服务器会报错。
     * @param uids 频道内已有用户的用户 ID 列表。
     * @param onSuccess 方法调用成功时执行的回调函数。返回值为用户 ID。
     * @param onFailure 方法调用失败时执行的回调函数。返回值为错误码和错误信息。
     * @param isAudioOnly 是否为纯音频场景：
     * - `true`：纯音频场景。
     * - `false`：非纯音频场景。
     */
     rejoin(channelKey: string,
      channel: string,
      uid: number,
      uids: number,
      onSuccess?: (uid: number) => void,
      onFailure?: (err: {code: number, reason: string}) => void,
      isAudioOnly: boolean
     ): void;
    /**
     * 退出频道。
     *
     * @param onSuccess 方法调用成功时执行的回调函数。无返回值。
     * @param onFailure 方法调用失败时执行的回调函数。返回值为错误码和错误信息。
     */
     leave(onSuccess?: () => void,
     onFailure?: (err: {code: number, reason: string}) => void,
    ): void;
    /**
     * 销毁客户端对象。
     * @param onSuccess 方法调用成功时执行的回调函数。
     * @param onFailure 方法调用失败时执行的回调函数。返回值为错误码和错误信息。
     */
    destroy(onSuccess?: () => void,
            onFailure?: (err: {code: number, reason: string}) => void
    ): void;

    /**
     * 上报推流过程中的网络状态。
     *
     * @since v2.5.3
     *
     * 当收到 live-pusher 组件报告的网络状态通知时，你可以调用该接口将其上报给 Agora 的数据中心。
     *
     * @param e live-pusher 组件报告的网络状态数据。
     * Note：要收到 live-pusher 组件报告的网络状态通知，你需要在创建 live-pusher 组件时注册监听 `bindnetstatus`。详见[微信小程序 live-pusher 文档](https://developers.weixin.qq.com/miniprogram/dev/component/live-pusher.html)。
     */
    updatePusherNetStatus(e): void;

    /**
     * 上报推流状态。
     *
     * @since v2.5.3
     *
     * 当收到 live-pusher 组件报告的推流状态变化通知时，你可以调用该接口将其上报给 Agora 的数据中心。
     *
     * @param e live-pusher 组件报告的推流状态码。
     * Note：要收到 live-pusher 组件报告的推流状态码，你需要在创建 live-pusher 组件时注册监听 `bindstatechange`。详见[微信小程序 live-pusher 文档](https://developers.weixin.qq.com/miniprogram/dev/component/live-pusher.html)。
     */
    updatePusherStateChange(e): void;

    /**
     * 上报拉流过程中的网络状态。
     *
     * @since v2.5.3
     *
     * 当收到 live-player 组件报告的网络状态通知时，你可以调用该接口将其上报给 Agora 的数据中心。
     *
     * @param uid 远端用户的用户 ID。
     * @param e live-player 组件报告的网络状态数据。
     * Note：要收到 live-player 组件报告的网络状态数据，你需要在创建 live-player 组件时注册监听 `bindnetstatus`。详见[微信小程序 live-player 文档](https://developers.weixin.qq.com/miniprogram/dev/component/live-player.html)。
     */
    updatePlayerNetStatus(uid: number, e): void;

    /**
     * 上报拉流状态。
     *
     * @since v2.5.3
     *
     * 当收到 live-player 组件报告的拉流状态变化通知时，你可以调用该接口将其上报给 Agora 的数据中心。
     *
     * @param uid 远端用户的用户 ID。
     * @param e live-player 组件报告的拉流状态码。
     * Note：要收到 live-player 组件报告的拉流状态码，你需要在创建 live-player 组件时注册监听 `bindstatechange`。详见[微信小程序 live-player 文档](https://developers.weixin.qq.com/miniprogram/dev/component/live-player.html)。
     */
    updatePlayerStateChange(uid: number, e): void;

    /**
     * 设置订阅的视频流类型。
     *
     * @since v2.5.3
     *
     * 如果发送端选择发送视频双流 (大流和小流)，该方法可以在订阅端选择接收大流还是小流。如果不设置，订阅端默认接收大流。
     *
     * @param uid 用户 ID。
     * @param type 视频流类型：
     * - `0`：视频大流，即高分辨率、高码率视频流。
     * - `1`：视频小流，即低分辨率、低码率视频流。
     * @param onSuccess 方法调用成功时执行的回调函数。
     * @param onFailure 方法调用失败时执行的回调函数。返回值为错误码和错误信息。
     */
     setRemoteVideoStreamType(uid: number, streamType: 0 | 1, onSuccess?: (url: string) => void, onFailure?: (err: any) => void ): void

    /**
     * 更新 Token。
     *
     * @since v2.5.3
     *
     * 该方法更新 Token。如果启用了 Token 机制，过一段时间后密钥会失效。
     * 当收到 `client.on("token-privilege-will-expire")` 消息时，调用该 API 以更新 Token，否则 SDK 会无法和服务器建立连接。
     *
     * @param token 新的 Token。
     */
     renewToken(token: string): void
}

export interface Log {
   
   /**
    * 设置小程序 SDK 输出日志等级。
    * 
    * @since v2.6.0  
    * 
    * @param level 日志等级：
    * - `-1`：BLIND
    * - `0`：DEBUG，即输出所有 API 日志信息。如果你想获取最完整的日志，可以将日志级别设为该等级。
    * - `1`：INFO，即输出 INFO，WARN，ERROR 级别的日志信息。
    * - `2`：WARN，即输出 WARN，ERROR 级别的日志信息。
    * - `3`：ERROR，输出 ERROR 级别的日志信息。
    * - `4`：NONE，即不输出日志信息。
    */
   setLogLevel(level:number):void

   /**
    * 上传 SDK 日志至服务器。
    * 
    * @since v2.6.0  
    * 
    * 如果你调用了该方法上传日志，则无需再自己保存日志文件。
    *   
    * @param onSuccess 方法调用成功时执行的回调函数。无返回值。
    * @param onFailure 方法调用失败时执行的回调函数。返回值为错误码和错误信息。
    */
   uploadLogs(onSuccess?:function, onFailure?:function): Promise

    /**
     * 日志上传成功回调。
     * 
     * @since v2.6.0
     *
     */
   onLog(fn:function)

}