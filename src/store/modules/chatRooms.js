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
    selected_chat: null,
  },
  mutations: {
    setChats(state, chats) {
      state.chats = chats;
    },
    setChat(state, chat) {
      // Arreglar, que haya un endpoint para obtener participantes
      state.chat = chat;
    },
    setMessages(state, { messages, id }) {
      state.chats.find((chat) => chat.id == id).messages = messages;
    },
    pushMessage(state, message) {
      let chat = state.chats.find((chat) => chat.id == message.id_query);
      if ("messages" in chat) {
        chat.messages.push(message);
      } else {
        chat.messages = [];
        chat.messages.push(message);
      }
    },
    setUserSubjects(state, subjects) {
      state.user_subjects = subjects;
    },
    pushNewChat(state, chat) {
      state.chats.push(chat);
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
    setChatId(state, id) {
      state.selected_chat = id;
    },
    clearChatId(state) {
      state.selected_chat = null;
    },
  },
  actions: {
    async getChatRooms({ rootState, commit, dispatch }) {
      await axios({
        method: "get",
        url: rootState.API_URL + "/chat",
        headers: rootState.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data)) {
            // LLamo a la funcion logout
            commit("setChats", res.data);
            res.data.forEach((chat) => {
              dispatch("getChatMesages", chat.id);
            });
            dispatch("wsMessagesConnection");
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
    async createChatRoom({ rootState, dispatch, state, commit }, payload) {
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
    async getChatMesages({ rootState, commit }, chat_id) {
      let data = `chat=${chat_id}`;
      await axios({
        method: "get",
        url: rootState.API_URL + `/chat-mensaje?${data}`,
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
        url: rootState.API_URL + "/chat-mensaje",
        data: data,
        headers: rootState.headers,
      })
        .then((res) => {
          if (!("result" in res.data)) {
            console.log(res.data);
            state.socket.emit("room:newMessage", res.data);
          } else {
            showAlert({ type: "error", message: res.data.result.error_msg });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async closeChatRoom({ rootState, state, commit }, chat_id) {
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
            state.socket.emit("group:delete", wsData);
            commit("clearChatId");
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
    wsChatRoomsConnection({ rootState, commit, dispatch, state }) {
      let group = `group:${rootState.group.id_group}`;

      state.socket.emit("join:group", group);

      state.socket.on(`group:newGroup`, (data) => {
        commit("pushNewChat", data);
        dispatch("newWsMessagesConnection", data);
      });
      state.socket.on(`group:removeGroup`, (data) => {
        commit("removeChatRoom", data.chat);
        commit("clearChatId");
        commit("clearChat");
      });
    },
    wsMessagesConnection({ state, commit }) {
      state.chats.forEach((chat) => {
        let room = `room:${chat.id}`;
        console.log(state.socket);

        // Ingreso a la sala de chat
        state.socket.emit("join:room", room);

        //Por ahora no se usa, es para ver usuarios conectados
        state.socket.on("roomUsers", (/* {room, users} */ data) => {
          console.log("ws:roomUsers ->");
          console.log(data);
        });

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

      //Por ahora no se usa, es para ver usuarios conectados
      state.socket.on("roomUsers", (/* {room, users} */ data) => {
        console.log("ws:roomUsers ->");
        console.log(data);
      });

      state.socket.on("room:message", (data) => {
        if (data.id_query == chat.id) {
          commit("pushMessage", data);
        }
      });
    },
  },
};
