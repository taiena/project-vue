<template>
  <div class="Filter">
    <div>Filter: </div>

    <v-input
      v-model="filter"
      @input="$emit('filtration', filter)"
    />

    <v-button 
      v-if="page > 1"
      @click="$emit('prevPage')"
      title="Prev"
      :secondaryStyle="true"
    />

    <v-button 
      v-if="hasNextPage"
      @click="$emit('nextPage')"
      title="Next"
      :secondaryStyle="true"
    />

  </div>
</template>

<script>

export default {
  name: 'Filter',
 
  props: {
    page: {
      type: Number,
      required: true,
    },
    hasNextPage: {
      type: Boolean,
      required: true,
    }
  },

  emits: [
    "filtration",
    "prevPage",
    "nextPage"
  ],

  data() {
    return {
      filter: ""
    }
  },
}
</script>

<style scoped>
 .Filter {
   display: flex;
   flex-direction: row;
   margin-bottom: 2rem;
 }
</style>

