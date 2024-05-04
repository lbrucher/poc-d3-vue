<script setup>
import { ref } from 'vue'

const props = defineProps({
  cardTypes: Array
})

const emit = defineEmits(['cardTypeSelectionChanged'])

const selCardTypes = ref(props.cardTypes.map((ct) => ({ type: ct, selected: true })))

function selectCardType(type) {
  type.selected = !type.selected

  const selectedTypes = selCardTypes.value.filter((t) => t.selected).map((t) => t.type)
  emit('cardTypeSelectionChanged', selectedTypes)
}
</script>

<template>
  <div class="account-chart-legend">
    <span v-for="item in selCardTypes" :key="item.name" @click="selectCardType(item)" class="legend-item">
      <input type="checkbox" :checked="item.selected" /> {{ item.type.name }}
      <div class="legend-box" :style="{ 'background-color': item.type.color }"></div>
    </span>
  </div>
</template>

<style>
.account-chart-legend {
  text-align: center;
  font-family: Verdana, Arial, Helvetica, sans-serif;
  font-size: 9pt;
  padding: 0 8px;

  span,
  span > input {
    cursor: pointer;
  }

  .legend-box {
    display: inline-block;
    width: 16px;
    height: 14px;
    margin: 0 16px 0 4px;
  }
}
</style>
