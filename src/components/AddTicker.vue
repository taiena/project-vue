<template>
  <div class="InputContainer">
    <label for="wallet">Тикер</label>

    <v-input
      v-model="ticker"
      v-on:keydown.enter="add"
      name="wallet"
      id="wallet"
      placeholder="Например DOGE"
    />

    <v-button 
      @click="add"
      title="Добавить"
      :disabled="disabled"
      :primaryStyle="true"
    />
  </div>
</template>

<script>

export default {
  name: 'AddTicker',

  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  emits: {
    "add-ticker": value => typeof value === "string" && value.length > 0
  },

  data() {
    return {
      ticker: null,
    }
  },

  methods: {
    add() {
      if (this.ticker.length === 0) {
        return
      }
      this.$emit('add-ticker', this.ticker)
      this.ticker = "" // need to fix
    }
  }
}
</script>

<style scoped>
 .InputContainer {
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   margin-bottom: 2rem;
 }

</style>

