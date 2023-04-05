
<template>


    <MenuChef v-if="this.isChef" />
    <Menu v-if="this.isChef==false" />

  <main :style="{'min-height': result + 'px'}" :class="{'container mt-5' : this.isChef !=null}">
      <router-view />      
  </main>

  <!-- <footer v-if="isChef!=null" class="bg-primary fixed-bottom mt-4"> -->
  <footer v-if="isChef!=null" class="bg-primary mt-4">
    <div class="container">
      <div class="row">
        <div class="col-12 text-center">
          <p class="text-white p-4 m-0">Copyright © 2022. Tous les droits sont réservés.</p>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
import Menu from './views/menu.vue';
import MenuChef from './views/menuchef.vue';

export default {
  data() {
    return {
      isChef : (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).chef : null
    }
  },
  components: {
    Menu,
    MenuChef
  },
  computed:{
    result() {
      return window.innerHeight-210;
    }
  }
}
</script>
<style>
a.active{
    color: rgb(20, 20, 20);

}

</style>