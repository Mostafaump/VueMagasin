<template>
    <form @submit.prevent="submitForm">
      <label>
        Type:
        <input type="text" v-model="form.type" />
      </label>
      <br />
      <label>
        Nombre:
        <input type="number" v-model="form.nombre" />
      </label>
      <br />
      <button type="submit">Ajouter</button>
    </form>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    name: 'ProductForm',
    data () {
      return {
        form: {
          type: '',
          nombre: 0
        }
      }
    },
    methods: {
      submitForm () {
        axios.post('/api/fourniture', this.form).then(response => {
          // Traitez la réponse du serveur ici
        })
      }
    }
  }
  </script>
  