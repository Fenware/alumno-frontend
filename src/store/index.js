import { createStore } from "vuex";
import axios from "axios";

/* Modulos */
import auth from "./modules/auth";
import chatRooms from "./modules/chatRooms";
import userProfile from "./modules/userProfile";
import teachers from "./modules/teachers";

export default createStore({
  modules:{
    auth,
    chatRooms,
    userProfile,
    teachers
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
    consultations: [],
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
    setNewMessage(state, message) {
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
    async getUserGroup({ state, dispatch, commit }) {
      await axios({
        method: "get",
        url: state.API_URL + "/user-grupo",
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
          console.log(res);
          commit("toogleNewMessageMode");
          if (!("result" in res.data)) {
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
