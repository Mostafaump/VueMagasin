<template>

    <button type="button" class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#exampleModal">
        <i class="fa fa-plus"></i> Demande de materiels
    </button>


    <div class="row">
        <div v-cloak v-if="myDemandeMaterielEmpty" class="warning text-center" >
            <h3 class="mt-5">Aucune demande n'est disponible</h3>
        </div>
        <div class="accordion accordion-flush" id="accordionFlushExample">
            <div class="accordion-item" v-for="item in this.myDemandeMateriel">
                <h2 class="accordion-header" :id="'flush-headingM' + item.id">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        :data-bs-target="'#flush-collapse' + item.id" aria-expanded="false"
                        :aria-controls="'flush-collapse' + item.id">
                        Demande de matériel Réfèrence : {{ item.id }}
                        <div style="position: absolute; right: 50px;">
                            <span v-if="item.accepte == null" class="badge text-bg-info">En cours</span>
                            <span v-if="item.accepte == true" class="badge text-bg-success">Acceptée</span>
                            <span v-if="item.accepte == false" class="badge text-bg-danger">Rejetée</span>
                        </div>
                    </button>
                </h2>
                <div :id="'flush-collapse' + item.id" class="accordion-collapse collapse"
                    :aria-labelledby="'flush-headingM' + item.id" data-bs-parent="#accordionFlushExample">
                    <div class="accordion-body">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Numéro d'inventaire</th>
                                    <th>Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="unit in item.demandeMateriel">
                                    <th>{{ unit.id }}</th>
                                    <th>{{ unit.materiel.numInventaire }}</th>
                                    <td>{{ unit.materiel.type }}</td>
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
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Demande materiels</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <form id="material-form" @submit.prevent="submitForm">

                        <div class="row">
                            <div class="col">
                                <div class="form-group mb-2">

                                    <label> Materiel : </label>
                                    <select v-model="selectedId" id="materiel" class="form-control">
                                        <option v-for="materiel in materiels" v-bind:value="materiel.id"
                                            :value="materiel.id">
                                            {{ materiel.type }} - {{ materiel.numInventaire }}
                                        </option>
                                    </select>
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
                                <th>Type</th>
                                <th>Action</th>
                            </tr>
                            <tr v-for="item, index in demandemateriels">
                                <td>
                                    {{ item.materiel.id }}
                                </td>
                                <td>
                                    {{ item.type }} - {{ item.numInventaire }}
                                </td>
                                <td>
                                    <button @click="removemateriel(index)" class="btn btn-light btn-sm text-danger"
                                        type="button"><i class="fa fa-trash"></i></button>
                                </td>
                            </tr>
                        </table>


                        <!-- <button type="submit" class="btn btn-primary mt-3">Valider</button> -->
                    </form>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                    <button form="material-form" type="submit" class="btn btn-primary"
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
                // id:null,
                type: 'materiel',
                accepte: null,
            },
            personnel: JSON.parse(localStorage.getItem('user')),
            materiels: [],
            demandemateriels: [],
            myDemandeMateriel: [],
            selectedId: null
        }
    },
    methods: {
        submitForm() {
            var sendData = {
                type: this.form.type,
                personnel: JSON.parse(localStorage.getItem('user')),
                dateCreation: null,
                demandeMateriel: this.demandemateriels
            };
            axios.post('/api/demande', sendData).then(response => {
                this.fetchData();
            })
        },
        async fetchData() {
            try {
                const responsemateriel = await axios.get('/api/materiel');
                this.materiels = responsemateriel.data.filter(item => item.affecterPers == null);

                const responseDemandeMateriel = await axios.get('/api/demande/personnel/' + this.personnel.id);
                this.myDemandeMateriel = responseDemandeMateriel.data.filter(item => item.type === 'materiel');


            } catch (error) {
                console.error(error);
            }
        },
        addRow() {
            // var materiels = this.materiels;

            // Rechercher un element de la liste a partir de son id            
            const element = this.materiels.find(el => el.id == this.selectedId);
            //Remplir la liste
            this.demandemateriels.push({ materiel: { id: this.selectedId }, type: element.type });

            //initialiser les champs de fourmulaire
            this.form.quantite = null;
            this.selectedId = null;

        },
        removemateriel(index) {
            this.demandemateriels.splice(index, 1);
        }
    },
    computed: {
        myDemandeMaterielEmpty() {
            return this.myDemandeMateriel.length == 0 || this.myDemandeMateriel == null;
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