/* eslint-disable no-unused-vars */
import axios from "axios";
// Modulo donde manejo las alertas
import { showAlert } from "@/utils/alerts";

export default {
  state: {
    consultation: {
      active: false,
      creation_date: "Esperando datos",
      group_name: "Esperando datos",
      id: "Esperando datos",
      state: 1,
      subject_name: "Esperando datos",
      teacher_name: "Esperando datos",
      theme: "Esperando datos asunto",
      body: "Esperando datos descripción",
      messages: [],
    },
    newMessage: null,
    new_message_mode: false,
    consultations: [],
  },
  mutations: {
    setConsultations(state, consultations) {
      state.consultations = consultations;
    },
    pushConsultation(state, consultation) {
      state.consultations.push(consultation);
    },
    setConsultation(state, consultation) {
      state.consultation = consultation;
      state.consultation.active = true;
    },
    removeConsultation(state, id_consultation) {
      state.consultations.forEach((consultation, index) => {
        if (parseInt(consultation.id) == id_consultation) {
          state.consultations.splice(index, 1);
        }
      });
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
    setConsultationStateAnswered(state, id) {
      state.consultations.forEach((consultation) => {
        if (parseInt(consultation.id) == parseInt(id)) {
          consultation.state = 2;
        }
      });
    },
    pushConsultationMessage(state, message) {
      state.consultation.messages.push(message);
    },
    clearConsultation(state) {
      state.consultation = {
        active: false,
        creation_date: "Esperando datos",
        group_name: "Esperando datos",
        id: "Esperando datos",
        state: 1,
        subject_name: "Esperando datos",
        teacher_name: "Esperando datos",
        theme: "Esperando datos asunto",
        body: "Esperando datos descripción",
        messages: [],
      };
    },
    setNewMessage(state, message){
      state.newMessage = message;
    }
  },
  actions: {
    async getConsultations({ rootState, commit }) {
      await axios({
        method: "post",
        url: rootState.API_URL + "/consultation/getActiveConsultations",
        headers: rootState.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data)) {
            commit("setConsultations", res.data);
          } else {
            console.log("Error: syncConsultations ->" + res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getConsultation({ rootState, commit, dispatch }, id) {
      let data = { consulta: parseInt(id) };
      await axios({
        method: "post",
        url: rootState.API_URL + `/consultation/getConsultationById`,
        data,
        headers: rootState.headers,
      })
        .then((res) => {
          if (!("result" in res.data)) {
            res.data.messages = [];
            res.data.state = parseInt(res.data.state);
            commit("setConsultation", res.data);
            dispatch("getConsultationMessages", id);
          } else {
            console.log("Error: getConsultation ->" + res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async sendConsultationMessage({ state, rootState, commit }, payload) {
      let data = {
        consulta: parseInt(payload),
        msg: state.newMessage,
      };
      await axios({
        method: "post",
        url: rootState.API_URL + "/consultation/postMessage",
        data: data,
        headers: rootState.headers,
      })
        .then((res) => {
          commit("toogleNewMessageMode");
          if (!("result" in res.data)) {
            commit("pushConsultationMessage", res.data);
          } else {
            showAlert({ type: "error", message: res.data.result.error_msg });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getConsultationMessages({ rootState, commit }, id) {  
      let data = { consulta: parseInt(id) };

      await axios({
        method: "post",
        url: rootState.API_URL + `/consultation/getMessages`,
        data,
        headers: rootState.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data)) {
            let body = res.data[0].content;
            commit("setConsultationBody", body);
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
    async closeConsultation({ rootState, commit }, payload) {
      let data = { consulta: parseInt(payload.id) };
      await axios({
        method: "post",
        url: rootState.API_URL + "/consultation/close",
        data,
        headers: rootState.headers,
      })
        .then((res) => {
          if (res.data == 1) {
            commit("removeConsultation", parseInt(payload.id));
            commit("clearConsultation");
          } else {
            console.log("Error: closeConsultation ->" + res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async createConsultation({ rootState, commit, dispatch }, payload) {
      let data = {
        materia: parseInt(payload.subject),
        asunto: payload.matter,
      };
      await axios({
        method: "post",
        url: rootState.API_URL + "/consultation/create",
        data: data,
        headers: rootState.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data)) {
            commit("pushConsultation", res.data[0]);
            commit("setNewMessage", payload.message);

            payload.id = res.data[0].id;
            dispatch("sendConsultationMessage", payload.id);
          } else {
            showAlert({ type: "error", message: res.data.result.error_msg });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
