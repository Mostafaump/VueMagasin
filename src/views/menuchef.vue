<template>
    <nav id="menu" class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">

            <router-link to="/login" class="navbar-brand"> <img src="/src/images/logo.svg" width="30" height="30"
                    class="d-inline-block align-top me-2" alt="">MAG-INFO </router-link>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">

                <ul  class="navbar-nav mr-auto">
                    <li class="nav-item active"><router-link to="/index" class="nav-link"><i class="fa fa-dashboard"
                                aria-hidden="true"></i> Dashborad</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/personnel/list" class="nav-link"><i class="fa fa-user-circle" aria-hidden="true"></i> Personnels</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/materiel/list" class="nav-link"><i class="fa fa-gavel" aria-hidden="true"></i> Materiels</router-link>
                    </li>
                    <li class="nav-item active"><router-link to="/fourniture/list"
                            class="nav-link"><i class="fa fa-eyedropper" aria-hidden="true"></i> Fournitures</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link v-if="this.user" to="/demandes/liste" class="nav-link"><i class="fa fa-file-text-o" aria-hidden="true"></i> Liste des demandes</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/demandes/gerer" class="nav-link"><i class="fa fa-tasks" aria-hidden="true"></i> Gérer des demandes</router-link>
                    </li>
                </ul>
            </div>
            <a href="/personnel/profil" class="btn btn-dark btn-sm me-1"><i class="fa fa-user" aria-hidden="true"></i>
                Compte</a>
            <a @click="logOut" class="btn btn-secondary btn-sm"><i class="fa fa-sign-out" aria-hidden="true"></i> Déconnexion</a>
        </div>
    </nav>
</template>

<script>

export default {
    data() {
        return {
            user: null,
        }
    },
    methods:{
        logOut(){
            localStorage.removeItem('user');
            location.href="/login";
        }
    },
    created() {

        if (localStorage.getItem('user')) {
            this.user = JSON.parse(localStorage.getItem('user'));
        }
        else {
            this.user = null;
        }
    }
}
</script>
