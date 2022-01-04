<template>
  <body>
    <div>
      <label for="wallet">Тикер {{ ticker }}</label>
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
        :key="t"
      >
        <div>
          <div>{{ t.name }} - USD</div>
          <div>{{ t.price }}</div>
        </div>
        <button @click="handleDelete(t)">Удалить</button>
      </div>

      <hr />
    </template>


  </body>
</template>

<script>
export default {
  name: 'App',

  data() {
    return {
      ticker: 'default',
      tickers: [
        { name: 'DEMO1', price: '0' },
        { name: 'DEMO2', price: '0' },
        { name: 'DEMO3', price: '0' }
      ]
    }
  },

  methods: {
    add() {
      const newTicker = {
        name: this.ticker,
        price: "0"
      }

      this.tickers.push(newTicker)
      this.ticker=""
    },

    handleDelete(tickerToRemove) {
      this.tickers = this.tickers.filter(t => t !== tickerToRemove)
    }
  }
}
</script>

<style></style>
