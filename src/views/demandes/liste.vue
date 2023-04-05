<template>



    <div class="row">

        <h2>Demandes</h2>

        <div class="accordion accordion-flush" id="accordionFlushExample">
            <div class="accordion-item" v-for="item in this.demandesFourniture">
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
                                    <th>Type</th>
                                    <th>Quantite</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="unit in item.demandeFourniture">
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
    <div class="row text-center" v-if="this.demandeVide">
        <h4>Aucune demande pour le moment</h4>
        
    </div>
    <div class="row">
        <div class="accordion accordion-flush" id="accordionFlushExample">
            <div class="accordion-item" v-for="item in this.demandesMateriel">
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
                                    <th>Numéro d'inventaire</th>
                                    <th>Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="unit in item.demandeMateriel">
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

</template>


<script>
import axios from 'axios'

export default {
    name: 'DemandesForm',
    data() {
        return {
            demandes: [],
            demandesFourniture: [],
            demandesMateriel: [],
            demandeVide:false
        }
    },
    methods: {
        valider(id) {
            axios.post('/api/demande/accepter/' + id).then(response => {
                // Traitez la réponse du serveur ici
                this.fetchData();
            });

        },
        async fetchData() {
            try {
                const responseFourniture = await axios.get('/api/demande');
                this.demandes = responseFourniture.data;
                this.demandesFourniture = this.demandes.filter(item => item.type === 'fourniture');
                console.log(this.demandesFourniture);
                this.demandesMateriel = this.demandes.filter(item => item.type === 'materiel');
                this.demandeVide=(this.demandesFourniture.length==0 && this.demandesMateriel.length==0);
            } catch (error) {
                console.error(error);
            }
        }
    },
    created() {
        this.fetchData();
    },
}

</script>