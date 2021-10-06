/* eslint-disable no-unused-vars */
import axios from "axios";
import router from "@/router/index";

// Modulo donde manejo las alertas
import { showAlert } from "@/utils/alerts";

export default {
  state: {
    teachers: [],
  },
  mutations: {
    setTeachers(state, teachers) {
      state.teachers = teachers;
    },
  },
  actions: {
    async getTeachers({ rootState, commit }) {
      let data = { group: parseInt(rootState.group.group.id_group) };
      await axios({
        method: "post",
        url: rootState.API_URL + `/group/getTeachersFromGroup`,
        data,
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
