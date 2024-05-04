<script setup>

const props = defineProps({
  cardTypes: Array
});

function selectCardType(type, evt) {

}
</script>

<template>
  <div class="account-chart-legend">
    <span v-for="item in cardTypes" @click="selectCardType(item, $event)" class="legend-item">
      <input type="checkbox" checked /> {{item.name}}<div class="legend-box" :style="{'background-color': item.color}"></div>
    </span>
  </div>
</template>

<style>
.account-chart-legend {
    text-align: center;
    font-family: Verdana, Arial, Helvetica, sans-serif;
    font-size: 9pt;
    padding:0 8px;

    span, span>input {
      cursor: pointer;
    }

    .legend-box {
      display: inline-block;
      width:16px;
      height:14px;
      margin: 0 16px 0 4px;
    }
}
</style>
