<template>
  <div
    class="flex justify-between text-white w-full min-h-full"
    style="min-width: 15rem;"
  >
    <div></div>
    <div class="h-92vh bg-gray-700 rounded-r-2xl shadow-xl">
      <div class="flex justify-between items-center mx-2">
        <h2 class="text-center text-2xl my-2 ">
          Salas de chat
        </h2>

        <button
          @click="create_chat_mode = !create_chat_mode"
          class="btn-success text-sm py-0.5 px-2 border-0"
        >
          Crear
          <i class="fas fa-plus ml-1"></i>
        </button>
      </div>

      <div class=" overflow-y-auto px-2" style="height: 82vh;">
        <div v-show="create_chat_mode" class="">
          <hr />
          <div class="py-2">
            <p class="">Seleccionar materia</p>
            <p v-for="subject in user_subjects" :key="subject.id">
              {{ subject.name }}
            </p>
          </div>
          <hr />
        </div>

        <div class="mt-5" v-if="chats.length == 0">
          <p>No tienes salas de chat activas</p>
        </div>
        <div
          @click="viewConsultation(consultation)"
          class=" text-white mt-5 mb-0.5 py-3 px-2 hover:bg-gray-800 hover:bg-opacity-40 transition-colors rounded-xl cursor-pointer"
          v-for="consultation in chats"
          :key="consultation.id"
          :id="'consultation_' + consultation.id"
        >
          <!-- <div class="flex justify-between items-center">
              <div>
                <div class="flex flex-wrap">
                  <span
                    class="ml-2 text-indigo-400 font-semibold px-1 rounded-md select-none"
                    >{{ consultation.subject_name }}</span
                  >
                </div>
                <p class="text-sm pl-5 pt-0.5">
                  {{ consultation.theme }}
                </p>
              </div>
              <div
                v-show="consultation.state == 2"
                class="rounded-full mr-2 text-green-500"
              >
                <i class="fas fa-check-circle"></i>
              </div>
              <div
                v-show="consultation.state == 1"
                class="rounded-full mr-2 text-gray-800"
              >
                <i class="far fa-circle"></i>
              </div>
            </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "ChatRooms",
  data: function() {
    return {
      create_chat_mode: false,
    };
  },
  created() {
    this.getChatRooms();
    this.getUserGroup();
  },
  computed: {
    ...mapState({
      chats: (state) => state.chatRooms.chats,
      user_subjects: (state) => state.subjects,
    }),
  },
  methods: {
    ...mapActions(["getChatRooms", "getUserSubjects", "getUserGroup"]),
  },
};
</script>

<style></style>
