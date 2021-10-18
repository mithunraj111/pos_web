<template>
  <add-product />
</template>

<script lang="ts">
  import Vue from 'vue'
  import AddProduct from '../components/addProduct.vue'

  export default Vue.extend({
    name: 'Home',

    components: {
      AddProduct,
    },
  })
</script>
