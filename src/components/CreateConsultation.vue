<template>
  <div
    v-if="create_mode"
    class="text-white rounded-3xl pb-3 | bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl"
  >
    <p class="text-center text-xl my-1">Crear Consulta</p>

    <div class="px-7 mt-4">
      <label class="block pl-1 text-sm">Materia</label>
      <select
        name="subjects"
        class="mb-4 px-2 py-1.5 rounded-lg bg-white bg-opacity-30 backdrop-filter backdrop-blur-xl outline-none"
        v-model="consultation.subject"
      >
        <option selected disabled hidden>Seleccione la materia</option>
        <option
          class="text-black cursor-pointer"
          v-for="subject in subjects"
          :key="subject.id"
          :value="subject.id"
          >{{ subject.name }}</option
        >
      </select>

      <label class="block pl-1 text-sm" for="matter">Asunto</label>
      <input
        class="block w-72 mx-auto p-1 mb-4 |  placeholder-opacity-40 text-white rounded-lg shadow-lg transition-all ease-in-out hover:shadow-xl bg-gray-50 bg-opacity-25 hover:bg-opacity-40 focus:bg-opacity-40 outline-none placeholder-white focus:placeholder-transparent focus:ring-3 ring-white ring-opacity-20"
        id="matter"
        v-model="consultation.matter"
        placeholder="Escriba aquí..."
      />

      <label class="block pl-1 text-sm" for="message">Mensaje</label>
      <textarea
        class="block w-72 mx-auto p-1 |  placeholder-opacity-40 text-white rounded-lg shadow-lg transition-all ease-in-out hover:shadow-xl bg-gray-50 bg-opacity-25 hover:bg-opacity-40 focus:bg-opacity-40 outline-none placeholder-white focus:placeholder-transparent focus:ring-3 ring-white ring-opacity-20"
        id="message"
        v-model="consultation.message"
        placeholder="Escriba el mensaje aquí..."
        cols="30"
        rows="4"
      ></textarea>

      <div class="flex mb-1">
        <button
          @click="
            consultation.matter.trim() != '' &&
            consultation.message.trim() != ''
              ? createConsultation()
              : focusInput()
          "
          class="block mx-auto mt-5 py-2 px-5 | text-white rounded-lg shadow-lg transition-all ease-in-out hover:shadow-xl cursor-pointer bg-green-500 bg-opacity-25 hover:bg-opacity-40 outline-none focus:ring-4 ring-green-500  ring-opacity-20"
        >
          Enviar consulta
        </button>

        <button
          @click="toogleCreateMode()"
          class="block mx-auto mt-5 py-2 px-5 | text-white rounded-lg shadow-lg transition-all ease-in-out hover:shadow-xl cursor-pointer bg-red-500 bg-opacity-25 hover:bg-opacity-40 outline-none focus:ring-4 ring-green-500  ring-opacity-20"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>

  <div
    v-else
    class="px-4 text-white rounded-3xl pb-3 | bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl"
  >
    <p class="text-center text-xl my-1">Crear Consulta</p>

    <p>¿Tienes alguna duda o consulta sobre la materia?</p>
    <button
      @click="toogleCreateMode()"
      class="block mx-auto mt-5 py-2 px-10 | text-white rounded-lg shadow-lg transition-all ease-in-out hover:shadow-xl cursor-pointer bg-green-500 bg-opacity-25 hover:bg-opacity-40 outline-none focus:ring-4 ring-green-500  ring-opacity-20"
    >
      Crear consulta
    </button>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  name: "CreateConsultation",
  computed: {
    ...mapState(["API_URL", "headers", "subjects"]),
  },
  data: function() {
    return {
      create_mode: false,
      consultation: {
        matter: "",
        message: "",
        subject: "Seleccione la materia",
      },
    };
  },
  methods: {
    ...mapMutations(["addConsultation", "setNewMessage"]),
    ...mapActions(["sendConsultationMessage"]),
    focusInput() {
      if (this.consultation.matter.trim() == "") {
        document.getElementById("matter").focus();
      } else if (this.consultation.message.trim() == "") {
        document.getElementById("message").focus();
      }
    },
    toogleCreateMode() {
      this.create_mode = !this.create_mode;
    },
    async createConsultation() {
      if (this.consultation.subject != "Seleccione la materia") {
        let data = {
          materia: parseInt(this.consultation.subject),
          asunto: this.consultation.matter,
        };
        console.log(data);
        await axios({
          method: "post",
          url: this.API_URL + "/consulta",
          data: data,
          headers: this.headers,
        })
          .then((res) => {
            console.log(res);
            if (Array.isArray(res.data) && res.data.length > 0) {
              this.addConsultation(res.data[0]);
              this.setNewMessage(this.consultation.message);
              this.sendConsultationMessage(parseInt(res.data[0].id));
              this.clearInputs();
              this.toogleCreateMode();
            } else {
              alert(res.data.result.error_msg);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        alert("Tienes que elegir una materia!");
      }
    },
    clearInputs() {
      this.consultation.subject = "Seleccione la materia";
      this.consultation.matter = "";
      this.consultation.message = "";
    },
  },
};
</script>

<style></style>
