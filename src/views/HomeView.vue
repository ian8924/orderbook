<script setup lang="ts">
import OrderBook from '../components/OrderBook.vue'
import { useWebsocketStore } from '../stores/websocket.js'

import { onMounted } from 'vue'

const websocket = useWebsocketStore()

const { connectSocketLastPrice, connectSocketOrderBook } = websocket

onMounted( async() => {
  connectSocketLastPrice()
  connectSocketOrderBook()
})
</script>

<template>
  <main>
    <OrderBook />
  </main>
</template>
