<template>

  <div class="row">
    <div class="col-md-4 mb-2">
      <a class="btn btn-primary" href="./ajout" role="button"> <i class="fa fa-plus" aria-hidden="true"></i>
        Personnel</a>
    </div>
  </div>
  <div class="row d-flex justify-content-end">

    <div class="col-md-4">
      <input type="text" class="form-control" v-model="nom" placeholder="Chercher par nom" />
    </div>
  </div>

  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Prénom</th>
          <th>C.I.N</th>
          <th>Email</th>
          <th>Telephone</th>
          <th>Numéro de bureau</th>
          <th>Grade</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="personnel in filteredPersonnels" :key="personnel.id">
          <th>{{ personnel.id }}</th>
          <td>{{ personnel.nom }}</td>
          <td>{{ personnel.prenom }}</td>
          <td>{{ personnel.cin }}</td>
          <td>{{ personnel.email }}</td>
          <td>{{ personnel.telephone }}</td>
          <td>{{ personnel.numBureau }}</td>
          <td>{{ personnel.grade }}</td>
          <td> <button class="btn btn-danger btn-sm" @click="deleteItem(personnel.id)"><i
                class="fa fa-trash"></i></button></td>
        </tr>
      </tbody>
    </table>
    <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'PersonneltList',

  data() {
    return {
      personnels: [],
      nom: ''
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
          try {
            axios.delete(`/api/personnel/id/${id}`).then(response => {
              if (response.status == 200) {
                this.personnels.splice(this.personnels.findIndex(item => item.id === id), 1) //enlever le personnel de la liste d'affichage apres la suppression
                Swal.fire(
                  'Bien Supprimé!',
                  'Enregistrement supprimé.',
                  'success'
                )
              }
            }

            )
          } catch (error) {
            console.error(error)
          }
        }
      })

    }
  },
  computed: {
    filteredPersonnels() { // pour filtrer les personnels par nom
      return this.personnels.filter(personnel =>
        personnel.nom && personnel.nom.toLowerCase().includes(this.nom.toLowerCase())
      )
    },
  },
  created() {
    axios.get('/api/personnel').then(response => {
      this.personnels = response.data
    })
  }
}
</script>
