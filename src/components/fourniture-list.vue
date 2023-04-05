


<template>
  <div>
    <product-form></product-form>
  </div>
  <div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Type</th>
          <th>Nombre</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.type }}</td>
          <td>{{ product.nombre }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'

import ProductForm from './components/ajoutFourniture.vue'


export default {
  name: 'ProductList',
  components: {
    ProductForm
  },
  data() {
    return {
      products: []
    }
  },
  created() {
    axios.get('/api/fourniture').then(response => {
      this.products = response.data
    })
  }
}
</script>
