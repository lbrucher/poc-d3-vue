<script setup>
import { ref, watchEffect } from 'vue'
import { ClientsService } from '@/services/clients.service'
import Client from '@/components/Client.vue';
import ClientsFilter from '@/components/ClientsFilter.vue';
import CardTypesLegend from '@/components/CardTypesLegend.vue';

let clients = [];
const totalClients = ref(0);
const filteredClients = ref([]);
const loadingClient = ref(true);
const loadError = ref(null);
const barChartData = ref({}); // ChartData;
const accountsChartLegendItems = ref([]);
let cardTypes = [];
const selectedCardTypes = ref([]);


watchEffect( async () => {
  loadError.value = null;
  loadingClient.value = true;

  try {
    const data = await ClientsService.getClients();
console.log("DATA=",data);
    clients.value = data.clients;
    cardTypes = data.cardTypes; //.map(ct => ({...ct, selected:true}));
    totalClients.value = clients.value.length;
    filteredClients.value = clients.value.slice(0);
    selectedCardTypes.value = cardTypes.slice(0);
  }
  catch(err) {
    loadError.value = err.toString();
  }
  finally {
    loadingClient.value = false;
  }
});

function onCardTypeSelectionChanged(types){
  console.log("onCardTypeSelectionChanged: ", types);
  selectedCardTypes.value = types;
}

function onSetFilteredClients(filteredClients) {
  console.log("onSetFilteredClients: ", filteredClients);
}
</script>

<template>
  <div class="clients">
  <div v-if="loadingClient" class="loading">
    Loading clients information...
    <div class="spinner-grow spinner-grow-sm text-secondary"></div>
  </div>
  <div v-if="loadError" class="load-error">There was an error loading client data: <pre>{{loadError}}</pre></div>
  <div v-if="!loadingClient && !loadError" class="content">
    <div class="row">
      <div class="col-3">
        <ClientsFilter :clients="clients" @setClients="onSetFilteredClients" />
        <!-- <app-clients-filter [clients]="clients" (setClients)="setFilteredClients($event)"></app-clients-filter> -->
      </div>
      <div class="col-7 align-self-center">
        <CardTypesLegend :cardTypes="cardTypes" @cardTypeSelectionChanged="onCardTypeSelectionChanged" />
      </div>
      <div class="col-2 align-self-center showing-clients">Showing {{filteredClients.length}} of {{totalClients}} clients </div>
    </div>

    <ul>
      <li v-for="client in filteredClients" :key="client.id">
        <Client :client="client" :cardTypes="selectedCardTypes" :chartData="barChartData" />
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
    color:red;
  }
}
</style>
