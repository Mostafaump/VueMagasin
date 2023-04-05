<template>


  <!-- Début d'espace des cadres -->


  <div class="row">
    <h1 class="h2 mb-3">Tableau de board Utilisateur</h1>
    <div class="col-6">
      <div class="card text-bg-primary mb-3">
        <div class="card-header"><i class="fa fa-user" aria-hidden="true"></i> Demandes fournitures</div>
        <div class="card-body">
          <h5 class="card-title">Nombre des demandes Fournitures : <b>{{ this.demandesFornitures.length }}</b> </h5>
          <p class="card-text">Vous pouvez consulter vos demandes fournitures en cliquant <router-link
              to="/demande_fourniture/ajout" style="color: white;"><b>ici</b></router-link>.</p>
        </div>
      </div>
    </div>
    <div class="col-6">
      <div class="card text-bg-secondary mb-3">
        <div class="card-header"><i class="fa fa-gavel" aria-hidden="true"></i> Demandes matériels</div>
        <div class="card-body">
          <h5 class="card-title">Nombre des demandes matériels : <b>{{ this.demandesMateriels.length }}</b></h5>
          <p class="card-text">Vous pouvez consulter vos demandes matériels en cliquant <router-link to="demande_materiel/ajout"
              style="color: black;"><b>ici</b></router-link>.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Fin d'espace des cadres -->





</template>

<script>

import axios from 'axios'
import jsPDF from 'jspdf'; //Bibliothèque pour importer la liste des matériels affectés affectés en format PDF
import 'jspdf-autotable';  //Bibliothèque pour importer la liste des matériels affectés affectés en format PDF
import Papa from 'papaparse'; //Bibliothèque pour importer la liste des matériels affectés affectés en format CSV

export default {
  name: 'ProductForm',
  data() {
    return {
      form: {
        numInventaire: '',
        type: '',
        dateAcquisition: '',
        affecterPers: null,
        dateAffectation: ''
      },
      cePersonnel: JSON.parse(localStorage.getItem('user')),
      demandesFornitures: [],
      demandesMateriels: [],
      ajoute: false
    }
  },
  methods: {
    formattedDate(date) { // pour formatter la date
      date = new Date(date);
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }
      return new Intl.DateTimeFormat('en-GB', options).format(date)
    }

    // },
    // computed: {
    //   listToExport() {
    //     return this.materielsAffectes.map(row => [row.id, row.numInventaire, row.type, row.affecterPers, this.formattedDate(row.dateAffectation)])
    //   }


    // 
  },
  created() {

    {
      axios.get('/api/demande/personnel/' + this.cePersonnel.id).then(response => {
        if (response.status == 200) {
          this.demandesFornitures = response.data.filter(item => item.type == "fourniture");
          this.demandesMateriels = response.data.filter(item => item.type == "materiel");
        }
      })

    }
  }
}
</script>
