import axios from "axios";

export default {
  state: {
    group: null,
    subjects: null,
  },
  mutations: {
    setGroup(state, group) {
      state.group = group;
    },
    setUserSubjects(state, subjects) {
      state.subjects = subjects;
    },
  },
  actions: {
    async getUserGroup({ state, rootState, dispatch, commit }) {
      await axios({
        method: "post",
        url: rootState.API_URL + "/user-group/getGroups",
        headers: rootState.headers,
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
    async getUserSubjects({ state, rootState, commit }) {
      let data = {
        group: parseInt(state.group.id_group),
      };
      await axios({
        method: "post",
        url: rootState.API_URL + `/user-group/getGroupSubjects`,
        data,
        headers: rootState.headers,
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
};
