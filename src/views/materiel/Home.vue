


<template>
  <div class="row">
    <div class="col-md-4 mb-4">
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        <i class="fa fa-plus"></i> Nouveau matériel
      </button>
    </div>
  </div>
  <div class="row d-flex justify-content-end">

    <div class="col-md-4 mb-3">
      <input type="text" class="form-control" v-model="typeMateriel" placeholder="Chercher un matériel" />
    </div>
  </div>
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Numéro d'inventaire</th>
          <th>Type</th>
          <th>Date d'acquisition</th>
          <th>Affecter à</th>
          <th>Date d'affectation</th>
          <th>Supprimer</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="materiel in filteredMateriel" :key="materiel.id">
          <th>{{ materiel.id }}</th>
          <td>{{ materiel.numInventaire }}</td>
          <td>{{ materiel.type }}</td>
          <td>{{ formattedDate(materiel.dateAcquisition) }}</td>
          <td>{{ materiel.affecterPers }}</td>
          <td>{{ formattedDate(materiel.dateAffectation) }}</td>
          <td> <button class="btn btn-danger btn-sm" @click="deleteItem(materiel.id)"><i
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

          <form @submit.prevent="submitForm">
            <div v-if="ajoute" class="alert alert-success" role="alert">
              Materiel ajouté avec succès
            </div>
            <div class="form-group">

              <label>
                Numéro d'inventaire:
              </label>
              <input required @input="validateInventaire" type="text" v-model="form.numInventaire" class="form-control "
                :class="{ 'is-invalid':inventaireError!='' }"
                aria-describedby="inputGroupPrepend3 validationServerInventaireFeedback" />
              <div v-if="inventaireError" id="validationServerInventaireFeedback" class="invalid-feedback">
                {{ inventaireError }}
              </div>

              <!-- <input type="text" v-model="form.numInventaire" class="form-control" required /> -->
            </div>
            <div class="form-group">
              <label>
                Type :
              </label>
              <input type="text" v-model="form.type" class="form-control" required />
            </div>
            <div class="form-group">
              <label>
                Date d'acquisition :
              </label>
              <input type="date" v-model="form.dateAcquisition" class="form-control" required />
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
  name: 'MaterielLList',

  data() {
    return {
      materiels: [],
      form: {
        numInventaire: '',
        type: '',
        dateAcquisition: '',
        affecterPers: null,
        dateAffectation: ''
      },
      typeMateriel: '',
      inventaireList: [],
      inventaireError: '',
      ajoute: false
    }
  },
  methods: {
    async deleteItem(id) {

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
            axios.delete(`/api/materiel/id/${id}`).then(response => {
              if (response.status == 200 && response.data == "Supprimer avec succes") {
                this.materiels.splice(this.materiels.findIndex(item => item.id === id), 1)
                Swal.fire(
                  'Bien Supprimé!',
                  'Matériel supprimé.',
                  'success'
                );
              }
              if (response.status == 200 && response.data == "Impossible de supprimer le materiel") {

                Swal.fire(
                  'Attention!',
                  'Matériel est à la proprieté d\'une personne',
                  'warning'
                )
              }

            })
          }
          catch (error) {
            console.error(error)
          }
        }
      })
    },
    getMateriel() { //Récuperer tous les materiels

      axios.get('/api/materiel').then(response => {
        this.materiels = response.data
      })
    },
    getMaterielInventaire() { //Récuperer tous les materiels

      axios.get('/api/materiel/inventaire/list').then(response => {
        this.inventaireList = response.data
      })
    },
    validateInventaire() {
      if (this.inventaireList.includes(this.form.numInventaire)) {
        this.inventaireError = 'Ce Numéro d\'inventaire existe déja.';
      } else {
        this.inventaireError = '';
      }
    },
    submitForm() {
      if (this.inventaireError == '') {
      axios.post('/api/materiel', this.form).then(response => {
        if (response.status == 200) {
          this.getMateriel();
          this.inventaireList.push(this.form.numInventaire);
          this.form.numInventaire = '';
          this.form.type = '';
          this.form.dateAcquisition = '';
          this.ajoute = true,
            setTimeout(() => {
              this.ajoute = false
            }, 3000)
        }
      })
    }
    },
    formattedDate(date) { //Pour convertir la date au format dd/mm/yyyy
      if (date == null) {
        return null;
      }
      date = new Date(date);
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }
      return new Intl.DateTimeFormat('en-GB', options).format(date)
    }
  },
  computed: {
    filteredMateriel() { // pour filtrer les matériels pour la recherche par type
      return this.materiels.filter(materiel =>
        materiel.type && materiel.type.toLowerCase().includes(this.typeMateriel.toLowerCase())
      )
    },
  },
  created() {
    this.getMateriel();
    this.getMaterielInventaire();
  }
}
</script>
