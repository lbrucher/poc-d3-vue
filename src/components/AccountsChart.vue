<script setup>
import { ref, onMounted, watch } from 'vue';
import * as d3 from 'd3';

const props = defineProps({
  client: Object,
  chartData: Object,
  accounts: Array,
  cardTypes: Array
});

const emit = defineEmits(['click']);

const chartElement = ref(null);

const debug = false;



let svg;
let x;   // x scale
let y;   // y scale

const margins = {top:30, right:30, bottom:30, left:30};
const barWidth = 50;

const unknownCardTypeColor = '#999';
const cardTypeColors = buildCardTypeColors();



// Wait for the component to be mounted because we need 'chartElement' to be properly bound to the <div>
onMounted(() => {
  createChart();
});

watch(() => props.accounts, () => {
  updateChart();
});


function buildCardTypeColors() {
  const colors = {};
  for(const ct of props.cardTypes){
    colors[ct.name] = ct.color;
  }
  return colors;
}


function onChartClicked() {
//  this.chartClicked.emit();
}

function getChartInnerHeight(){
  // this (barWidth+10) sucks. prolly why the bar gets thinner when it's the unique one to draw on the chart...
//    return this.accounts.length*(this.barWidth+10);
  return props.accounts.length * barWidth;
}

function adjustChartHeight(chartInnerHeight) {
  // Adjust the englobing <div>'s height so that the entire chart can be seen
  // We max it out at 400px with a scroll overflow.
  const height = chartInnerHeight + margins.top + margins.bottom;
  chartElement.value.style.height = (height > 400 ? 400:height)+'px';
}

function displayNoChartInfo() {
  // Always get rid of the message if there was one!
  svg.select('.account-no-chart').remove();

  if (props.accounts.length === 0){
    const t = d3.transition().duration(750);
    svg
      .append("text")
        .attr("x", chartElement.value.clientWidth/2)
        .attr("text-align", "center")
        .attr("text-anchor", "middle")
        .attr("class", "account-no-chart")
        .style("font-family", "Verdana, Arial, Helvetica, sans-serif")
        .style("font-size", "9pt")
        .attr("fill", "#999")
        .text("There are no accounts to display!")
      .transition(t)
        .attr("y", chartElement.value.clientHeight/2);
  }
}

function createChart() {
  svg = d3.select(chartElement.value)
    .append("svg:svg")
    .attr("width", "100%")
    .attr("height", "100%");

  // This is the amount of vertical space we need for the chart
  const chartInnerHeight = getChartInnerHeight();

  // Adjust chart height
  adjustChartHeight(chartInnerHeight);

  // X/Y Scales
  x = d3.scaleLinear()
          .domain([props.chartData.minValue, props.chartData.maxValue])
          .range([margins.left, chartElement.value.clientWidth-margins.right]);

  y = d3.scaleBand()
        .domain(props.accounts.map(a => a.number.toString()))
        .range([margins.top, chartInnerHeight])
        .padding(0.1);

  // X Axis
  svg.append("g")
    .attr("class", "xaxis")
    .style("opacity", props.accounts.length === 0 ? 0:1)
    .attr("transform", `translate(0,${chartInnerHeight})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Y Axis
  svg.append("g")
    .attr("class", "yaxis")
    .style("opacity", props.accounts.length === 0 ? 0:1)
    .attr("transform", `translate(${x(0)}, 0)`)
    .call(d3.axisLeft(y).tickSize(0))
    .call(g => g.selectAll(".tick text")
                .filter((d, i) => props.accounts[i].balance < 0)
                .attr("transform", "translate(8,0)")
                .style("text-anchor", "start")
        );


  drawBars();
  displayNoChartInfo();
}  


function updateChart() {
  const chartInnerHeight = getChartInnerHeight();
  y.domain(props.accounts.map(a => a.number.toString()))
  y.range([margins.top, chartInnerHeight]);

  // Readjust the chart's height
  adjustChartHeight(chartInnerHeight);

  const t = d3.transition().duration(750);

  svg.selectAll(".xaxis")
    .transition(t)
    .attr("transform", `translate(0,${chartInnerHeight})`)
    .style("opacity", props.accounts.length === 0 ? 0:1)

  svg.selectAll(".yaxis")
    .transition(t)
    .style("opacity", props.accounts.length === 0 ? 0:1)
    .call(d3.axisLeft(y));

  drawBars();
  displayNoChartInfo();
}


function barColor(account) {
  return cardTypeColors[account.card_type] || unknownCardTypeColor;
}


function drawBars() {
  const x0 = x(0);

  // In essence we're each time rebuilding the entire chart: some bar are new,
  // some need to be removed and others are still there, but maybe at a different
  // location on the band axis...
  // Our data is keyed by 'id' and we can't tell if an element with a given id
  // and in both the old and new datasets is at the same place on the chart.
  // Kinda the easiest here is to just remove all bars and recreate the chart.
  // It's not that bad With some animation...
  // 
  svg.selectAll("rect.bar").remove();

  const t = d3.transition().duration(750);
  const bars = svg.selectAll("rect.bar")
                .data(props.accounts, (a) => a.id);

  // Enter new elements
  bars.enter()
    .append("rect")
      .attr("class", "bar")
      .attr("y", (a) => y(a.number.toString()))
      .attr("height", y.bandwidth())
      .attr("fill", (a) => barColor(a))
      .attr("x", (a) => a.balance >= 0 ? x0 : x(a.balance))
    .transition(t)
      .attr("width", (a) => Math.abs(x(a.balance)-x0));
}
</script>

<template>
  <div class="account-chart-container">
    <div ref="chartElement" class="account-chart" @click="$emit('click')">
      <div v-if="debug">
        <div v-for="acc in accounts" style="font-size:80%;">
          {{acc.card_type}}: {{acc.balance}}
        </div>
      </div>
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