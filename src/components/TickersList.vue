<template>
  <div class="Tickers">
    <TickerItem
      v-for="ticker in tickers"
      :key="ticker.name"
      :ticker="ticker"
      :selectedTicker="selectedTicker"
      @remove="$emit('remove', ticker)"
      @select="$emit('select', ticker)"
    />
  </div>
</template>

<script>
import TickerItem from "./TickerItem"

export default {
    components: {
        TickerItem
    },

    props: {
        tickers: {
            type: Array,
            required: true
        },
        selectedTicker: {
            type: Object,
            default: null
        }
    },
    
}
</script>

<style scoped>
 .Tickers {
   display: flex;
   flex-direction: row;
   margin-bottom: 2rem;
 }
</style>
