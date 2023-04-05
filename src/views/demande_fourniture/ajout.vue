<template>

    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        <i class="fa fa-plus"></i> Demande de fournitures
    </button>

    <div class="row">
        <div class="warning text-center" v-if="myDemandeFournitureEmpty">
            <h3 class="mt-5">Aucune demande n'est disponible</h3>
        </div>

        <div class="accordion accordion-flush" id="accordionFlushExample">
            <div class="accordion-item" v-for="item in this.myDemandeFourniture">
                <h2 class="accordion-header" :id="'flush-heading' + item.id">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        :data-bs-target="'#flush-collapse' + item.id" aria-expanded="false"
                        :aria-controls="'flush-collapse' + item.id">
                        Demande de fourniture Réfèrence : {{ item.id }}

                        <div style="position: absolute; right: 50px;">
                            <span v-if="item.accepte == null" class="badge text-bg-info">En cours</span>
                            <span v-if="item.accepte == true" class="badge text-bg-success">Acceptée</span>
                            <span v-if="item.accepte == false" class="badge text-bg-danger">Rejetée</span>
                        </div>
                    </button>
                </h2>
                <div :id="'flush-collapse' + item.id" class="accordion-collapse collapse"
                    :aria-labelledby="'flush-heading' + item.id" data-bs-parent="#accordionFlushExample">
                    <div class="accordion-body">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Type</th>
                                    <th>Quantite</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="unit in item.demandeFourniture">
                                    <th>{{ unit.id }}</th>
                                    <td>{{ unit.fourniture.type }}</td>
                                    <td>{{ unit.quantite }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>

    </div>


    <!-- Début Modal d'ajout -->

    <div id="exampleModal" class="modal fade">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Demande fournitures</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <form id="fourniture-form" @submit.prevent="submitForm">

                        <div class="row">
                            <div class="col">
                                <div class="form-group mb-2">

                                    <label> Fourniture : </label>
                                    <select v-model="selectedId" id="fourniture" class="form-control">
                                        <option v-for="fourniture in fournitures" v-bind:value="fourniture.id"
                                            :value="fourniture.id">
                                            {{ fourniture.type }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col">

                                <div class="form-group">
                                    <label> Quantité : </label>
                                    <input type="number" v-model="form.quantite" class="form-control" min="0" />
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group">

                                    <label> Action </label>
                                    <br />
                                    <button @click="addRow()" class="btn btn-primary btn-sm " type="button"><i
                                            class="fa fa-plus"></i></button>
                                </div>
                            </div>

                        </div>

                        <table class="table">
                            <tr>
                                <th>#</th>
                                <th>Fourniture</th>
                                <th>Quantite</th>
                                <th>Action</th>
                            </tr>
                            <tr v-for="item, index in demandeFournitures">
                                <td>
                                    {{ item.fourniture.id }}
                                </td>
                                <td>
                                    {{ item.type }}
                                </td>
                                <td>
                                    {{ item.quantite }}
                                </td>
                                <td>
                                    <button @click="removeFourniture(index)" class="btn btn-light btn-sm text-danger"
                                        type="button"><i class="fa fa-trash"></i></button>
                                </td>
                            </tr>
                        </table>


                        <!-- <button type="submit" class="btn btn-primary mt-3">Valider</button> -->
                    </form>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                    <button form="fourniture-form" type="submit" class="btn btn-primary"
                        data-bs-dismiss="modal">Enregistrer</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Fin Modal d'ajout -->
</template>
  
<script>
import axios from 'axios'

export default {
    name: 'ProductForm',
    data() {
        return {
            form: {
                id: null,
                type: 'fourniture',
                quantite: '1',
                personnel: JSON.parse(localStorage.getItem('user')),
                dateCreation: null //new Date().toString()
            },
            fournitures: [],
            demandeFournitures: [],
            myDemandeFourniture: [],
            selectedId: null
        }
    },
    methods: {
        submitForm() {
            var sendData = {
                type: 'fourniture',
                quantite: this.form.quantite,
                personnel: this.form.personnel,
                dateCreation: null, //new Date().toString()
                demandeFourniture: this.demandeFournitures
            };
            // axios.post('/api/demande', {"demande":this.form, "demandeFourniture":this.demandeFournitures}).then(response => {
            axios.post('/api/demande', sendData).then(response => {
                this.fetchData();

            })
            this.demandeFournitures = null;

        },
        async fetchData() {
            try {
                const responseFourniture = await axios.get('/api/fourniture');
                this.fournitures = responseFourniture.data.filter(item => item.nombre > 0);

                const responseMyDemandeFourniture = await axios.get('/api/demande/personnel/' + this.form.personnel.id);
                this.myDemandeFourniture = responseMyDemandeFourniture.data.filter(item => item.type === 'fourniture');
            } catch (error) {
                console.error(error);
            }
        },
        addRow() {
            // var fournitures = this.fournitures;

            // Rechercher un element de la liste a partir de son id            
            const element = this.fournitures.find(el => el.id == this.selectedId);
            if (element != null) {
                this.demandeFournitures.push({ fourniture: { id: this.selectedId }, type: element.type, quantite: this.form.quantite });

                //initialiser les champs de fourmulaire
                this.form.quantite = null;
                this.selectedId = null;
            }
            //Remplir la liste

        },
        removeFourniture(index) {
            this.demandeFournitures.splice(index, 1);
        }
    },
    computed: {
        myDemandeFournitureEmpty() {
            return this.myDemandeFourniture.length == 0 || this.myDemandeFourniture == null;
        }
    },
    created() {
        this.fetchData();
    },
}

</script>
<style>
/* Prevenir l'affichage du message au depart */
[v-cloak] { display: none; }
</style>