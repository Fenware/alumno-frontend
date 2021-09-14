import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Configuration from "../views/Configuration.vue";
import Consultation from "../views/Consultation.vue";
import ChatRooms from "../views/ChatRooms.vue";
import Teachers from "../views/Teachers.vue";

const routes = [
  { path: "/", redirect: "/inicio" },
  {
    path: "/registro",
    name: "Register",
    component: Register,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/inicio",
    name: "Home",
    component: Home,
    meta: { requireAuth: true },
  },
  {
    path: "/consulta/:id",
    name: "Consultation",
    component: Consultation,
    meta: { requireAuth: true },
  },
  {
    path: "/salas-de-chat",
    name: "ChatRooms",
    component: ChatRooms,
    meta: { requireAuth: true },
  },
  {
    path: "/profesores",
    name: "Teachers",
    component: Teachers,
    meta: { requireAuth: true },
  },
  {
    path: "/configuracion",
    name: "Configuration",
    component: Configuration,
    meta: { requireAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const routeProtected = to.matched.some((record) => record.meta.requireAuth);
  // Verificando la session en cada ruta
  store.dispatch("syncToken");
  if (routeProtected) {
    store.dispatch("checkSession").then(() => {
      if (store.state.token !== null) {
        next();
      }
    });
  } else if (to.fullPath == "/login" || to.fullPath == "/registro") {
    if (store.state.token !== null) {
      next({ name: "Home" });
    } else {
      next();
    }
  }
});

export default router;
