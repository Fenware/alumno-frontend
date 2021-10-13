/* eslint-disable no-unused-vars */
import axios from "axios";

// Modulo donde manejo las alertas
import { showAlert } from "@/utils/alerts";

export default {
  state: {
    chats: [],
    chat: null,
    user_subjects: [],
    selected_chat: null,
    socket: null,
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
    setMessages(state, { messages, id }) {
      state.chats.find((chat) => chat.id == id).messages = messages;
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
    setChatId(state, id) {
      state.selected_chat = id;
    },
    clearChatId(state) {
      state.selected_chat = null;
    },
    setSocket(state, socket) {
      state.socket = socket;
    }
  },
  actions: {
    async getChatRooms({ rootState, commit, dispatch }) {
      await axios({
        method: "post",
        url: rootState.API_URL + "/chat/getActiveChats",
        headers: rootState.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data)) {
            commit("setChats", res.data);
            res.data.forEach((chat) => {
              dispatch("getChatMessages", chat.id);
            });
            dispatch("wsMessagesConnection");
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
    async createChatRoom({ rootState, state, dispatch, commit }, chatRoomData) {
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
            // Emito que cree un chat
            state.socket.emit("group:create", res.data);
            dispatch("newWsMessagesConnection", res.data);
            commit("pushNewChat", res.data);
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
    async getChatMessages({ rootState, commit }, chat_id) {
      let data = {
        chat: parseInt(chat_id),
      };
      await axios({
        method: "post",
        url: rootState.API_URL + `/chat/getMessages`,
        data,
        headers: rootState.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data)) {
            commit("setMessages", { messages: res.data, id: chat_id });
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
        url: rootState.API_URL + "/chat/postMessage",
        data: data,
        headers: rootState.headers,
      })
        .then((res) => {
          if (!("result" in res.data)) {
            // Emito el nuevo mensajea
            state.socket.emit("room:newMessage", res.data);
          } else {
            showAlert({ type: "error", message: res.data.result.error_msg });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async closeChatRoom({ rootState, commit, state }, chat) {
      let data = { chat: parseInt(chat.id) };
      await axios({
        method: "post",
        url: rootState.API_URL + "/chat/closeChat",
        data,
        headers: rootState.headers,
      })
        .then((res) => {
          if (res.data == 1) {
            let wsData = {
              id_group: parseInt(chat.id_group),
              chat: parseInt(chat.id),
            };
            // Emito a group:delete para que se les elimine a todos
            state.socket.emit("group:delete", wsData);
            commit("clearChat");
            commit("clearChatId");
            showAlert({
              type: "info",
              message: "Sala de chat terminada correctamente",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    wsChatRoomsConnection({ rootState, commit, dispatch, state }) {
      let group = `group:${rootState.group.group.id_group}`;
      console.log(group);
      state.socket.emit("join:group", group);

      state.socket.on(`group:newGroup`, (data) => {
        commit("pushNewChat", data);
        dispatch("newWsMessagesConnection", data);
      });
      state.socket.on(`group:removeGroup`, (data) => {
        console.log(data);
        commit("removeChatRoom", data.chat);
        if (state.chat && parseInt(state.chat.id) == data.chat) {
          commit("clearChatId");
          commit("clearChat");
        }
      });
    },
    wsMessagesConnection({ state, commit }) {
      state.chats.forEach((chat) => {
        let room = `room:${chat.id}`;

        // Ingreso a la sala de chat
        state.socket.emit("join:room", room);

        //Por ahora no se usa, es para ver usuarios conectados
        /* state.socket.on("roomUsers", (data) => {
          console.log("ws:roomUsers ->");
          console.log(data);
        }); */

        state.socket.on("room:message", (data) => {
          if (data.id_query == chat.id) {
            commit("pushMessage", data);
          }
        });
      });
    },
    newWsMessagesConnection({ state, commit }, chat) {
      let room = `room:${chat.id}`;

      // Ingreso a la sala de chat
      state.socket.emit("join:room", room);

      // Por ahora no se usa, es para ver usuarios conectados
      /* state.socket.on("roomUsers", (data) => {
        console.log("ws:roomUsers ->");
        console.log(data);
      }); */

      state.socket.on("room:message", (data) => {
        if (data.id_query == chat.id) {
          commit("pushMessage", data);
        }
      });
    },
    closeSocketConnection({state}){
      state.socket.disconnect();
    }
  },
};
