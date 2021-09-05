<template>
  <div
    class="flex justify-between text-white w-full min-h-full"
    style="min-width: 15rem;"
  >
    <div class="w-full flex justify-center items-center">
      <TheChat v-if="!create_chat_mode && chat != null" />

      <div
        class="flex justify-center items-center h-full"
        v-if="!create_chat_mode && chat == null"
      >
        <p class="text-2xl">Seleccione un chat</p>
      </div>

      <div
        class="w-9/12 mx-auto py-2"
        v-show="create_chat_mode"
      >
        <div
          class="bg-gray-700 px-5 py-2 rounded-xl border-2 border-gray-600 w-full"
        >
          <p class="text-2xl text-center">Crear sala de chat</p>
          <div class="">
            <div class="mt-4">
              <p class="text-center mb-1">Ingrese el tema a tratar</p>

              <div class=" ">
                <input
                  v-model="matter"
                  class="w-72 block mx-auto text-md bg-white p-1 bg-opacity-20 rounded-md outline-none"
                  maxlength="50"
                  type="text"
                />
                <span class="block text-center text-xs text-yellow-500 pl-2"
                  >* máximo 50 caracteres</span
                >
              </div>
            </div>

            <div class="mt-4">
              <p class="text-center">Seleccione la materia</p>
              <div class="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                <div
                  class="flex cursor-pointer items-center justify-between  p-2 min-w-full
                      bg-gray-700 bg-opacity-90 border-2 border-gray-600 rounded-xl transform transition-transform transition-colors hover:bg-gray-600"
                  :id="'subject_' + subject.id"
                  v-for="subject in user_subjects"
                  :key="subject.id"
                  @click="toggleSubject(subject.id)"
                  style="height:fit-content"
                >
                  <p
                    :id="'subject_name_' + subject.id"
                    class=" text-sm bg-transparent select-none"
                    type="text"
                  >
                    {{ subject.name }}
                  </p>
                  <i
                    :id="'subject_icon_' + subject.id"
                    class="far fa-square cursor-pointer text-white hover:text-indigo-400 transition-colors mx-1 text-md drop-shadow-lg "
                  ></i>
                </div>
              </div>
            </div>

            <div class="flex justify-around">
              <button @click="create()" class="btn-success mt-5 px-5">
                Crear sala
              </button>
              <button
                @click="create_chat_mode = !create_chat_mode"
                class="btn-danger mt-5 px-5"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="h-92vh bg-gray-700 rounded-2xl shadow-xl">
      <div
        class="flex justify-between items-center px-2 bg-gray-600 rounded-t-xl rounded-b-md"
      >
        <h2 class="text-center text-2xl my-2 ">
          Salas de chat
        </h2>

        <button
          @click="create_chat_mode = !create_chat_mode"
          class="btn-success ml-5 text-sm py-0.5 px-3 border-0"
        >
          Crear
        </button>
      </div>

      <div class=" overflow-y-auto px-2 mt-3" style="height: 80vh;">
        <div class="" v-if="chats.length == 0">
          <p>No tienes salas de chat activas</p>
        </div>
        <div
          @click="openChat(chat)"
          class=" text-white my-1 mb-0.5 py-3 px-2 hover:bg-gray-800 hover:bg-opacity-40 transition-colors rounded-xl cursor-pointer"
          v-for="chat in chats"
          :key="chat.id"
          :id="'chat_' + chat.id"
        >
          <div class="select-none">
            <div>
              <div
                class="flex justify-between items-center flex-wrap min-w-max"
              >
                <p
                  class="ml-2 font-semibold px-1 rounded-md select-none truncate"
                  style="max-width: 12rem;"
                >
                  {{ chat.subject_name }}
                </p>
                <span class="text-xs pr-3 select-none"
                  >{{ getHour(chat.creation_date) }}
                </span>
              </div>
              <p
                class="text-sm pl-5 pt-0.5 text-gray-300 truncate"
                style="max-width: 15rem;"
              >
                {{ chat.theme }}
              </p>
            </div>
            <!-- <div
                v-show="chat.state == 2"
                class="rounded-full mr-2 text-green-500"
              >
                <i class="fas fa-check-circle"></i>
              </div>
              <div
                v-show="chat.state == 1"
                class="rounded-full mr-2 text-gray-800"
              >
                <i class="far fa-circle"></i>
              </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import TheChat from "@/components/TheChat.vue";
