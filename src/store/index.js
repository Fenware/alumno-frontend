import { createStore } from "vuex";
import router from "@/router/index";
import axios from "axios";

export default createStore({
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
    consultations: [],
    user: {
      id: null,
      ci: null,
      nickname: "",
      name: "",
      middle_name: "",
      surname: "",
      second_surname: "",
      email: "",
      avatar: "01-man.svg",
      type: "teacher",
    },
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
    setUserData(state, user) {
      state.user["id"] = user.id;
      state.user["ci"] = user.ci;
      state.user["name"] = user.name;
      state.user["nickname"] = user.nickname;
      state.user["name"] = user.name;
      state.user["middle_name"] = user.middle_name;
      state.user["surname"] = user.surname;
      state.user["second_surname"] = user.second_surname;
      state.user["email"] = user.email;
      state.user["avatar"] = user.avatar != null ? user.avatar : "01-man.svg";
    },
    clearUserData(state) {
      state.user["id"] = null;
      state.user["ci"] = null;
      state.user["name"] = "";
      state.user["nickname"] = "";
      state.user["name"] = "";
      state.user["middle_name"] = "";
      state.user["surname"] = "";
      state.user["second_surname"] = "";
      state.user["email"] = "";
    },
    setGroup(state, group) {
      state.group = group;
    },
    setUserSubjects(state, subjects) {
      state.subjects = subjects;
    },
    setConsultations(state, consultations) {
      state.consultations = consultations;
    },
    addConsultation(state, consultation) {
      state.consultations.push(consultation);
    },
    setConsultation(state, consultation) {
      state.consultation = consultation;
    },
    removeConsultation(state, id_consultation) {
      state.consultations.forEach((consultation, index) => {
        if (parseInt(consultation.id) == id_consultation) {
          state.consultations.splice(index, 1);
        }
      });
    },
    setNewMessage(state, message){
      state.new_message = message;
    },
    toogleNewMessageMode(state) {
      state.new_message_mode = !state.new_message_mode;
    },
    setConsultationBody(state, body) {
      state.consultation.body = body;
    },
    setConsultationMessages(state, messages) {
      state.consultation.messages = messages;
    },
  },
  actions: {
    searcher({ commit }, payload) {
      commit("setText", payload.toLowerCase());
    },
    syncToken({ commit }) {
      if (localStorage.getItem("token")) {
        commit("setToken", localStorage.getItem("token"));
        commit("setHeaderToken", "Bearer " + localStorage.getItem("token"));
      } else {
        commit("setToken", null);
        router.push("login");
      }
    },
    async login({ commit, state }, payload) {
      await axios({
        method: "post",
        url: state.API_URL + "/auth",
        data: payload,
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          if ("token" in res.data.result) {
            let token = res.data.result.token;
            commit("setToken", token);
            localStorage.setItem("token", token);
            router.push("/inicio");
          } else {
            console.log("Error: login");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    logout({ commit }) {
      commit("setToken", null);
      commit("clearUserData");
      localStorage.removeItem("token");
      router.push("login");
    },
    async checkSession({ commit, state }) {
      await axios({
        method: "post",
        url: state.API_URL + "/token",
        data: {},
        headers: state.headers,
      })
        .then((res) => {
          console.log(res);
          if (res.data != "OK") {
            commit("setToken", null);
            localStorage.removeItem("token");
            router.push("login");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getUserGroup({ state, dispatch, commit }) {
      await axios({
        method: "get",
        url: state.API_URL + "/user-grupo",
        headers: state.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            commit("setGroup", res.data[0]);
            if (state.subjects == null) {
              dispatch("getUserSubjects");
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getUserSubjects({ state, commit }) {
      await axios({
        method: "get",
        url:
          state.API_URL +
          `/orientacion-materia?id=${state.group.id_orientation}`,
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
    async syncConsultations({ state, commit }) {
      await axios({
        method: "get",
        url: state.API_URL + "/consulta",
        headers: state.headers,
      })
        .then((res) => {
          console.log(res.data);
          if (Array.isArray(res.data) && res.data.length > 0) {
            commit("setConsultations", res.data);
          } else {
            console.log("Error: syncConsultations ->" + res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async sendConsultationMessage(
      { state, dispatch, commit },
      id_consultation
    ) {
      let data = {
        consulta: id_consultation,
        msg: state.new_message,
      };
      await axios({
        method: "post",
        url: state.API_URL + "/consulta-mensaje",
        data: data,
        headers: state.headers,
      })
        .then((res) => {
          commit("toogleNewMessageMode");
          if (res.data == 1) {
            dispatch(
              "getConsultationMessages",
              parseInt(state.consultation.id)
            );
          } else {
            alert(res.data.result.error_msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getConsultationMessages({ state, commit }, id) {
      let data = `consulta=${id}`;
      await axios({
        method: "get",
        url: state.API_URL + `/consulta-mensaje?${data}`,
        headers: state.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            commit("setConsultationBody", res.data[0].content);
            res.data.splice(0, 1);
            commit("setConsultationMessages", res.data);
          } else {
            console.log("Error: getConsultationMessages ->" + res.data);
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
    /* getGroups(state){
      return state.groups;
    } */
  },
});
