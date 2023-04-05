<template>

  <user v-if="!this.isChef" />
  <chef  v-if="this.isChef" />

</template>



<script>
import chef from './indexChef.vue';
import user from './indexUser.vue';

export default {
  data() {
    return {
      isChef : (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).chef : null
    }
  },
  components: {
    chef,
    user
  }
}
</script>
