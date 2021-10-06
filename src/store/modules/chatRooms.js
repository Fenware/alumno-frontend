/* eslint-disable no-unused-vars */
import axios from "axios";

// Modulo donde manejo las alertas
import { showAlert } from "@/utils/alerts";

export default {
  state: {
    chats: [],
    chat: null,
    user_subjects: [],
    ws_messages_connection: null,
    ws_chat_rooms_connection: null,
    selected_chat: null,
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
          state.chats.splice(1, index);
        }
      });
    },
    setChatId(state, id) {
      state.selected_chat = id;
    },
    clearChatId(state) {
      state.selected_chat = null;
    },
  },
  actions: {
    async getChatRooms({ rootState, commit, state }) {
      await axios({
        method: "post",
        url: rootState.API_URL + "/chat/getActiveChats",
        headers: rootState.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data)) {
            if (state.chats.length == 0) {
              commit("setChats", res.data);
            } else if (state.chats != res.data) {
              commit("setChats", res.data);
            }
            if (state.chat) {
              let chat = res.data.find((chat) => chat.id == state.chat.id);
              if (!chat) {
                commit("clearChatId");
                commit("clearChat");
              }
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getChatRoomById({ rootState, commit }, chat_id) {
      let data = {
        chat: parseInt(chat_id),
      };
      await axios({
        method: "post",
        url: rootState.API_URL + `/chat/getChatById`,
        data,
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
    async createChatRoom({ rootState }, chatRoomData) {
      let data = {
        materia: parseInt(chatRoomData.subject),
        asunto: chatRoomData.matter,
      };
      console.log(data);
      await axios({
        method: "post",
        url: rootState.API_URL + "/chat/create",
        data,
        headers: rootState.headers,
      })
        .then((res) => {
          if (!("result" in res.data)) {
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
    async getChatMessages({ rootState, commit, state }, chat_id) {
      let data ={
        chat: parseInt(chat_id)
      }
      await axios({
        method: "post",
        url: rootState.API_URL + `/chat/getMessages`,
        data,
        headers: rootState.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data)) {
            if (state.chat) {
              if (state.chat.messages.length == 0) {
                commit("setMessages", res.data);
              } else if (
                state.chat.messages[state.chat.messages.length - 1].id !=
                res.data[res.data.length - 1].id
              ) {
                commit("setMessages", res.data);
              }
            }
          } else {
            showAlert({ type: "error", message: res.data.result.error_msg });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async sendMessageToChat({ rootState }, payload) {
      let data = {
        chat: parseInt(payload.id),
        msg: payload.message,
      };
      await axios({
        method: "post",
        url: rootState.API_URL + "/chat/postMessage",
        data: data,
        headers: rootState.headers,
      })
        .then((res) => {
          if ("result" in res.data) {
            showAlert({ type: "error", message: res.data.result.error_msg });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async closeChatRoom({ rootState, commit }, chat_id) {
      await axios({
        method: "post",
        url: rootState.API_URL + "/chat/closeChat",
        data: chat_id,
        headers: rootState.headers,
      })
        .then((res) => {
          if (res.data == 1) {
            showAlert({
              type: "info",
              message: "Sala de chat terminada correctamente",
            });
            commit("clearChat");
            commit("clearChatId");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /* wsChatRoomsConnection({ rootState, commit, state }) {
      require("@/utils/websockets");
      if(state.ws_chat_rooms_connection){
        state.ws_chat_rooms_connection.close();
      }
      // eslint-disable-next-line no-undef
      let conn = new ab.Session(
        `ws://localhost:8085?token=${rootState.token}`,
        function() {
          conn.subscribe(`${rootState.group.id_group}`, function(topic, data) {
            console.log(data);
              
            if ("chat" in data) {
              commit("pushNewChat", data.chat);
            }else if("close" in data){
              commit("removeChatRoom", data.close);
            }
          });
        },
        function() {
          console.warn("WebSocket connection closed");
        },
        { skipSubprotocolCheck: true }
      );
      commit("setWsChatRoomsConnection", conn);
    },
    wsMessagesConnection({ rootState, state, commit }) {
      require("@/utils/websockets");
      if(state.ws_messages_connection){
        state.ws_messages_connection.close();
      }
      // eslint-disable-next-line no-undef
      let conn = new ab.Session(
        `ws://localhost:8086?token=${rootState.token}`,
        function() {
          conn.subscribe(`${state.chat.id}`, function(topic, data) {
            if (data.msg != null) {
              commit("pushMessage", data.msg);
            }
          });
        },
        function() {
          console.warn("WebSocket connection messages closed");
        },
        { skipSubprotocolCheck: true }
      );
      commit("setWsMessagesConnection", conn);
    }, */
    listenMessages({ dispatch, state }) {
      setInterval(function() {
        if (state.chat) dispatch("getChatMessages", state.chat.id);
      }, 500);
    },
    listenRooms({ dispatch }) {
      setInterval(function() {
        dispatch("getChatRooms");
      }, 500);
    },
  },
};
