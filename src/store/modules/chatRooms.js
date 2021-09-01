/* eslint-disable no-unused-vars */
import axios from "axios";

// Modulo donde manejo las alertas
import showAlert from "@/utils/alerts";

export default {
  state: {
    chats: [],
    user_subjects: []
  },
  mutations: {
    setChats(state, chats) {
      state.chats = chats;
    },
    setUserSubjects(state, subjects){
      state.user_subjects = subjects;
    }
  },
  actions: {
    async getChatRooms({ rootState, commit }) {
      await axios({
        method: "get",
        url: rootState.API_URL + "/chat",
        headers: rootState.headers,
      })
        .then((res) => {
          console.log(res);
          // Si res.data no es "OK" significa que la sesion expiró o el token esta mal o no hay token
          if (Array.isArray(res.data)) {
            // LLamo a la funcion logout
            commit("setChats", res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async createChatRoom({ rootState, commit }) {
      await axios({
        method: "post",
        url: rootState.API_URL + "/chat",
        headers: rootState.headers,
      })
        .then((res) => {
          console.log(res);
          // Si res.data no es "OK" significa que la sesion expiró o el token esta mal o no hay token
          if (Array.isArray(res.data)) {
            // LLamo a la funcion logout
            commit("setChats", res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
