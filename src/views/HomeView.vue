<script setup>
import { onMounted } from 'vue'
import OrderBook from '../components/OrderBook.vue'
import TradingView from '../components/TradingView.vue'

import { useWebsocketStore } from '../stores/websocket.js'

const websocket = useWebsocketStore()

const { connectSocket } = websocket

onMounted(async () => {
  connectSocket()
})
</script>

<template>
  <main>
    <div class="order-list">
      <div>
        <div class="title">
          任務一:最佳十檔
        </div>
        <div class="orders">
          <OrderBook :name="'BTCUSD-PERP'" />
          <OrderBook :name="'ETHUSD-PERP'" />
          <OrderBook :name="'SOL_USDT'" />
        </div>
        <div class="orders">
          <OrderBook :name="'XRP_USDT'" />
          <OrderBook :name="'ADA_USDT'" />
          <OrderBook :name="'MATIC_USDT'" />
        </div>
      </div>
      <div class="k-line-area">
        <div class="title">
          任務二:k線圖
        </div>
        <TradingView />
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.order-list {
  width: 100vw;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  .title {
    font-size: 16px;
    font-weight: 800;
    margin: 12px 0;
  }
  .orders {
    display: flex;
    gap: 8px;
  }
  .k-line-area {
    min-width: 800px;
  }
}
</style>
