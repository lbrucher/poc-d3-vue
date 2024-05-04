<script setup>
import { ref, watchEffect } from 'vue'
import { ClientsService } from '@/services/clients.service'
import ClientComponent from '@/components/ClientComponent.vue'
import ClientsFilter from '@/components/ClientsFilter.vue'
import CardTypesLegend from '@/components/CardTypesLegend.vue'

let clients = []
const totalClients = ref(0)
const filteredClients = ref([])
const loadingClient = ref(true)
const loadError = ref(null)
const barChartData = ref({}) // ChartData;
let cardTypes = []
const selectedCardTypes = ref([])

watchEffect(async () => {
  loadError.value = null
  loadingClient.value = true

  try {
    const data = await ClientsService.getClients()
    console.log('DATA=', data)
    clients = data.clients
    cardTypes = data.cardTypes //.map(ct => ({...ct, selected:true}));
    totalClients.value = clients.length
    filteredClients.value = clients.slice(0)
    selectedCardTypes.value = cardTypes.slice(0)
    barChartData.value = buildChartData(clients)
  } catch (err) {
    loadError.value = err.toString()
  } finally {
    loadingClient.value = false
  }
})

function buildChartData(clients) {
  return {
    minValue: Math.min(...clients.map((c) => Math.min(...c.accounts.map((a) => a.balance)))),
    maxValue: Math.max(...clients.map((c) => Math.max(...c.accounts.map((a) => a.balance))))
  }
}

function onCardTypeSelectionChanged(types) {
  console.log('onCardTypeSelectionChanged: ', types)
  selectedCardTypes.value = types
}

function onSetFilteredClients(newFilteredClients) {
  filteredClients.value = newFilteredClients.slice(0)
}
</script>

<template>
  <div class="clients">
    <div v-if="loadingClient" class="loading">
      Loading clients information...
      <div class="spinner-grow spinner-grow-sm text-secondary"></div>
    </div>
    <div v-if="loadError" class="load-error">
      There was an error loading client data:
      <pre>{{ loadError }}</pre>
    </div>
    <div v-if="!loadingClient && !loadError" class="content">
      <div class="row">
        <div class="col-3">
          <ClientsFilter :clients="clients" @setClients="onSetFilteredClients" />
        </div>
        <div class="col-7 align-self-center">
          <CardTypesLegend
            :cardTypes="cardTypes"
            @cardTypeSelectionChanged="onCardTypeSelectionChanged"
          />
        </div>
        <div class="col-2 align-self-center showing-clients">
          Showing {{ filteredClients.length }} of {{ totalClients }} clients
        </div>
      </div>

      <ul>
        <li v-for="client in filteredClients" :key="client.id">
          <ClientComponent :client="client" :cardTypes="selectedCardTypes" :chartData="barChartData" />
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
div.clients {
  margin-top: 20px;

  ul {
    margin: 8px 0 0 0;
    padding: 0;

    li {
      list-style-type: none;
      padding: 0;
    }
  }

  div.showing-clients {
    text-align: right;
    font-size: 75%;
  }

  .load-error {
    color: red;
  }
}
</style>
