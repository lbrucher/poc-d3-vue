<script setup>
import { ref, watch } from 'vue'
import AccountsChart from '@/components/AccountsChart.vue'

const props = defineProps({
  client: Object,
  cardTypes: Array,
  chartData: Object
})

const balancesRep = ref(null)
const accountsToShow = ref([])
refreshAccountsToShow()

watch(
  () => props.cardTypes,
  () => {
    refreshAccountsToShow()
  }
)

function refreshAccountsToShow() {
  const types = props.cardTypes.map((ct) => ct.name)
  accountsToShow.value = props.client.accounts.filter((a) => types.includes(a.card_type))

  balancesRep.value = buildBalanceRep()
}

function buildBalanceRep() {
  const nAccounts = accountsToShow.value.length
  const countPos = accountsToShow.value.filter((a) => a.balance >= 0).length
  const countNeg = nAccounts - countPos

  return {
    negative: { count: countNeg, percent: nAccounts === 0 ? 0 : countNeg / nAccounts },
    positive: { count: countPos, percent: nAccounts === 0 ? 0 : countPos / nAccounts }
  }
}

function getClientName() {
  const firstname = props.client.firstname || ''
  const spacer = firstname.length > 0 ? ' ' : ''
  return `${firstname}${spacer}${props.client.name}`
}

function hasAddress() {
  return (props.client.address || '') !== ''
}

function hasDoB() {
  // Verify we have a valid date
  const ts = Date.parse(props.client.birthday || '')
  return !isNaN(ts)
}

function getClientDoB() {
  // Output whatever we got in the client model
  // API does not return an ISO date, which is too bad.
  return props.client.birthday
}

function getClientNameTitle() {
  return `${balancesRep.value.negative.count} account${balancesRep.value.negative.count > 1 ? 's' : ''} ${balancesRep.value.negative.count > 1 ? 'have' : 'has'} a negative balance (${Math.round(balancesRep.value.negative.percent * 100)}%)`
}

function showAccountDetails() {
  // Skip if there are no accounts to show
  if (accountsToShow.value.length === 0) {
    return
  }

  // const modalRef = modalService.open(AccountsPopupComponent, {size:'lg'});
  // modalRef.componentInstance.client = props.client;
  // modalRef.componentInstance.clientName = getClientName();
}

function onChartClicked() {
  showAccountDetails()
}
</script>

<template>
  <div class="client row g-0">
    <div class="col-3">
      <div class="client-info">
        <div v-if="balancesRep.negative.count == 0" class="name">{{ getClientName() }}</div>
        <div v-if="balancesRep.negative.count > 0" class="name error" :title="getClientNameTitle()">
          {{ getClientName() }}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-exclamation-triangle"
            viewBox="0 0 16 16"
          >
            <path
              d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z"
            />
            <path
              d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"
            />
          </svg>
        </div>
        <div class="address" v-if="hasAddress()">{{ client.address }}</div>
        <div class="dob" v-if="hasDoB()">Born on {{ getClientDoB() }}</div>
      </div>
    </div>

    <div class="col accounts">
      <div v-if="accountsToShow.length > 0" class="account-details" @click="showAccountDetails()">
        Account Details...
      </div>
      <AccountsChart
        :client="client"
        :cardTypes="cardTypes"
        :chartData="chartData"
        :accounts="accountsToShow"
        @click="onChartClicked"
      />
    </div>
  </div>
</template>

<style>
div.client {
  width: 100%;
  min-height: 100px;
  background-color: #fbfbfb;
  border: 1px solid #f0f0f0;
  border-radius: 5px;
  margin-bottom: 8px;
  margin-left: 0;
  position: relative;
  padding: 8px 0;

  .client-info {
    height: 100px;

    .name {
      font-weight: bold;
      margin-bottom: 4px;
    }
    .name.error {
      color: red;

      svg {
        margin-top: -4px;
        margin-left: 6px;
      }
    }

    .address,
    .dob {
      font-size: 75%;
    }
  }

  .account-balances {
    font-size: 80%;
  }

  .accounts > .account-details {
    position: absolute;
    top: 2px;
    right: 10px;
    font-size: 70%;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 2px 4px;
    background-color: #f5f5f5;
    color: #666;
    cursor: pointer;
  }
  .accounts > .account-details:hover {
    background-color: #ddd;
  }
}
</style>
