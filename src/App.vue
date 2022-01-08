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
      <div
        v-for="t in tickers"
        :key="t.name"
        @click="handleSelect(t)"
        class="Ticker">
        <div  class="TickerData">
          <div
            :class="select === t ? 'SelectedTicker' : ''"
          >
            {{ t.name }} - USD
          </div>
          <div 
            :class="{
              'SelectedTicker': select === t
            }"
          >
            {{ t.price }}
          </div>
        </div>
        <button @click.stop="handleDelete(t)">Удалить</button>
      </div>
    </div>

    <section v-if="select">
      <div>{{ select.name }}</div>
      <div class="Graph">
        <div
          v-for="(bar, idx) in normalizeGraph()"
          :key="idx"
          :style="{ height: `${bar}%` }"
          class="Bar"
        ></div>
      </div>
      
    </section>


  </body>
</template>

<script>
import { key } from './apikey.js'
export default {
  name: 'App',

  data() {
    return {
      ticker: null,
      tickers: [],
      select: null,
      graph: []
    }
  },

  created() {
    const tickersData = localStorage.getItem("crypto-list")
    if (tickersData) {
      this.tickers = JSON.parse(tickersData)
      this.tickers.forEach(ticker => {
        this.subscribeToUpdates(ticker.name)
      })
    }
  },

  methods: {
    add() {
      const newTicker = {
        name: this.ticker,
        price: "0"
      }

      this.tickers.push(newTicker)

      localStorage.setItem("crypto-list", JSON.stringify(this.tickers))

      this.subscribeToUpdates(newTicker.name)

      this.ticker=""
    },

    subscribeToUpdates(tickerName) {
      if (this.tickers.length) {
        setInterval(async () => {

         const f = await fetch(
          `https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD&api_key=${key}`
         )

         const data = await f.json()

         this.tickers.find(t => t.name === tickerName).price =
          data.USD > 1 ? data.USD.toFixed(2) : data.USD.toPrecision(2)

         if (this.select?.name === tickerName) {
          this.graph.push(data.USD)
         }
        }, 3000)
      }
    },

    handleSelect(ticker) {
      this.select = ticker
      this.graph = []
    },

    handleDelete(tickerToRemove) {
      this.tickers = this.tickers.filter(t => t !== tickerToRemove)
      localStorage.setItem("crypto-list", JSON.stringify(this.tickers))
      if (this.select == tickerToRemove) {
        this.select = null
      }
    },

    normalizeGraph() {
      const maxValue = Math.max(...this.graph)
      const minValue = Math.min(...this.graph)
      return this.graph.map(
        price => 5 + ((price - minValue) * 95) / (maxValue - minValue)
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
