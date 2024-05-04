<script setup>
import { ref } from 'vue';
import * as d3 from 'd3';

const props = defineProps({
  client: Object,
  chartData: Object,
  accounts: Array,
  cardTypes: Array
});

const emit = defineEmits(['click']);



</script>

<template>
  <div class="account-chart-container">
    <div id="accountChart" class="account-chart" @click="$emit('click')">
      [ CHART ]
    </div>
  </div>
</template>

<style>
.account-chart-container {
  overflow-y: scroll;
  max-height: 400px; /* make sure the chart does not take too much vertical space when there are a large number of accounts */

  .account-chart {
    width:100%;
  }
}
</style>