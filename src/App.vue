<template>
  <body>
    <div>
      <label for="wallet">Тикер</label>
      <input
        v-model="ticker"
        v-on:keydown.enter="add"
        type="text"
        name="wallet"
        id="wallet"
        placeholder="Например DOGE"
      />
      <button
        @click="add"
        type="button"
      >Добавить</button>
    </div>

    <template v-if="tickers.length">
      <hr />

      <div
        v-for="t in tickers"
        :key="t.name"
        @click="handleSelect(t)">
        <div>
          <div
            :class="select === t ? 'SelectedName' : ''"
          >
            {{ t.name }} - USD
          </div>
          <div 
            :class="{
              'SelectedPrice': select === t
            }"
          >
            {{ t.price }}
          </div>
        </div>
        <button @click.stop="handleDelete(t)">Удалить</button>
      </div>

      <hr />
    </template>

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

  methods: {
    add() {
      const newTicker = {
        name: this.ticker,
        price: "0"
      }

      this.tickers.push(newTicker)

      if (this.tickers.length) {
        setInterval(async () => {

         const f = await fetch(
          `https://min-api.cryptocompare.com/data/price?fsym=${newTicker.name}&tsyms=USD&api_key=${key}`
         )

         const data = await f.json()

         this.tickers.find(t => t.name === newTicker.name).price =
          data.USD > 1 ? data.USD.toFixed(2) : data.USD.toPrecision(2)

         if (this.select?.name === newTicker.name) {
          this.graph.push(data.USD)
         }
        }, 3000)
      }

      this.ticker=""
    },

    handleSelect(ticker) {
      this.select = ticker
      this.graph = []
    },

    handleDelete(tickerToRemove) {
      this.tickers = this.tickers.filter(t => t !== tickerToRemove)
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
 .SelectedName {
   background-color: lightcyan
 }
 .SelectedPrice {
   font-weight: bold
 }
 .Graph {
   display: flex;
   flex-direction: row;
   width: 700px;
   height: 700px;
 }
 .Bar {
   background-color: lightskyblue;
   border: 1px solid blue;
   width: 10px;
 }
</style>
