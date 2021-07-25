<template>
  <div class="text-white">
    <h2 class="text-center text-3xl pt-1">Consulta</h2>
    <div class="flex justify-center mt-10">
      <div
        class="text-white rounded-3xl | bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl max-w-lg"
      >
        <div class="flex justify-between mb-3 items-center py-4 px-5">
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
          <button
            @click="closeConsultation()"
            class="text-sm text-white rounded-full px-3 py-0.5 | bg-red-500 hover:bg-opacity-80 transition-all ease-linear backdrop-filter backdrop-blur-xl shadow-2xl"
          >
            Cerrar consulta
          </button>
        </div>

        <div class="flex items-center mx-20 mb-2">
          <span class="mr-3">Docente: </span>
          <p class="font-bold text-white rounded-lg px-1 py-1">
            {{ consultation.teacher_name }}
          </p>
        </div>

        <div class="flex items-center mx-20 mb-8">
          <span class="mr-3">Fecha de creación: </span>
          <p class="font-bold text-white rounded-lg px-1 py-1">
            {{ consultation.creation_date }}
          </p>
        </div>

        <div class=" items-center mx-20 mb-5">
          <span class="mr-3 ">Asunto: </span>
          <p
            class="text-white wrap rounded-lg px-3 py-1 | bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl"
          >
            {{ consultation.theme }}
          </p>
        </div>

        <div class="  mx-20">
          <span class="block mr-3">Mensaje: </span>
          <textarea
            class=" w-max text-white rounded-lg px-3 py-1 | outline-none bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl"
            v-model="messages[0].content"
            cols="35"
            rows="4"
            disabled
          ></textarea>
        </div>

        <div class="mt-5 pb-2">
          <h3 class="pl-3 text-xl">Respuestas</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import axios from "axios";

export default {
  name: "Consultation",
  data: function() {
    return {
      messages: ["Esperando datos"],
    };
  },
  computed: {
    ...mapState(["API_URL", "headers", "consultation"]),
  },
  created() {
    var id = this.$route.params.id;
    if (this.consultation == null) {
      this.getConsultation(id);
    } else if (parseInt(this.consultation.id) != parseInt(id)) {
      this.getConsultation(id);
    }
    this.getConsultationMessages(id);
  },
  methods: {
    ...mapMutations(["setConsultation"]),
    async getConsultation(id) {
      let data = `consulta=${id}`;
      await axios({
        method: "get",
        url: this.API_URL + `/consulta?${data}`,
        headers: this.headers,
      })
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            this.setConsultation(res.data[0]);
          } else {
            console.log("Error: syncConsultations ->" + res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getConsultationMessages(id) {
      let data = `consulta=${id}`;
      await axios({
        method: "get",
        url: this.API_URL + `/consulta-mensaje?${data}`,
        headers: this.headers,
      })
        .then((res) => {
          console.log(res);
          if (Array.isArray(res.data) && res.data.length > 0) {
            this.messages = res.data;
          } else {
            console.log("Error: getConsultationMessages ->" + res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async closeConsultation() {
      let data = { "consulta": parseInt(this.consultation.id) };
      await axios({
        method: "delete",
        url: this.API_URL + "/consulta",
        data: data,
        headers: this.headers,
      })
        .then((res) => {
          console.log(res);
          /* if (Array.isArray(res.data) && res.data.length > 0) {
            this.setConsultation(res.data[0]);
          } else {
            console.log("Error: closeConsultation ->" + res.data);
          } */
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style></style>
