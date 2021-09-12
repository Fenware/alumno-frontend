/* eslint-disable no-unused-vars */
import axios from "axios";
// Modulo donde manejo las alertas
import showAlert from "@/utils/alerts";

export default {
  state: {
    chats: [],
    chat: null,
    user_subjects: [],
    socket: null,
    ws_messages_connection: null,
    ws_chat_rooms_connection: null,
  },
  mutations: {
    setChats(state, chats) {
      state.chats = chats;
    },
    setChat(state, chat) {
      // Arreglar, que haya un endpoint para obtener participantes
      let messages =
        state.chat && state.chat.messages ? state.chat.messages : [];
      state.chat = chat;
      state.chat.messages = messages;
    },
    setMessages(state, messages) {
      state.chat.messages = messages;
    },
    pushMessage(state, message) {
      state.chat.messages.push(message);
    },
    setUserSubjects(state, subjects) {
      state.user_subjects = subjects;
    },
    pushNewChat(state, chat) {
      state.chats.push(chat);
    },
    setWsMessagesConnection(state, conn) {
      state.ws_messages_connection = conn;
    },
    setWsChatRoomsConnection(state, conn) {
      state.ws_chat_rooms_connection = conn;
    },
    clearChat(state) {
      state.chat = null;
    },
    removeChatRoom(state, chat_id) {
      state.chats.forEach((chatRoom, index) => {
        if (parseInt(chatRoom.id) == chat_id) {
          state.chats.splice(index, 1);
        }
      });
    },
    setSocket(state, socket) {
      state.socket = socket;
    },
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
    async getChatRoomById({ rootState, commit }, chat_id) {
      await axios({
        method: "get",
        url: rootState.API_URL + `/chat?chat=${chat_id}`,
        headers: rootState.headers,
      })
        .then((res) => {
          console.log(res);
          if (!("result" in res.data)) {
            // LLamo a la funcion logout
            commit("setChat", res.data);
          } else {
            console.log("Error -> getChatRoomById");
            console.log(res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async createChatRoom({ rootState, commit, state }, payload) {
      let data = {
        materia: parseInt(payload.subject),
        asunto: payload.matter,
      };
      await axios({
        method: "post",
        url: rootState.API_URL + "/chat",
        data: data,
        headers: rootState.headers,
      })
        .then((res) => {
          console.log(res);
          if (!("result" in res.data)) {
            state.socket.emit("room:create", res.data);
            showAlert({
              type: "success",
              message: "Sala de chat creada correctamente",
            });
          } else {
            showAlert({ type: "error", message: res.data.result.error_msg });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getChatMesages({ rootState, commit }, chat_id) {
      let data = `chat=${chat_id}`;
      await axios({
        method: "get",
        url: rootState.API_URL + `/chat-mensaje?${data}`,
        headers: rootState.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data)) {
            commit("setMessages", res.data);
          } else {
            showAlert({ type: "error", message: res.data.result.error_msg });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async sendMessageToChat({ rootState, state }, payload) {
      let data = {
        chat: parseInt(payload.id),
        msg: payload.message,
      };
      await axios({
        method: "post",
        url: rootState.API_URL + "/chat-mensaje",
        data: data,
        headers: rootState.headers,
      })
        .then((res) => {
          if (!("result" in res.data)) {
            console.log(res.data);
            state.socket.emit("chat:sendMessage", res.data);
          }
          else{  
            showAlert({ type: "error", message: res.data.result.error_msg });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async closeChatRoom({ rootState, state }, chat_id) {
      await axios({
        method: "delete",
        url: rootState.API_URL + "/chat",
        data: chat_id,
        headers: rootState.headers,
      })
        .then((res) => {
          console.log(res);
          if (res.data == 1) {
            let wsData = {
              id_group: rootState.group.id_group,
              chat: chat_id.chat,
            };
            state.socket.emit("room:delete", wsData);
            showAlert({
              type: "info",
              message: "Sala de chat te rminada correctamente",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    wsChatRoomsConnection({ rootState, commit, state }) {
      state.socket.on(`room:${rootState.group.id_group}`, (data) => {
        commit("pushNewChat", data);
      });
      state.socket.on(`room:delete_${rootState.group.id_group}`, (data) => {
        commit("removeChatRoom", data.chat);
      });
    },
    wsMessagesConnection({ state, commit }) {
      state.socket.on(`chat:message_${state.chat.id}`, (data) => {
        commit("pushMessage", data);
      });
    }
  },
};
