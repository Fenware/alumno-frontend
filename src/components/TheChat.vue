<template>
  <div class="flex flex-col gap-2 justify-between h-full w-full">
    <div class="mt-1 flex flex-col justify-between h-full">
      <div class="select-none">
        <p class="text-3xl text-center">
          {{ chat != null ? chat.subject_name : "Esperando datos" }}
        </p>
        <p class=" text-center text-sm">
          {{ chat != null ? chat.theme : "Esperando datos" }}
        </p>
      </div>

      <div class="flex flex-col gap-2 px-10 max-h-96 overflow-y-auto xl:mx-auto xl:w-8/12">
        <div
          v-for="message in chat.messages"
          :key="message.id"
          :class="
            user.id == message.id_user
              ? 'rounded-tr-sm ml-auto'
              : 'rounded-tl-sm'
          "
          class="w-max px-2 py-1 rounded-xl  bg-gray-700"
        >
          <p class="leading-3 text-xs " v-if="user.id != message.id_user">{{message.name}} {{message.surname}}</p>
          <p class="leading-tight pt-1 pr-3 max-w-sm">{{ message.content }}</p>
          <p class="leading-3 px-1 pt-0.5 text-xs text-right text-gray-300">{{ getHour(message.date) }}</p>
        </div>
      </div>
    </div>

    <div class="flex justify-between lg:justify-center items-center mx-2">
      <input
        v-model="new_message"
        v-on:keyup.enter="sendMessage()"
        type="text"
        maxlength="600"
        class="w-full xl:w-8/12 bg-white bg-opacity-20 hover:bg-opacity-25 focus:bg-opacity-25 transition-all rounded-xl my-2.5 h-10 ml-0.5 mr-3 px-3 outline-none "
        placeholder="Escribir mensaje"
      />
      <div
        @click="sendMessage()"
        class=" transition-colors text-gray-400 hover:text-gray-300 cursor-pointer px-1 flex items-center"
      >
        <!-- <i class="fas fa-paper-plane px-2 mr-0.5"></i> -->
        <span class="material-icons ">send</span>
      </div>
    </div>
    <!-- 
    </input> -->
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import moment from "moment";

export default {
  name: "TheChat",
  data: function() {
    return {
      new_message: "",
    };
  },
  computed: {
    ...mapState({
      chat: (state) => state.chatRooms.chat,
      user: (state) => state.userProfile.user,
    }),
  },
  methods: {
    ...mapActions(["sendMessageToChat"]),
    sendMessage() {
      /* let data = {
        chat: payload.id,
        msg: payload.new_message,
      }; */
      this.sendMessageToChat({ id: this.chat.id, message: this.new_message });
      this.new_message = "";
    },
    getHour(date) {
      // Formateo la fecha a español
      let date_formated = moment(date).locale("es");
      date_formated = moment(date_formated).format("LT");
      /* return moment(date_formated).format('LT'); */
      return date_formated;
    },
  },
};
</script>

<style></style>
