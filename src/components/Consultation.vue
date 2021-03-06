<template>
  <div class="flex justify-center  mx-auto">
    <div class="text-white rounded-xl | max-w-lg">
      <div class="flex justify-between items-center pt-4 pb-1 px-5">
        <div class="flex gap-2 select-none">
          <span
            class="text-sm text-white rounded-lg px-3 py-0.5 | bg-purple-500 backdrop-filter backdrop-blur-xl shadow-2xl"
          >
            {{ consultation.group_name }}
          </span>
          <span
            class="text-sm text-white rounded-lg px-3 py-0.5 | bg-blue-500 backdrop-filter backdrop-blur-xl shadow-2xl"
          >
            {{ consultation.subject_name }}
          </span>
        </div>
        <p class="text-white rounded-lg px-1 py-1">
          {{ consultation.creation_date }}
        </p>
      </div>

      <div class=" items-center mx-20 mb-5">
        <p
          class="text-white text-center font-bold text-xl wrap rounded-lg px-3 py-1 "
        >
          {{ consultation.theme }}
        </p>
      </div>

      <div class="flex items-center mx-20 text-sm">
        <span class="mr-3 font-medium">{{getWord({file:'lang',word:'teacher',lang})}}: </span>
        <p class=" text-white rounded-lg px-1 py-1">
          {{ consultation.teacher_name }}
        </p>
      </div>

      <div class="mx-20 mt-2">
        <span class="mr-3 text-sm font-bold">{{getWord({file:'consultation',word:'consultation',lang})}}: </span>
        <p class="text-white  rounded-lg py-1 | outline-none">
          {{ consultation.body }}
        </p>
        <div class="flex mt-3">
          <button
            @click="toogleNewMessageMode()"
            class="ml-auto flex items-center py-0.5 pl-1 btn-success "
          >
            <span class="material-icons pb-0.5 mr-1">reply</span>
            {{getWord({file:'consultation',word:'reply',lang})}}
          </button>
        </div>
      </div>

      <div class="mt-2 pb-2">
        <h3 class="pl-3 text-xl">{{getWord({file:'consultation',word:'responses',lang})}}</h3>

        <div class="my-2 mx-8 overflow-y-auto h-52">
          <p class="text-center" v-if="consultation.messages.length == 0">
            {{getWord({file:'consultation',word:'no_responses',lang})}}
          </p>
          <div
            class=" flex mb-2"
            v-for="message in consultation.messages"
            :key="message.id"
          >
            <div
              class="bg-gray-700  pr-5 py-0.5 rounded-3xl rounded-tl-sm w-full"
            >
              <span class="pl-2 text-xs font-bold flex justify-between"
                ><span>{{ message.name }} {{ message.surname }}</span>
                <span>{{ message.date }}</span></span
              >
              <p class="pl-8">{{ message.content }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-show="new_message_mode" class="flex justify-center mt-2 py-2">
        <div>
          <label for="new_message" class=" block text-sm"
            >{{getWord({file:'consultation',word:'new_response',lang})}}:</label
          >
          <textarea
            class="text-sm w-96 text-white rounded-lg px-3 py-1 | outline-none bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl"
            v-model="new_message"
            autofocus="autofocus"
            id="new_message"
            cols="30"
            rows="5"
          ></textarea>
          <div class="flex mt-0.5">
            <button
              @click="toogleNewMessageMode()"
              class="text-sm py-0.5 ml-auto btn-danger"
            >
              {{getWord({file:'lang',word:'cancel',lang})}}
              <i class="fas fa-times"></i>
            </button>
            <button
              @click="
                new_message.trim() != '' ? sendMessage() : focusMessageInput()
              "
              class="text-sm py-0.5 ml-1 btn-success"
            >
              {{getWord({file:'lang',word:'send',lang})}}
              <i class="fas fa-reply"></i>
            </button>
          </div>
        </div>
      </div>
      <button @click="close()" class="block btn-danger mx-auto">
        {{getWord({file:'consultation',word:'finish',lang})}}
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { confirmModal } from "@/utils/alerts";
import { getWord } from "@/utils/lang";

export default {
  name: "Consultation",
  data: function() {
    return {
      new_message: "",
    };
  },
  computed: {
    ...mapState({
      consultation: (state) => state.consultations.consultation,
      new_message_mode: (state) => state.consultations.new_message_mode,
      lang: (state) => state.lang,
    }),
  },
  methods: {
    ...mapMutations([
      "setConsultation",
      "removeConsultation",
      "toogleNewMessageMode",
      "setNewMessage",
      "setConsultationStateAnswered",
    ]),
    ...mapActions([
      "getConsultationMessages",
      "sendConsultationMessage",
      "closeConsultation",
    ]),
    focusMessageInput() {
      document.getElementById("new_message").focus();
    },
    sendMessage() {
      this.setConsultationStateAnswered(this.consultation.id);
      this.setNewMessage(this.new_message);
      this.sendConsultationMessage(parseInt(this.consultation.id));
      this.new_message = "";
    },
    close() {
      let payload = {
        text: `<p class='text-white'>${getWord({file:'consultation',word:'want_to_finish',lang:this.lang})}</p>`,
        confirmButtonText: `${getWord({file:'consultation',word:'want_to_finish_yes',lang:this.lang})}`,
        function: this.closeConsultation,
        data: { id: this.consultation.id },
      };
      confirmModal(payload);
    },
    getWord,
  },
};
</script>

<style></style>
