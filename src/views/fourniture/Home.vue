


<template>
  <div class="row">
    <div class="col-md-4 mb-4">
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        <i class="fa fa-plus"></i> Nouvelle fourniture
      </button>
    </div>
  </div>
  <div class="row d-flex justify-content-end">

    <div class="col-md-4 mb-3">
      <input type="text" class="form-control" v-model="typeFourniture" placeholder="Chercher une fourniture" />
    </div>
  </div>
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Type</th>
          <th>Nombre</th>
          <th>Supprimer</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="fourniture in filteredForniture" :key="fourniture.id">
          <th>{{ fourniture.id }}</th>
          <td>{{ fourniture.type }}</td>
          <td>{{ fourniture.nombre }}</td>
          <td> <button class="btn btn-danger btn-sm" @click="deleteItem(fourniture.id)"><i
                class="fa fa-trash"></i></button></td>
        </tr>
      </tbody>
    </table>
  </div>


  <!-- Début Modal d'ajout -->

  <div id="exampleModal" class="modal fade">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Ajout Materiel</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="ajoute" class="alert alert-success" role="alert">
            Fourniture ajoutée avec succès
          </div>
          <form @submit.prevent="submitForm">
            <div class="form-group">

              <label>
                Type:
              </label>
              <input required type="text" v-model="form.type" class="form-control" />
            </div>
            <div class="form-group">

              <label>
                Nombre:
              </label>
              <input required type="number" v-model="form.nombre" class="form-control" />
            </div>
            <button type="submit" class="btn btn-primary mt-3">Ajouter</button>&nbsp;
            <button type="button" class="btn btn-secondary mt-3" data-bs-dismiss="modal">Fermer</button>
          </form>
        </div>
      </div>
    </div>
  </div>
  <!-- Fin Modal d'ajout -->





</template>





<script>
import axios from 'axios'

export default {
  name: 'ProductList',

  data() {
    return {
      form: {
      },
      fournitures: [],
      ajoute: false,
      typeFourniture :''
    }
  },
  methods: {
    async deleteItem(id) {

      // pour afficher la fenetre de confirmaion (Sweet alert)
      Swal.fire({
        title: 'Attention?',
        text: "Avez vous sûr de poursuivre la suppression!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Supprimer!',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(`/api/fourniture/id/${id}`).then(response => {
            if (response.status == 200 && response.data == "Supprimer avec succes") {
              Swal.fire(
                'Bien Supprimé!',
                'Enregistrement supprimé.',
                'success'
              );
            }
            if (response.status == 200 && response.data == "Impossible de supprimer la fournirure") {

              Swal.fire(
                'Attention!',
                'Fournirure déja demandé',
                'warning'
              )
            }

          }).catch(function () {  //en cas d'erreur de suppression
            Swal.fire(
              'Attention!',
              'Enregistrement existe déja dans une demande',
              'warning'
            )
          })
        }
      })

    },
    getDemande() {
      axios.get('/api/fourniture').then(response => {
        this.fournitures = response.data
      })
    },
    submitForm() {
      axios.post('/api/fourniture', this.form).then(response => {
        if (response.status == 200) {
          this.getDemande();
          this.ajoute = true,
            setTimeout(() => {
              this.ajoute = false
            }, 3000)
        }
      })
    }
  },
  
  computed: {
    filteredForniture() { // pour filtrer les fornitures
      return this.fournitures.filter(fourniture =>
        fourniture.type && fourniture.type.toLowerCase().includes(this.typeFourniture.toLowerCase())
      )
    },
  },
  created() {
    this.getDemande();
  }
}
</script>
