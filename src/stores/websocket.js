import { defineStore } from 'pinia'
import { useWsDataStore } from '@/stores/wsData'

export const useWebsocketStore = defineStore('websocketStore', () => {
  const wsDataStore = useWsDataStore()

  class webSockStore {
    constructor(url, sendData) {
      this.wsUrl = url
      this.sendData = sendData
      this.socketOn = false
      this.lockReconnectTop = false
      this.timeoutTop = null
      this.socket = null
      this.seqNum = 0
    }

    connectSocket = () => {
      return new Promise((resolve) => {
        if (this.socketOn) {
          resolve(true)
          return
        }
        this.socket = new WebSocket(this.wsUrl)
        this.socket.binaryType = 'arraybuffer'
        this.webSocketEvent()
        // 監聽事件
        this.websocketOnMessage()
        // 確認連接
        this.socket.onopen = () => {
          console.log('websocket connected!!')
          // 開始心跳檢測
          this.heartCheck()
          this.socketOn = true
          this.socketSend()
          resolve(true)
        }
      })
    }

    webSocketEvent = () => {
      // 重新連線(onopen)
      this.socket.onclose = () => {
        console.error('websocket close!!')
        this.socketOn = false
        this.reconnectTop()
      }

      // 監聽錯誤(onerror)
      this.socket.onerror = (err) => {
        console.error('error', err)
      }
    }

    // 監聽事件
    websocketOnMessage = () => {
      this.socket.onmessage = (event) => {
        // 監聽訊息(onmessage)
        const data = JSON.parse(event.data)
        wsDataStore.setWebSockData(data)
      }
    }

    // 檢測心跳
    heartCheck = () => {
      const timeout = 30000
      console.log('正在檢測心跳')
      if (this.socket.readyState !== 3) {
        clearTimeout(this.timeoutTop)
        if (!this.lockReconnectTop) {
          this.timeoutTop = setTimeout(() => {
            console.log('未檢測到心跳')
            this.socket.close()
          }, timeout)
        }
      }
    }

    // 重新連線
    reconnectTop = () => {
      if (!this.lockReconnectTop) {
        this.lockReconnectTop = true
        setTimeout(() => {
          console.log('即將重新連線')
          this.connectSocket()
        }, 3000)
      }
    }

    // 發送事件
    socketSend = () => {
      this.socket.send(JSON.stringify(this.sendData))
    }

  }

  // 最新價格 websocket
  const WebSocketLastPrice = new webSockStore('wss://ws.btse.com/ws/futures', {
    "op": "subscribe",
    "args": [
      "tradeHistoryApi:BTCPFC"
    ]
  })
  // 訂單簿 websocket
  const WebSocketOrderBook = new webSockStore('wss://ws.btse.com/ws/oss/futures', {
    "op": "subscribe",
    "args": [
      "update:BTC-PERP"
    ]
  })

  return {
    // 最新價格
    connectSocketLastPrice: WebSocketLastPrice.connectSocket,
    socketSendLastPrice: WebSocketLastPrice.socketSend,
    // 訂單簿
    connectSocketOrderBook: WebSocketOrderBook.connectSocket,
    socketSendOrderBook: WebSocketOrderBook.socketSend,
  }
})


