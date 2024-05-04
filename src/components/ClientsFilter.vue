<script setup>
import { ref } from 'vue';

const props = defineProps({
  clients: Array
});

const emit = defineEmits(['setClients']);

const inputText = defineModel();

function submit() {
  const lowText = inputText.value.toLowerCase();
  const clients = props.clients.value.filter(c => `${c.firstname||''} ${c.name}`.toLowerCase().includes(lowText));
  emit('setClients', clients);
}
</script>

<template>
  <div class="filter-clients">
    <input placeholder="Filter clients..." type="text" v-model="inputText" @keyup.enter="submit">
  </div>
</template>

<style>
.filter-clients > input {
  width:100%;
  font-size:90%;
}
</style>
