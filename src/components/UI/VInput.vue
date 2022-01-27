<template>
    <input
        :value="modelValue"
        @input="updateInput"
        class="Input"
        type="text"
    >
</template>

<script>
export default {
    name: 'v-input',

    props: {
        modelValue: [String, Number]
    },

    methods: {
        updateInput(event) {
            this.$emit('update:modelValue', event.target.value)
        }
    }
}
</script>

<style scoped>
.Input {
   min-height: 20px;
   outline: none;
   border-radius: 5px;
   border: 1px solid lightgray
 }
 
 .Input:focus {
   border: 1px solid lightskyblue
 }
</style>
