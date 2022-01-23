<template>
  <div>
    <div>{{ tickerName }}</div>
      <div class="Graph" ref="graph">
        <div
          v-for="(bar, idx) in normalizedGraph"
          :key="idx"
          :style="{ height: `${bar}%` }"
          class="Bar"
        ></div>
      </div>
  </div>
</template>

<script>

export default {
  name: 'Graph',

  props: {
    tickerName: {
      type: String,
      required: true
    },

    tickerPrice: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      graph: [],
      maxGraphElements: 1
    }
  },

  mounted() {
    window.addEventListener("resize", this.calculateMaxGraphElements)
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.calculateMaxGraphElements)
  },

  computed: {
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

  methods: {
    calculateMaxGraphElements() {
       if (!this.$refs.graph) {
         return
       }
       this.maxGraphElements = this.$refs.graph.clientWidth / 21 // Bar width + margin
    }
  },

  watch: {
    tickerPrice() {
      this.calculateMaxGraphElements()
      this.graph.push(this.tickerPrice)
      while (this.graph.length > this.maxGraphElements) {
        this.graph.shift()
      }
    },

    tickerName() {
      this.graph = []
    },
  }

}
</script>

<style scoped>
.Graph {
   display: flex;
   flex-direction: row;
   align-items: flex-end;
   height: 300px;
   padding: 1rem;
   border: 1px solid lightskyblue;
   border-radius: 10px;
 }
 .Bar {
   background-color: lightskyblue;
   width: 20px;
   margin: 1px;
 }
</style>

