/* eslint-disable no-unused-vars */
import axios from "axios";
import router from "@/router/index";

// Modulo donde manejo las alertas
import showAlert from "@/utils/alerts";

export default {
  state: {
    teachers: [],
  },
  mutations: {
    setTeachers(state, teachers){
      state.teachers = teachers;
    }
  },
  actions: {
    async getTeachers({rootState, commit}) {
      await axios({
        method: "get",
        url: rootState.API_URL + `/group-user?group=${rootState.group.id_group}&type=teacher`,
        headers: rootState.headers,
      })
        .then((res) => {
          console.log(res);
          if (Array.isArray(res.data)) {
            commit("setTeachers", res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
