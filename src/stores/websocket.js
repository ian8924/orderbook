import { defineStore } from 'pinia'
import { useWsDataStore } from '@/stores/wsData'

export const useWebsocketStore = defineStore('websocketStore', () => {
  const wsDataStore = useWsDataStore()

  class webSockStore {
    constructor(url, sendData) {
      this.wsUrl = url
      this.sendData = sendData
      this.socket = null
      this.heartMessage = {
        id: 0,
        method: 'public/respond-heartbeat'
      }
    }

    connectSocket = () => {
      return new Promise((resolve) => {
        this.socket = new WebSocket(this.wsUrl)
        this.socket.binaryType = 'arraybuffer'
        this.webSocketEvent()
        // 監聽事件
        this.websocketOnMessage()
        // 確認連接
        this.socket.onopen = () => {
          this.socketSend()
          resolve(true)
        }
      })
    }

    webSocketEvent = () => {
      // 重新連線(onopen)
      this.socket.onclose = () => {
        console.error('websocket close!!')
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
        if (data.method === 'public/heartbeat') {
          this.heartMessage = {
            ...this.heartMessage,
            id: data.id
          }
          this.socket.send(JSON.stringify(this.heartMessage))
        }
      }
    }

    // 重新連線
    reconnectTop = () => {
      setTimeout(() => {
        console.log('即將重新連線')
        this.connectSocket()
      }, 3000)
    }

    // 發送事件
    socketSend = () => {
      this.socket.send(JSON.stringify(this.sendData))
    }
  }

  // websocket
  const WebSocketTest = new webSockStore('wss://stream.crypto.com/exchange/v1/market', {
    id: 1,
    method: 'subscribe',
    params: {
      channels: [
        'book.BTCUSD-PERP.10',
        'book.ETHUSD-PERP.10',
        'book.SOL_USDT.10',
        'book.XRP_USDT.10',
        'book.ADA_USDT.10',
        'book.MATIC_USDT.10',
        'candlestick.M1.BTCUSD-PERP'
      ]
    },
    nonce: 1654784123465
  })

  return {
    connectSocket: WebSocketTest.connectSocket
  }
})
