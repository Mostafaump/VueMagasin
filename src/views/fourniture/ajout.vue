<template>

  <div v-if="ajoute" class="alert alert-success" role="alert">
   Fourniture ajoutée avec succès
  </div>

  <form @submit.prevent="submitForm">
    <div class="form-group">

      <label>
        Type:
      </label>
      <input type="text" v-model="form.type" class="form-control" />
    </div>
    <div class="form-group">

      <label>
        Nombre:
      </label>
      <input type="number" v-model="form.nombre" class="form-control" />
    </div>
    <button type="submit" class="btn btn-primary mt-3">Ajouter</button>

  </form>
</template>
  
<script>
import axios from 'axios'

export default {
  name: 'ProductForm',
  data() {
    return {
      form: {
      },      
    ajoute:false
    }
  },
  methods: {
    submitForm() {
      axios.post('/api/fourniture', this.form).then(response => {
        if (response.status == 200) {
          this.ajoute=true,
          setTimeout(() => {
            this.ajoute = false
          }, 3000)
        }
      })
    }
  }
}
</script>