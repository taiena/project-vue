<template>
  <div 
    :class="[
              'Ticker', 
              {'SelectedTicker': selectedTicker === ticker}
            ]"
    @click="$emit('select', ticker)"
  >
  
    <div  class="TickerData">
      <div>
        {{ ticker.name }} - USD
      </div>

      <div>
        {{ formatPrice(ticker.price) }}
      </div>
    </div>

    <v-button
      @click.stop="$emit('remove', ticker)"
      title="Удалить"
      :secondaryStyle="true"
    />
  </div>
</template>

<script>
export default {

    props: {
        ticker: {
            type: Object,
            required: true
        },

        selectedTicker: {
            type: Object,
            default: null
        }
    },

    methods: {
      formatPrice(price) {
        if (price === "0") {
          return price
        }
        return price > 1 ? price.toFixed(2) : price.toPrecision(2)
      },
    }
}
</script>

<style scoped>
 .Ticker {
   display: flex;
   flex-direction: column;
   align-items: center;
   margin: 1rem;
   padding: 1rem;
   border: 1px solid lightskyblue;
   border-radius: 10px;
 }
 .Ticker:hover {
   cursor: pointer;
 }
 .TickerData {
   text-align: center;
   margin-bottom: 0.8rem
 }
 .SelectedTicker {
   background-color: lightcyan;
 }
</style>
