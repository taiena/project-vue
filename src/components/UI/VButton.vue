<template>
  <div
    class="Button"
    :class="classNames"
  >
    <span>{{ title }}</span>
  </div>
</template>

<script>

export default {
  name: 'v-button',

  props: {
    title: {
      type: String,
      default: "Press"
    },

    disabled: {
      type: Boolean,
      default: false
    },

    primaryStyle: {
      type: Boolean,
      default: false
    },

    secondaryStyle: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {}
  },

  computed: {
    classNames() {
      return {
        "ButtonDisabled" : this.disabled,
        "ButtonPrimary" : this.primaryStyle,
        "ButtonSecondary" : this.secondaryStyle
      }
    }
  }
}
</script>

<style scoped>
  .Button {
    border-radius: 5px;
    padding: 8px 18px;
    font-size: 18px
  }
  .Button:hover {
    cursor: pointer;
  }
  .ButtonDisabled {
    pointer-events: none;
  }
  .ButtonPrimary {
    color:  white;
    background-color: lightskyblue;
  }
  .ButtonPrimary:hover {
    background-color: lightblue;
  }
  .ButtonSecondary {
    color:  lightskyblue;
    background-color: white;
    border: 1px solid lightskyblue
  }
  .ButtonSecondary:hover {
    color:  lightblue;
    border: 1px solid lightblue
  }
</style>
