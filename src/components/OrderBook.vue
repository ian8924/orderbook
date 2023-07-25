<script setup>
import { storeToRefs } from 'pinia'
import { useWsDataStore } from '../stores/wsData'

import IconArrowDown from './icons/IconArrowDown.vue'
import { watch, ref, computed } from 'vue'
import { numberComma } from '../utils/help'

const wsData = useWsDataStore()

const { lastPrice, asksList, bidsList, totalQuoteAsk, totalQuoteBid } = storeToRefs(wsData)

//最新價格變更狀態
const lastPriceChange = ref('no-change')
watch(lastPrice, (val, oldVal) => {
  if (!oldVal) {
    lastPriceChange.value = 'no-change'
  } else {
    const changeAmount = val - oldVal
    if (changeAmount > 0) {
      lastPriceChange.value = 'gain'
    } else if (changeAmount === 0) {
      lastPriceChange.value = 'no-change'
    } else {
      lastPriceChange.value = 'lose'
    }
  }
})

// 賣單表格
const asksDataList = computed(() => {
  const data = []
  const length = asksList.value.length
  const askArray = asksList.value.slice(length - 8, length)
  let total = 0
  askArray.reverse().forEach((item) => {
    total += Number(item[1])
    const obj = {
      price: Number(item[0]),
      amount: Number(item[1]),
      firstIn: item[2],
      total: total
    }
    data.unshift(obj)
  })
  return data
})

// 買單表格
const bidsDataList = computed(() => {
  const data = []
  const bidsArray = bidsList.value.slice(0, 8)
  let total = 0
  bidsArray?.forEach((item) => {
    total += Number(item[1])
    const obj = {
      price: Number(item[0]),
      amount: Number(item[1]),
      firstIn: item[2],
      total: total
    }
    data.push(obj)
  })
  return data
})

// 運算長度百分比
const backgroundWithStyle = (currentValue, totalValue) => {
  let percent = `${(currentValue / totalValue) * 100}%`
  return percent
}
</script>

<template>
  <div class="content">
    <div class="order-title">Order Book</div>
    <div class="order-table">
      <div class="table-header">
        <div class="th">Price (USD)</div>
        <div class="th">Size</div>
        <div class="th">Total</div>
      </div>
      <div class="table-body">
        <div
          class="table-row buy"
          v-for="item in asksDataList"
          :key="item.price"
          :class="{ 'bg-flash': item.firstIn }"
        >
          <div class="td">{{ numberComma(item.price) }}</div>
          <div class="td">{{ item.amount }}</div>
          <div class="td">{{ item.total }}</div>
          <div
            class="bg-line buy"
            :style="{
              width: backgroundWithStyle(item.total, totalQuoteAsk)
            }"
          ></div>
        </div>
      </div>
    </div>
    <div
      class="last-price"
      :class="{
        gain: lastPriceChange === 'gain',
        lose: lastPriceChange === 'lose',
        even: lastPriceChange === 'no-chang'
      }"
    >
      <span class="price">{{ numberComma(lastPrice) }}</span>
      <IconArrowDown v-if="lastPriceChange !== 'no-change'" class="arrow-icon" :size="16" />
    </div>
    <div class="order-table">
      <div class="table-body">
        <div
          class="table-row sell"
          v-for="item in bidsDataList"
          :key="item.price"
          :class="{ 'bg-flash': item.firstIn }"
        >
          <div class="td">
            {{ numberComma(item.price) }}
          </div>
          <div class="td">{{ item.amount }}</div>
          <div class="td">{{ item.total }}</div>
          <div
            class="bg-line sell"
            :style="{
              width: backgroundWithStyle(item.total, totalQuoteBid)
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/_variable.scss';
.content {
  width: 500px;
  background-color: $bg_default_color;
  color: #f0f4f8;
  .order-title {
    width: 100%;
    padding: 8px 12px;
  }

  .order-table {
    .table-header {
      display: flex;
      color: $header_color;
      .th {
        flex: 1;
        padding: 6px 12px;
        text-align: right;
        &:first-child {
          text-align: left;
          flex: initial;
          width: 150px;
        }
      }
    }
    .table-body {
      .table-row {
        display: flex;
        position: relative;
        &.bg-flash.buy {
          background-color: rgba(0, 177, 93, 0.5);
        }
        &.bg-flash.sell {
          background-color: rgba(255, 91, 90, 0.5);
        }
        .bg-line {
          height: 90%;
          transition: all linear 0.2s;
          position: absolute;
          top: 10%;
          right: 0;
          z-index: 0;
          &.buy {
            background-color: rgba(16, 186, 104, 0.12);
          }
          &.sell {
            background-color: rgba(255, 90, 90, 0.12);
          }
        }
        .td {
          flex: 1;
          padding: 6px 12px;
          text-align: right;
          z-index: 1;
          &:first-child {
            text-align: left;
            flex: initial;
            width: 150px;
          }
        }
        &:hover {
          background-color: $row_hover_color;
          cursor: pointer;
        }
      }
    }
  }

  .last-price {
    width: 100%;
    padding: 12px 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    .price {
      margin-right: 8px;
    }

    &.gain {
      color: $text_gain__color;
      background-color: $bg_gain__color;
      .arrow-icon {
        transform: rotate(180deg);
      }
    }

    &.even {
      color: $text_even__color;
      background-color: $bg_even__color;
    }

    &.lose {
      color: $text_lose__color;
      background-color: $bg_lose__color;
    }
  }
}
</style>
