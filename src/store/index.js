import { createStore } from "vuex";

/* Modulos */
import auth from "./modules/auth";
import chatRooms from "./modules/chatRooms";
import user from "./modules/user";
import teachers from "./modules/teachers";
import consultations from "./modules/consultations";
import group from "./modules/group";

import env_vars from "@/static/env_vars.json";

export default createStore({
  modules: {
    auth,
    chatRooms,
    user,
    teachers,
    consultations,
    group
  },
  state: {
    //API_URL: process.env.VUE_APP_ROOT_API /* || "http://localhost:8080" */,
    API_URL: env_vars.VUE_APP_ROOT_API || "http://localhost:8080",
    WS_URL: env_vars.VUE_APP_ROOT_WS || "ws://localhost:3000",
    token: null,
    headers: {
      Authorization: "",
      "Content-Type": "application/json",
    },
    text_filter: "",
    lang: "es",
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload;
    },
    setHeaderToken(state, payload) {
      state.headers.Authorization = payload;
    },
    setText(state, payload) {
      state.text_filter = payload;
    },
    setLang(state,lang){
      state.lang = lang;
    },
  },
  actions: {
    searcher({ commit }, payload) {
      commit("setText", payload.toLowerCase());
    },
  },
  getters: {
    subjectsFiltered(state) {
      let subjectsFiltered = [];
      state.subjects.forEach((subject) => {
        let name = subject.name.toLowerCase();
        if (name.indexOf(state.text_filter) >= 0) {
          subjectsFiltered.push(subject);
        }
      });
      return subjectsFiltered;
    },
  },
});
