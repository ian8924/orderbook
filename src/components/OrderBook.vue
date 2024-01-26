<script setup>
import { storeToRefs } from 'pinia'
import { useWsDataStore } from '../stores/wsData'

import { computed } from 'vue'
import { numberComma } from '../utils/help'

const props = defineProps({
  name: {
    default: '',
    type: String
  }
})

const wsData = useWsDataStore()

const { bookObj } = storeToRefs(wsData)

// 賣單表格
const asksDataList = computed(() => {
  const data = []
  if (!bookObj.value[props.name]) {
    return []
  }
  const askArray = bookObj.value[props.name].asks.slice(0, 5)
  askArray.forEach((item) => {
    const obj = {
      price: item[0],
      amount: item[1]
    }
    data.unshift(obj)
  })
  return data
})

// 買單表格
const bidsDataList = computed(() => {
  const data = []
  if (!bookObj.value[props.name]) {
    return []
  }
  const bidsArray = bookObj.value[props.name].bids.slice(0, 5)
  bidsArray?.forEach((item) => {
    const obj = {
      price: item[0],
      amount: item[1]
    }
    data.push(obj)
  })
  return data
})
</script>

<template>
  <div class="content">
    <div class="order-title">{{ props.name }}</div>
    <div class="order-table">
      <div class="table-body">
        <div class="table-row buy" v-for="item in asksDataList" :key="item.price">
          <div class="td">{{ numberComma(item.price) }}</div>
          <div class="td">{{ item.amount }}</div>
        </div>
      </div>
    </div>
    <div class="order-table">
      <div class="table-body">
        <div class="table-row sell" v-for="item in bidsDataList" :key="item.price">
          <div class="td">
            {{ numberComma(item.price) }}
          </div>
          <div class="td">{{ item.amount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/_variable.scss';
.content {
  width: 200px;
  color: #f0f4f8;
  .order-title {
    width: 100%;
    padding: 4px;
    color: black;
  }

  .order-table {
    .table-body {
      .table-row {
        display: flex;
        position: relative;
        &.buy {
          color: green;
        }
        &.sell {
          color: red;
        }

        .td {
          flex: 1;
          padding: 4px;
          text-align: right;
          z-index: 1;
          &:first-child {
            text-align: left;
            flex: initial;
            width: 150px;
          }
        }
      }
    }
  }
}
</style>
