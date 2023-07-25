
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useWsDataStore = defineStore('wsDataStore', () => {
  const lastPrice = ref(0) // 最新價格 OBJ
  const asksList = ref([])
  const bidsList = ref([])

  // 設定 websocket 回傳資料
  const setWebSockData = (data) => {

    // 設定最新價格
    if (data.topic === 'tradeHistoryApi') {
      const { price } = data.data[0]
      lastPrice.value = price
    }

    // 設定最新價格
    if (data.topic === 'update:BTC-PERP') {
      const { type, asks, bids } = data.data
      if (type === 'snapshot') {
        asksList.value = asks
        bidsList.value = bids
      }

      if (type === 'delta') {
        asks.forEach(askItem => {
          const index = asksList.value.findIndex((askIndex => askIndex[0] === askItem[0]))
          if (askItem[1] === '0') {
            asksList.value.splice(index, 1)
          } else {
            if (index === -1) {
              asksList.value.push([...askItem, true])
              asksList.value.sort((a, b) => {
                return Number(b[0]) - Number(a[0]);
              })
            } else {
              asksList.value[index] = [...askItem, false]
            }
          }
        });

        bids.forEach(bidItem => {
          const index = bidsList.value.findIndex((bidIndex => bidIndex[0] === bidItem[0]))
          if (bidItem[1] === '0') {
            bidsList.value.splice(index, 1)
          } else {
            if (index === -1) {
              bidsList.value.push([...bidItem, true])
              bidsList.value.sort((a, b) => {
                return Number(b[0]) - Number(a[0]);
              })
            } else {
              bidsList.value[index] = [...bidItem, false]
            }
          }
        });
      }
    }
  }

  const totalQuoteAsk = computed(() => {
    let sum = 0
    asksList.value.forEach(i => {
      sum += Number(i[1])
    })
    return sum
  })

  const totalQuoteBid = computed(() => {
    let sum = 0
    bidsList.value.forEach(i => {
      sum += Number(i[1])
    })
    return sum
  })

  return {
    lastPrice,
    asksList,
    bidsList,
    totalQuoteAsk,
    totalQuoteBid,
    setWebSockData
  }
})