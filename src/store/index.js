import { createStore } from "vuex";
import axios from "axios";

/* Modulos */
import auth from "./modules/auth";
import chatRooms from "./modules/chatRooms";
import userProfile from "./modules/userProfile";
import teachers from "./modules/teachers";
import consultations from "./modules/consultations";

export default createStore({
  modules: {
    auth,
    chatRooms,
    userProfile,
    teachers,
    consultations,
  },
  state: {
    API_URL: process.env.VUE_APP_ROOT_API,
    group: null,
    subjects: null,
    consultation: {
      creation_date: "Esperando datos",
      group_name: "Esperando datos",
      id: "Esperando datos",
      state: "1",
      subject_name: "Esperando datos",
      teacher_name: "Esperando datos",
      theme: "Esperando datos",
      body: "Esperando datos",
      messages: [],
    },
    new_message: "",
    new_message_mode: false,
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
    setGroup(state, group) {
      state.group = group;
    },
    setUserSubjects(state, subjects) {
      state.subjects = subjects;
    },
  },
  actions: {
    searcher({ commit }, payload) {
      commit("setText", payload.toLowerCase());
    },
    async getUserGroup({ state, dispatch, commit }) {
      await axios({
        method: "post",
        url: state.API_URL + "/user-group/getGroups",
        headers: state.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data)) {
            commit("setGroup", res.data[0]);
            if (state.subjects == null) {
              dispatch("getUserSubjects");
            }
            /* dispatch("wsChatRoomsConnection"); */
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getUserSubjects({ state, commit }) {
      let data = {
        group: parseInt(state.group.id_group),
      };
      await axios({
        method: "post",
        url: state.API_URL + `/user-group/getGroupSubjects`,
        data,
        headers: state.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            commit("setUserSubjects", res.data);
          }
        })  
        .catch((error) => {
          console.log(error);
        });
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
