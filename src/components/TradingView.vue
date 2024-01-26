<template>
  <div id="k-line-chart" />
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useFetch } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { init, dispose } from 'klinecharts'
import { useWsDataStore } from '../stores/wsData'
const wsData = useWsDataStore()

const { klineData } = storeToRefs(wsData)
const dataList = ref([])
const chart = ref(null)

// 標準化 Data
const genData = (i) => {
  return {
    open: i.o,
    high: i.h,
    low: i.l,
    close: i.c,
    timestamp: i.t,
    volume: i.v
  }
}

watch(
  () => klineData.value,
  (val) => {
    // 第一次取得 kline 初始值
    if (val.length > 1) {
      dataList.value = []
      val.forEach((i) => {
        dataList.value.push(genData(i))
      })
      chart.value.applyNewData(dataList.value)
    } else {
      // 刷新 last data
      const currentData = dataList.value
      const lastData = currentData[currentData.length - 1]
      let newData = { ...lastData }
      newData = genData(val[0])
      chart.value.updateData(newData)
    }
  },
  {
    deep: true,
    immdeate: true
  }
)

onMounted(() => {
  // 初始化圖表
  chart.value = init('k-line-chart')
  // 取得更多歷史 kline
  chart.value.loadMore(async (timestamp) => {
    const url = `https://api.crypto.com/exchange/v1/public/get-candlestick?instrument_name=BTCUSD-PERP&timeframe=M1&end_ts=${timestamp}`
    const { data } = await useFetch(url)
    const res = JSON.parse(data.value)
    const newData = res.result.data.map((i) => {
      return genData(i)
    })
    chart.value.applyMoreData(newData, true)
  })
})

onUnmounted(() => {
  // 銷毀圖表
  dispose('chart')
})
</script>

<style lang="scss" scoped>
#k-line-chart {
  min-width: 800px; 
  height: 430px
}
</style>