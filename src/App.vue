<template>
  <body class="Container">
    <AddTicker @add-ticker="add" :disabled="tooManyTickersAdded" />

    <div v-if="tickers.length" class="TickersContainer">
      <p>
        Filter:
        <input
          v-model="filter"
          class="Input"
        >
        <button
          v-if="page > 1"
          @click="page = page - 1"
        >
          Prev
        </button>

        <button
          v-if="hasNextPage"
          @click="page = page + 1"
        >
          Next
        </button>
      </p>

      <div class="Tickers">
        <div
          v-for="t in paginatedTickers"
          :key="t.name"
          @click="handleSelect(t)"
          class="Ticker">
          <div  class="TickerData">
            <div
              :class="selectedTicker === t ? 'SelectedTicker' : ''"
            >
              {{ t.name }} - USD
            </div>
            <div 
              :class="{
                'SelectedTicker': selectedTicker === t
              }"
            >
              {{ formatPrice(t.price) }}
            </div>
          </div>

          <Button
            @click.stop="handleDelete(t)"
            title="Удалить"
            :secondaryStyle="true"
          />
        </div>
      </div>
    </div>

    <section v-if="selectedTicker">
      <Graph
        :tickerName="selectedTicker.name"
        :tickerPrice="selectedTicker.price"
      />      
    </section>

  </body>
</template>

<script>
import { subscribeToTicker, unsubscribeFromTicker } from './api.js'
import AddTicker from './components/AddTicker.vue'
import Button from './components/Button.vue'
import Graph from './components/Graph.vue'

export default {
  name: 'App',

  components: {
    AddTicker,
    Button,
    Graph
  },

  // data should not contain properties
  // whose values can be calculated based on the current state
  data() {
    return {
      tickers: [],
      selectedTicker: null,
      filter: "",
      page: 1
    }
  },

  created() {
    const windowData = Object.fromEntries(
      new URL(window,location).searchParams.entries()
    )

    const VALID_KEYS = ['filter', 'page']
    VALID_KEYS.forEach(key => {
      if (windowData[key]) {
        this[key] = windowData[key]
      }
    })

    const tickersData = localStorage.getItem("crypto-list")

    if (tickersData) {
      this.tickers = JSON.parse(tickersData)
      this.tickers.forEach(ticker => {
        subscribeToTicker(ticker.name, (newPrice) => 
          this.updateTicker(ticker.name, newPrice))
      })
    }
  },

  // computed does not change the state, but returns the value that is used in the template
  // computed used if there are dependencies
  computed: {
    startIndex() {
      return (this.page - 1) * 6
    },

    endIndex() {
      return this.page * 6
    },
    
    filteredTickers() {
      return this.tickers.filter(ticker => 
        ticker.name.includes(this.filter)
      )
    },

    paginatedTickers() {
      return this.filteredTickers.slice(this.startIndex, this.endIndex)
    },

    hasNextPage() {
      return this.filteredTickers.length > this.endIndex
    },

    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page
      }
    },

    tooManyTickersAdded() {
      return this.tickers.length > 20
    }
  },

  // there should be no dependencies in methods
  methods: {
    add(ticker) {
      const newTicker = {
        name: ticker,
        price: "0"
      }

      this.tickers = [...this.tickers, newTicker]
      this.filter = ""

      subscribeToTicker(newTicker.name, (newPrice) => 
        this.updateTicker(newTicker.name, newPrice))
    },

    updateTicker(tickerName, price) {
      this.tickers
       .filter(t => t.name === tickerName)
       .forEach(t => {t.price = price})
    },

    formatPrice(price) {
      if (price === "-") {
        return price
      }
      return price > 1 ? price.toFixed(2) : price.toPrecision(2)
    },

    handleSelect(ticker) {
      this.selectedTicker = ticker
    },

    handleDelete(tickerToRemove) {
      console.log("handleDelete tickerToRemove: ", tickerToRemove)
      this.tickers = this.tickers.filter(t => t !== tickerToRemove)

      if (this.selectedTicker == tickerToRemove) {
        this.selectedTicker = null
      }

      unsubscribeFromTicker(tickerToRemove.name)
    },
  },

  watch: {
    tickers() {
      console.log("watch tickers: ", this.tickers)
      localStorage.setItem("crypto-list", JSON.stringify(this.tickers))
    },

    paginatedTickers() {
      if (this.paginatedTickers.length === 0 && this.page > 1) {
        this.page -= 1
      }
    },

    filter() {
      this.page = 1
    },

    pageStateOptions(value) {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${value.filter}&page=${value.page}`
      )
    }
  }
}
</script>

<style scoped>
.Container {
   display: flex;
   flex-direction: column;
   justify-content: center;
   padding: 3rem;
 }
 .TickersContainer {
   display: flex;
   flex-direction: column;
   align-items: center;
   margin-bottom: 2rem;
 }
 .Tickers {
   display: flex;
   flex-direction: row;
   margin-bottom: 2rem;
 }
 .Ticker {
   display: flex;
   flex-direction: column;
   align-items: center;
   margin: 1rem;
   padding: 1rem;
   border: 1px solid lightskyblue;
   border-radius: 10px;
 }
 .TickerData {
   text-align: center;
   margin-bottom: 0.8rem
 }
 .SelectedTicker {
   font-weight: bold
 }
</style>
