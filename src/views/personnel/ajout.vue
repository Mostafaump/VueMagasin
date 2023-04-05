<template>
  <form @submit.prevent="submitForm" >
    <div v-if="ajoute" class="alert alert-success" role="alert">
      Personne ajoutée avec succès
    </div>
    <div class="form-check">
      <input class="form-check-input" checked required type="radio" @click="noAdmin()" v-model="this.form.status"
        value="Technicien" id="flexRadioDefault1">
      <label class="form-check-label" for="flexRadioDefault1">
        Technicien
      </label>
    </div>
    <div class="form-check">
      <input class="form-check-input" required type="radio" v-model="this.form.status" value="Enseignant"
        id="flexRadioDefault2">
      <label class="form-check-label" for="flexRadioDefault2">
        Enseignant
      </label>
    </div>
    <div class="form-check form-switch" v-if="this.form.status == 'Enseignant'">
      <input class="form-check-input" v-model="form.chef" type="checkbox" role="switch" id="flexSwitchCheckDefault">
      <label class="form-check-label" for="flexSwitchCheckDefault">Est un administrateur</label>
    </div>


    <div class="form-group">

      <label>
        Nom :
      </label>
      <input required type="text" v-model="form.nom" class="form-control" />
    </div>
    <div class="form-group">

      <label>
        Prénom :
      </label>
      <input required type="text" v-model="form.prenom" class="form-control" />
    </div>
    <div class="form-group">

      <label>
        C.I.N :
      </label>
      <!-- <input type="text" class="form-control is-invalid" id="validationServerCin" aria-describedby="inputGroupPrepend3 validationServerCinFeedback" required>
      <div id="validationServerCinFeedback" class="invalid-feedback">
        Please choose a Cin.
      </div> -->


      <input required @input="validateCin" type="text" v-model="form.cin" class="form-control " :class="{'is-invalid':cinError!=''}"
        aria-describedby="inputGroupPrepend3 validationServerCinFeedback" />
      <div v-if="cinError" id="validationServerCinFeedback" class="invalid-feedback">
        {{ cinError }}
      </div>
      
    </div>
    <div class="form-group">

      <label>
        Email :
      </label>
      <input type="email" v-model="form.email" class="form-control" />
    </div>
    <div class="form-group">

      <label>
        Telephone :
      </label>
      <input type="number" v-model="form.telephone" class="form-control" />
    </div>
    <div class="form-group">

      <label>
        Numéro de bureau :
      </label>
      <input type="text" v-model="form.numBureau" class="form-control" />
    </div>
    <div class="form-group mb-2" v-if="this.form.status == 'Technicien'">

      <label> Grade : </label>
      <select v-model="form.grade" id="fourniture" class="form-control">
        <option v-for="item in gradesTechnicien" v-bind:value="item" :value="item">
          {{ item }}
        </option>
      </select>
    </div>
    <div class="form-group mb-2" v-if="this.form.status == 'Enseignant'">

      <label> Grade : </label>
      <select v-model="form.grade" id="fourniture" class="form-control">
        <option v-for="item in gradesEnseignant" v-bind:value="item" :value="item">
          {{ item }}
        </option>
      </select>
    </div>

    <div class="form-group">

      <label>
        Mot de passe :
      </label>
      <input required type="password" v-model="form.motDePasse" class="form-control" />
    </div>
    <button v-if="this.form.status == null || this.form.cin == null" disabled
      class="btn btn-primary mt-3">Ajouter</button>
    <button v-if="this.form.status != null && this.form.cin != null" type="submit"
      class="btn btn-primary mt-3">Ajouter</button>
  </form>
</template>
  
<script>
import axios from 'axios'

export default {
  name: 'PersonnelForm',
  data() {
    return {
      form: {
        nom: '',
        prenom: '',
        cin: '',
        email: '',
        telephone: '',
        numBureau: '',
        grade: '',
        motDePasse: '',
        chef: false,
        status: 'Technicien'
      },
      ajoute: false,
      gradesTechnicien: ["Technicien 1er grade", "Technicien 2eme grade", "Technicien 3eme grade", "Technicien 4eme grade"],
      gradesEnseignant: ["PA", "PH", "PES"],
      cinError: ''

    }
  },
  methods: {
    submitForm() {
      if (this.cinError == '') {
        axios.post('/api/personnel', this.form).then(response => {
          this.ajoute = true,
            setTimeout(() => {
              this.ajoute = false
            }, 3000);

        })
      }
    },
    noAdmin() {
      this.form.chef = false;
    },
    validateCin() {
      if (this.CinList.includes(this.form.cin)) {
        this.cinError = 'Ce C.I.N existe déja.';
      } else {
        this.cinError = '';
      }
    }
  },
  created() {
    axios.get('/api/personnel/cin').then(response => {
      this.CinList = response.data
    })
  }
}
</script>