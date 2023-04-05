<template>


    <div v-if="modifie" class="alert alert-success alert-dismissible fade show" role="alert">
        Mis à jour effectué avec <strong>succès</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    <form @submit.prevent="submitForm">
        <table class="table table-striped">
            <tr>
                <th>
                    Nom :
                </th>
                <td>
                    <input type="hidden" v-model="form.id" />
                    <input type="text" v-model="form.nom" class="form-control" />
                </td>
            </tr>
            <tr>
                <th>
                    Prénom :
                </th>
                <td>
                    <input type="text" v-model="form.prenom" class="form-control" />
                </td>
            </tr>
            <tr>
                <th>
                    C.I.N :
                </th>
                <td>
                    <input type="text" v-model="form.cin" class="form-control" />
                </td>
            </tr>
            <tr>
                <th>
                    Email :
                </th>
                <td>
                    <input type="email" v-model="form.email" class="form-control" />
                </td>
            </tr>
            <tr>
                <th>
                    Telephone :
                </th>
                <td>
                    <input type="tel" v-model="form.telephone" class="form-control" />
                </td>
            </tr>
            <tr>
                <th>
                    Numéro de bureau :
                </th>
                <td>
                    <input type="text" v-model="form.numBureau" class="form-control" />
                </td>
            </tr>
            <tr>
                <th>
                    Grade :
                </th>
                <td v-if="this.form.status == 'Technicien'">
                    <select v-model="form.grade" id="fourniture" class="form-control">
                        <option v-for="item in gradesTechnicien" v-bind:value="item" :value="item">
                            {{ item }}
                        </option>
                    </select>
                </td>
                <td v-if="this.form.status == 'Enseignant'">

                    <select v-model="form.grade" id="fourniture" class="form-control">
                        <option v-for="item in gradesEnseignant" v-bind:value="item" :value="item">
                            {{ item }}
                        </option>
                    </select>
                </td>
            </tr>
            <tr>
                <th>
                    Mot de passe :
                </th>
                <td>
                    <input type="password" v-model="form.motDePasse" class="form-control" />
                </td>
            </tr>

        </table>
        <button type="submit" class="btn btn-primary">Modifier</button>
    </form>

</template>

<script>
import axios from 'axios'

export default {
    name: 'PersonnelForm',
    data() {
        return {
            form: {
                id: '',
                nom: '',
                prenom: '',
                cin: '',
                email: '',
                telephone: '',
                numBureau: '',
                grade: '',
                status: 'Technicien'
            },
            modifie: false,
            gradesTechnicien: ["Technicien 1er grade", "Technicien 2eme grade", "Technicien 3eme grade", "Technicien 4eme grade"],
            gradesEnseignant: ["PA", "PH", "PES"]
        }
    },
    methods: {
        submitForm() {
            axios.put('/api/personnel/id/' + this.form.id, this.form).then(response => {
                if (response.status == 200) {
                    this.modifie = true;
                        setTimeout(() => {
                            this.modifie = false
                        }, 3000)
                }
            })
        }
    },
    created() {
        var idPersonnel = JSON.parse(localStorage.getItem('user')).id;
        axios.get("/api/personnel/id/"+idPersonnel).then(response => {
            this.form = response.data
        })
    }
}
</script>