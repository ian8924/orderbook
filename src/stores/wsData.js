
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWsDataStore = defineStore('wsDataStore', () => {
  // kline
  const klineData = ref([])
  // orderBook
  const bookObj = ref({})

  // 設定 websocket 回傳資料
  const setWebSockData = (data) => {
    // 設定 orderBook
    if (data.code === 0 && data.result && data.result.channel === 'book') {
      const { asks, bids } = data.result.data[0]
      bookObj.value[data.result.instrument_name] = {
        asks,
        bids
      }
    }
    // 設定 kline
    if (data.code === 0 && data.result && data.result.channel === 'candlestick') {
      klineData.value = [...data.result.data]
    }
  }

  return {
    bookObj,
    klineData,
    setWebSockData
  }
})