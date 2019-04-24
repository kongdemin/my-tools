// 默认参数
const defaultOptions = {
  url: 'ws://192.168.0.212:18082/chat/stream',
  // url:'ws://chattest.myspzh.com/chat/stream',
  // url:'ws://chat.myspzh.com/chat/stream',
  isAutoReconnect: true,
  autoReconnectNumMax: 10,
  autoReconnectInterval: 10
}

// 监听回调
const listenDefaultOptions = {
  onOpened: () => {
    console.log('onOpened')
  },
  onClosed: () => {
    console.log('onClosed')
  },
  // 改动点 onTextMessage -> onMessage
  onMessage: (message) => {
    console.log('onMessage ->', message)
  },
  // 加计数
  onNotify: (message) => {
    console.log('onNotify ->', message)
  },
  onOnline: () => {
    console.log('onOnline')
  },
  onOffline: () => {},
  onError: (message) => {
    console.log('<- onError', message)
  },
  onReceivedMessage: (message) => {
    console.log('<- onReceivedMessage', message)
  },
  onDeliveredMessage: (message) => {
    console.log('<- onDeliveredMessage', message)
  },
  onReadMessage: (message) => {
    console.log('<- onReadMessage', message)
  }
}

// websocket 状态
const WState = {
  Disconnecting: 0,
  Disconnected: 1,
  Connecting: 2,
  Connected: 3
}

const isUndefined = (obj) => {
  return typeof obj === 'undefined'
}

// 连接类
class WebIM {
  constructor (args = {}) {
    this.opts = Object.assign(defaultOptions, args)
    this.listenFunc = Object.assign(listenDefaultOptions, {})
    this._timer = null
    this._state = WState.Disconnected // 已断开
    this._reconnectTimes = 0 // 重连次数
    this._listenReceived = {} // 已发送监听器
  }

  listen (args = {}) {
    this.listenFunc = Object.assign(listenDefaultOptions, args)
  }

  connect () {
    console.log('Disconnected')
    if (this._state !== WState.Disconnected) {
      return
    }

    console.log('Connecting')
    this._state = WState.Connecting // 正在连接中
    this.ws = null // 清理
    this.ws = new WebSocket(this.opts.url)
    // this.ws.binaryType

    console.log('websocket connected')
    console.log('<listen>')

    this.ws.onopen = () => {
      this._state = WState.Connected
      this._reconnectTimes = 0
      // callback
      this.listenFunc.onOpened()
    }

    this.ws.onclose = () => {
      this._state = WState.Disconnected
      this._logged = false

      // callback
      this.listenFunc.onOffline()
      this.listenFunc.onClosed()

      // reconnect
      if (this.isAutoReconnect) this.reconnect()
    }

    this.ws.onmessage = (e) => {
      const message = JSON.parse(e.data)
      switch (message.type) {
        case 'message':
          this.listenFunc.onMessage(message)
          break
        case 'received':
          this.listenFunc.onReceivedMessage(message)
          let callback = this._listenReceived[message.id]
          callback && callback(message)
          break
        case 'notify':
          this.listenFunc.onNotify(message)
          break
        case 'error':
          this.listenFunc.onError(message)
          break
        default:
          break
      }
    }
  }

  async checkConnected (ms, timeout) {
    await new Promise((resolve) => {
      // 完成
      const finish = () => {
        if (!isUndefined(timer1)) clearInterval(timer1)
        if (!isUndefined(timer2)) clearTimeout(timer2)
        resolve()
      }

      // 定时查询
      let timer1 = setInterval(() => {
        if (this._state === WState.Connected) {
          finish()
        }
      }, ms)

      // 超时控制
      let timer2 = setTimeout(() => {
        finish()
      }, timeout)
    })
  }

  async login(username, token, timeout = 3000) {
    this.isAutoReconnect = true

    if (isUndefined(this.opts.appKey)) {
      this.listenFunc.onError('没有设置appkey')
      return
    }

    if (!this.isConnected()) {
      this.connect()
      // 等待连接 (500毫秒检查一次)
      await this.checkConnected(500, timeout)
    }

    if (!this.isConnected()) {
      this.listenFunc.onError('服务器连接失败')
      return
    }

    // 已登录
    if (this._logged) {
      return
    }

    // 正常登录保存用户名及token
    if (!isUndefined(username) && !isUndefined(token)) {
      this._loginForm = {
        username: username,
        token: token
      }
    }
    // 发送登录
    let body = JSON.stringify({
        id: this._loginForm.username,
        password: this._loginForm.token,
        platform: "mobile"
    })

    this.ws.send(JSON.stringify({
      type: 'auth',
      body: body,
    }))

    this._logged = true
  }

  getUniqueId () {
    return 'WEBIM_' + Math.random().toString(36).substr(2, 9)
  }

  isConnected () {
    return this._state === WState.Connected
  }

  isLogged () {
    return this._logged === true
  }

  send (to, message, success = null, error = null) {
    if (this._state !== WState.Connected) {
      if (error) error('服务器未连接')
      return
    }
    if (isUndefined(to) || isUndefined(message)) {
      if (error) error('缺少参数')
      return
    }
    const id = this.getUniqueId()
    this._listenReceived[id] = (message) => success && success(message)
    this.ws.send(JSON.stringify({
      id: id,
      type: 'message',
      to: to,
      body: message,
      created: new Date().getTime()
    }))
  }

  close () {
    this.isAutoReconnect = false
    this.ws.close()
  }

  reconnect (ok = false) {
    if (ok) this.isAutoReconnect = true
    if (this._timer) clearInterval(this._timer) // 先清除再连接
    if (this._reconnectTimes < this.opts.autoReconnectNumMax) {
      this._reconnectTimer = setInterval(() => {
        if (!this.isConnected()) {
          this.connect()
          this._reconnectTimes++
        }
      }, this.opts.autoReconnectInterval * 1000)
    }
  }
}

export default WebIM
