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

    <Button 
      @click="add"
      title="Добавить"
      :primaryStyle="true"
    />
  </div>
</template>

<script>

import Button from './Button.vue'

export default {
  name: 'AddTicker',

  components: {
    Button
  },

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

