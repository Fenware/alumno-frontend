import { createStore } from "vuex";

/* Modulos */
import auth from "./modules/auth";
import chatRooms from "./modules/chatRooms";
import userProfile from "./modules/userProfile";
import teachers from "./modules/teachers";
import consultations from "./modules/consultations";
import group from "./modules/group";

export default createStore({
  modules: {
    auth,
    chatRooms,
    userProfile,
    teachers,
    consultations,
    group
  },
  state: {
    API_URL: process.env.VUE_APP_ROOT_API,
    token: null,
    headers: {
      Authorization: "",
      "Content-Type": "application/json",
    },
    text_filter: "",
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