import moment from "moment";

export default {
  name: "ChatRooms",
  data: function() {
    return {
      create_chat_mode: false,
      matter: "",
      subject_id: null,
      chat_selected: null,
    };
  },
  components: {
    TheChat,
  },
  created() {
    this.getChatRooms();
    this.getUserData();
    this.getUserGroup();
  },
  computed: {
    ...mapState({
      chats: (state) => state.chatRooms.chats,
      chat: (state) => state.chatRooms.chat,
      user_subjects: (state) => state.subjects,
    }),
  },
  methods: {
    ...mapMutations(["setChat"]),
    ...mapActions([
      "getChatRooms",
      "createChatRoom",
      "getUserGroup",
      "getUserData",
      "getChatMesages",
      "wsMessagesConnection",
    ]),
    getHour(date) {
      // Formateo la fecha a español
      let date_formated = moment(date).locale("es");
      console.log(moment(date_formated).calendar().length);
      console.log(moment(date_formated).calendar());
      if (moment(date_formated).calendar().length > 15) {
        date_formated = moment(date_formated).format("l");
      } else {
        date_formated = moment(date_formated).calendar();
      }
      return date_formated;
    },
    toggleSubject(subject_id) {
      let subjectDiv = document.getElementById("subject_" + subject_id);
      let subjectIcon = document.getElementById("subject_icon_" + subject_id);
      let subjectName = document.getElementById("subject_name_" + subject_id);

      subjectDiv.classList.add("scale-95");
      subjectDiv.classList.replace("bg-gray-700", "bg-gray-800");
      subjectIcon.classList.replace("fa-square", "fa-check-square");
      subjectIcon.classList.add("text-indigo-400");
      subjectIcon.classList.replace(
        "hover:text-indigo-400",
        "hover:text-indigo-300"
      );
      subjectName.classList.add("text-indigo-400");
      subjectDiv.classList.remove("hover:bg-gray-600");

      if (this.subject_id != null && this.subject_id != subject_id) {
        // Añado las clases al div y al icono para deseleccioarla
        let subjectDivToDeselect = document.getElementById(
          "subject_" + this.subject_id
        );
        let subjectIconToDeselect = document.getElementById(
          "subject_icon_" + this.subject_id
        );
        let subjectNameToDeselect = document.getElementById(
          "subject_name_" + this.subject_id
        );
        subjectDivToDeselect.classList.remove("scale-95");
        subjectDivToDeselect.classList.replace("bg-gray-800", "bg-gray-700");
        subjectDivToDeselect.classList.add("hover:bg-gray-600");
        subjectIconToDeselect.classList.replace("fa-check-square", "fa-square");
        subjectIconToDeselect.classList.remove("text-indigo-400");
        subjectNameToDeselect.classList.remove("text-indigo-400");
      }
      this.subject_id = subject_id;
    },
    create() {
      this.create_chat_mode = false;
      this.createChatRoom({ matter: this.matter, subject: this.subject_id });
      this.matter = "";
    },
    openChat(chat) {
      /* this.getConsultation(chat.id); */
      this.create_chat_mode = false;
      this.setChat(chat);
      this.getChatMesages(chat.id);
      this.wsMessagesConnection();
      this.toggleChatSelected(chat.id);
    },
    toggleChatSelected(id) {
      let div = document.getElementById("chat_" + id);
      div.classList.add("bg-indigo-600");
      div.classList.remove("hover:bg-gray-800");
      div.classList.remove("hover:bg-opacity-40");

      if (this.chat_selected != null && this.chat_selected != id) {
        let selected_div = document.getElementById(
          "chat_" + this.chat_selected
        );
        selected_div.classList.remove("bg-indigo-600");
        selected_div.classList.add("hover:bg-gray-800");
        selected_div.classList.add("hover:bg-opacity-40");
      }

      this.chat_selected = id;
    },
  },
};
</script>

<style></style>
