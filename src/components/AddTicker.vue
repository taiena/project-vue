<template>
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
    >
      Добавить
    </button>
  </div>
</template>

<script>

export default {
  name: 'AddTicker',

  data() {
    return {
      ticker: null,
    }
  },

  methods: {
    add() {
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
</style>

