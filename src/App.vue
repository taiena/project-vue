<template>
  <body class="Container">
    <div class="InputContainer">
      <label for="wallet">Тикер</label>
      <input
        v-model="ticker"
        v-on:keydown.enter="add"
        type="text"
        name="wallet"
        id="wallet"
        placeholder="Например DOGE"
        class="Input"
      />
      <button
        @click="add"
        type="button"
      >Добавить</button>
    </div>

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
              {{ t.price }}
            </div>
          </div>
          <button @click.stop="handleDelete(t)">Удалить</button>
        </div>
      </div>
    </div>

    <section v-if="selectedTicker">
      <div>{{ selectedTicker.name }}</div>
      <div class="Graph">
        <div
          v-for="(bar, idx) in normalizedGraph"
          :key="idx"
          :style="{ height: `${bar}%` }"
          class="Bar"
        ></div>
      </div>
      
    </section>

  </body>
</template>

<script>
import { loadTicker } from './api.js'
export default {
  name: 'App',

  // data should not contain properties
  // whose values can be calculated based on the current state
  data() {
    return {
      ticker: null,
      tickers: [],
      selectedTicker: null,
      graph: [],
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
        this.subscribeToUpdates(ticker.name)
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

    normalizedGraph() {
      const maxValue = Math.max(...this.graph)
      const minValue = Math.min(...this.graph)

      if (maxValue === minValue) {
        return this.graph.map(() => 50)
      }

      return this.graph.map(
        price => 5 + ((price - minValue) * 95) / (maxValue - minValue)
      )
    }
  },

  // there should be no dependencies in methods
  methods: {
    add() {
      const newTicker = {
        name: this.ticker,
        price: "0"
      }

      this.tickers = [...this.tickers, newTicker]
      this.filter = ""
      
      this.subscribeToUpdates(newTicker.name)
      this.ticker=""
    },

    subscribeToUpdates(tickerName) {
      console.log("subscribeToUpdates")
      setInterval(async () => {
        console.log("tickers length: ", this.tickers.length)
        console.log("tickers: ", this.tickers)
        console.log("tickerName: ", tickerName)
          
        if (this.tickers.length !== 0) {
          console.log("FETCH")

          const cryptoData = await loadTicker(tickerName)

          this.tickers.find(t => t.name === tickerName).price =
            cryptoData.USD > 1 ?
            cryptoData.USD.toFixed(2) :
            cryptoData.USD.toPrecision(2)

          if (this.selectedTicker?.name === tickerName) {
            this.graph.push(cryptoData.USD)
          }
        }
      }, 7000)
    },

    handleSelect(ticker) {
      this.selectedTicker = ticker
    },

    handleDelete(tickerToRemove) {
      this.tickers = this.tickers.filter(t => t !== tickerToRemove)

      if (this.selectedTicker == tickerToRemove) {
        this.selectedTicker = null
      }
    }
  },

  watch: {
    tickers() {
      console.log("watch tickers: ", this.tickers)
      localStorage.setItem("crypto-list", JSON.stringify(this.tickers))
    },

    selectedTicker() {
      this.graph = []
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
   align-items: center;
   padding: 2rem;
 }
 .InputContainer {
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   margin-bottom: 2rem;
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
 .Input {
   min-height: 20px;
   margin: 0.8rem;
   outline: none;
   border-radius: 5px;
   border: 1px solid lightgray
 }
 .Input:focus {
   border: 1px solid lightskyblue
 }
 .SelectedTicker {
   font-weight: bold
 }
 .Graph {
   display: flex;
   flex-direction: row;
   width: 700px;
   height: 300px;
   padding: 1rem;
   border: 1px solid lightskyblue;
   border-radius: 10px;
 }
 .Bar {
   background-color: lightskyblue;
   border: 1px solid blue;
   width: 10px;
 }
 
</style>
