import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/fourniture/ajout.vue'



function isLogin() {
  var user = JSON.parse(localStorage.getItem('user'));

  if (user) {

    if (user.chef == true) {
      return "chef";
    }
    else if (user.chef == false) {
      return "nonchef";
    }
  }
  return null;
}

export default createRouter({
  history: createWebHistory(),
  linkActiveClass:'active',
  routes: [
    {
      path: '/fourniture/ajout',
      component: Home,
      beforeEnter: (route, _, next) => {
        if (isLogin() == "chef") {
          next();
        } else if (isLogin() == "nonchef") {
          next({ path: '/erreur' });
        } else {
          next({ path: '/login' });
        }
      },
    },
    {
      name: 'index',
      path: '/index',
      component: () => import('./views/dashboard/index.vue'),
      beforeEnter: (route, _, next) => {
        if (isLogin()) {
          next();
        } else {
          next({ path: '/login' });
        }
      },
    },
    {
      path: '/login',
      component: () => import('./views/login/index.vue'),
      beforeEnter: (route, _, next) => {
        if (isLogin()) {
          next({ path: '/index' });
        }
        else {
          next();
        }
      },
    },
    {
      path: '/',
      component: () => import('./views/login/index.vue'),
      beforeEnter: (route, _, next) => {
        next({ path: '/index' });
      }
    },

    {
      path: '/fourniture/list',
      component: () => import('./views/fourniture/Home.vue'),
      beforeEnter: (route, _, next) => {
        if (isLogin() == "chef") {
          next();
        } else if (isLogin() == "nonchef") {
          next({ path: '/erreur' });
        } else {
          next({ path: '/login' });
        }
      },
    },
    {
      path: '/materiel/list',
      component: () => import('./views/materiel/Home.vue'),
      beforeEnter: (route, _, next) => {
        if (isLogin() == "chef") {
          next();
        } else if (isLogin() == "nonchef") {
          next({ path: '/erreur' });
        } else {
          next({ path: '/login' });
        }
      },
    }
    ,
    {
      path: '/personnel/ajout',
      component: () => import('./views/personnel/ajout.vue'),
      beforeEnter: (route, _, next) => {
        if (isLogin() == "chef") {
          next();
        } else if (isLogin() == "nonchef") {
          next({ path: '/erreur' });
        } else {
          next({ path: '/login' });
        }
      },
    },
    {
      path: '/personnel/list',
      component: () => import('./views/personnel/Home.vue'),
      beforeEnter: (route, _, next) => {
        if (isLogin() == "chef") {
          next();
        } else if (isLogin() == "nonchef") {
          next({ path: '/erreur' });
        } else {
          next({ path: '/login' });
        }
      },
    },
    {

      path: '/personnel/profil',
      component: () => import('./views/personnel/profil.vue'),
      beforeEnter: (route, _, next) => {
        if (isLogin()) {
          next();
        } else {
          next({ path: '/login' });
        }
      },
    },
    {
      path: '/demande_fourniture/ajout',
      component: () => import('./views/demande_fourniture/ajout.vue'),
      beforeEnter: (route, _, next) => {
        if (isLogin() == "nonchef") {
          next();
        } else if (isLogin() == "chef") {
          next({ path: '/erreur' });
        } else {
          next({ path: '/login' });
        }
      },
    },
    {
      path: '/demande_materiel/ajout',
      component: () => import('./views/demande_materiel/ajout.vue'),
      beforeEnter: (route, _, next) => {
        if (isLogin() == "nonchef") {
          next();
        } else if (isLogin() == "chef") {
          next({ path: '/erreur' });
        } else {
          next({ path: '/login' });
        }
      },
    },
    {
      path: '/demandes/gerer',
      component: () => import('./views/demandes/gerer.vue'),
      beforeEnter: (route, _, next) => {
        if (isLogin() == "chef") {
          next();
        } else if (isLogin() == "nonchef") {
          next({ path: '/erreur' });
        } else {
          next({ path: '/login' });
        }
      },
    },
    {
      path: '/demandes/liste',
      component: () => import('./views/demandes/liste.vue'),
      beforeEnter: (route, _, next) => {
        if (isLogin() == "chef") {
          next();
        } else if (isLogin() == "nonchef") {
          next({ path: '/erreur' });
        } else {
          next({ path: '/login' });
        }
      },
    },
    {
      path: '/erreur',
      component: () => import('./views/erreur.vue'),
      beforeEnter: (route, _, next) => {
        if (isLogin() == "chef" || isLogin() == "nonchef" ) {
          next();
        } else {
          next({ path: '/login' });
        }
      },
    }
  ],
})