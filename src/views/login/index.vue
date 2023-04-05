<template>

<!-- Login 5 start -->
<div class="login-5">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <div class="form-section">
                    <div class="form-inner">
                        <a href="login-5.html" class="logo">
                            <img src="../../images/logo.svg" class="logo-img " alt="logo">
                            <br/>
                            <img src="../../images/title.svg" class="logo-title" alt="logo">
                        </a>
                        <form @submit.prevent="submitForm">
                          <div v-if="this.errorLogin" class="alert alert-warning" role="alert">Coordonnées invalides</div>
                            <div class="form-group form-box clearfix">
                                <input name="cin" v-model="form.cin" type="text" class="form-control" placeholder="C.I.N" aria-label="C.I.N">
                                <i class="fa fa-user"></i>
                            </div>
                            <div class="form-group form-box clearfix">
                                <input name="password" v-model="form.motDePasse" type="password" class="form-control" autocomplete="off" placeholder="Password" aria-label="Password">
                                <i class="fa fa-lock"></i>
                            </div>
                            
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary btn-lg btn-theme"><span>Se connecter</span></button>
                            </div>
                            <div class="extra-login form-group clearfix">
                                <span>UMP - FSO</span>
                            </div>
                        </form>
                       
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Login 5 end -->

</template>

<script>
import axios from 'axios'
export default {
  name: 'LoginForm',
  data() {
    return {
      form: {
        cin: '',
        motDePasse: ''
      },
      errorLogin: false
    }
  },
  props: ['isChef'],
  methods: {
    submitForm() {
      axios.post('/api/personnel/login', this.form).then(response => {
        if (response.status == 200 && response.data != "") {
          localStorage.setItem('user', JSON.stringify(response.data));
          // this.$emit('update:isChef', JSON.parse(localStorage.getItem('user')).chef);
          this.errorLogin = false;
            location.href="/index";
            // this.$router.push({ name: 'index' });
          
        }
        else {
          this.errorLogin = true;
        }
      });
    }
  }
}
</script>