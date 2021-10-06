<template>
  <div class="text-white w-full min-h-full" style="min-width: 15rem;">
    <div class="flex justify-between ">
      <Consultation v-if="consultation.active" @closeModal="modalClose" />
      <div class="flex justify-center items-center mx-auto" v-else>
        <p class="text-2xl">Seleccione una consulta</p>
      </div>

      <div class="h-92vh bg-gray-700 rounded-r-2xl shadow-xl">
        <div class="grid grid-cols-5 items-center">
          <button class=" col-span-1 flex justify-center ">
            <span class="material-icons">history</span>
          </button>

          <h2 class=" col-span-3 text-center text-2xl my-1">
            Consultas
          </h2>

          <button @click="openModal()" class=" col-span-1 flex justify-center">
            <span class="material-icons">add</span>
          </button>
        </div>

        <div class=" mt-2 overflow-y-auto px-2" style="height: 82vh;">
          <div v-if="consultations.length == 0">
            <p>No tienes consultas pendientes</p>
          </div>
          <div
            @click="viewConsultation(consultation)"
            class=" text-white my-0.5 py-3 px-2 hover:bg-gray-800 hover:bg-opacity-40 transition-colors rounded-xl cursor-pointer"
            v-for="consultation in consultations"
            :key="consultation.id"
            :id="'consultation_' + consultation.id"
          >
            <div class="flex justify-between">
              <div class="mr-3">
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
                class="mr-1  text-green-500"
              >
                <span class="material-icons text-xl">check_circle_outline</span>
              </div>
              <div
                v-show="consultation.state == 1"
                class="rounded-full mr-1  text-gray-500"
              >
                <span class="material-icons text-xl"
                  >radio_button_unchecked</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL -->

    <div
      class="main-modal fixed w-full h-100 inset-0 z-50 overflow-hidden hidden justify-center items-center animated fadeIn faster rounded-2xl"
      style="background: rgba(0,0,0,.5);"
    >
      <div
        style="max-height: 70vh;"
        class="border border-gray-600 modal-container bg-gray-800 w-11/12 md:max-w-md mx-auto rounded-xl shadow-lg z-50 overflow-y-auto"
      >
        <div class="modal-content py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center">
            <p class="text-2xl font-bold">Crear nueva consulta</p>
            <div class="modal-close cursor-pointer z-50" @click="modalClose()">
              <span class="material-icons text-red-400">close</span>
            </div>
          </div>
          <!--Body-->
          <div class="px-7 mt-5">
            <label class="block text-sm">Materia</label>
            <select
              name="subjects"
              class="mb-4 px-2 ml-1 py-1.5 rounded-lg bg-white bg-opacity-30 outline-none"
              v-model="new_consultation.subject"
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

            <label class="block text-sm" for="matter">Asunto</label>
            <input
              class="block mx-1 p-1 mb-4 | placeholder-opacity-40 text-white rounded-lg shadow-lg transition-all ease-in-out hover:shadow-xl bg-gray-50 bg-opacity-25 hover:bg-opacity-40 focus:bg-opacity-40 outline-none placeholder-white focus:placeholder-transparent"
              id="matter"
              v-model="new_consultation.matter"
              autocomplete="off"
              maxlength="65"
              placeholder="Escriba aquí"
            />

            <label class="block text-sm" for="message">Mensaje</label>
            <textarea
              class="block mx-1 p-1 | placeholder-opacity-40 text-white rounded-lg shadow-lg transition-all ease-in-out hover:shadow-xl bg-gray-50 bg-opacity-25 hover:bg-opacity-40 focus:bg-opacity-40 outline-none placeholder-white focus:placeholder-transparent"
              id="message"
              v-model="new_consultation.message"
              placeholder="Escriba el mensaje aquí"
              cols="31"
              rows="4"
            ></textarea>
          </div>
          <!--Footer-->
          <div class="flex mb-1 mt-2">
            <button
              @click="
                new_consultation.matter.trim() != '' &&
                new_consultation.message.trim() != ''
                  ? create()
                  : focusInput()
              "
              class="btn-success block mx-auto mt-5 py-1 px-5 "
            >
              Enviar consulta
            </button>

            <button
              @click="modalClose()"
              class="btn-danger block mx-auto mt-5 py-1 px-5"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- EndModal -->
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import Consultation from "@/components/Consultation";
import { showAlert } from "@/utils/alerts.js";

export default {
  name: "Consultations",
  data: function() {
    return {
      consultation_selected: null,
      new_consultation: {
        matter: "",
        message: "",
        subject: "Seleccione la materia",
      },
    };
  },
  components: {
    Consultation,
  },
  computed: {
    ...mapState({
      consultations: (state) => state.consultations.consultations,
      consultation: (state) => state.consultations.consultation,
      subjects: (state) => state.group.subjects,
    }),
  },
  created() {
    this.getConsultations();
    this.getUserGroup();
  },
  methods: {
    ...mapMutations(["setConsultation"]),
    ...mapActions([
      "getConsultations",
      "getConsultation",
      "getConsultationMessages",
      "getUserGroup",
      "createConsultation",
    ]),
    viewConsultation(consultation) {
      this.getConsultation(consultation.id);
      this.toggleConsultationSelected(consultation.id);
    },
    toggleConsultationSelected(id) {
      let div = document.getElementById("consultation_" + id);
      div.classList.add("bg-gray-800");

      if (
        this.consultation_selected != null &&
        this.consultation_selected != id
      ) {
        let selected_div = document.getElementById(
          "consultation_" + this.consultation_selected
        );
        selected_div.classList.remove("bg-gray-800");
      }

      this.consultation_selected = id;
    },
    openModal() {
      let modal = document.querySelector(".main-modal");
      modal.classList.remove("fadeOut");
      modal.classList.add("fadeIn");
      modal.style.display = "flex";
    },
    modalClose() {
      this.clearInputs();
      let modal = document.querySelector(".main-modal");
      modal.classList.remove("fadeIn");
      modal.classList.add("fadeOut");
      setTimeout(() => {
        modal.style.display = "none";
      }, 500);
    },
    focusInput() {
      if (this.new_consultation.matter.trim() == "") {
        document.getElementById("matter").focus();
      } else if (this.new_consultation.message.trim() == "") {
        document.getElementById("message").focus();
      }
    },
    create() {
      if (this.new_consultation.subject != "Seleccione la materia") {
        this.createConsultation(this.new_consultation).then(() => {
          this.clearInputs();
          this.modalClose();
        });
      } else {
        showAlert({ type: "info", message: "Tienes que elegir una materia" });
      }
    },
    clearInputs() {
      this.new_consultation.subject = "Seleccione la materia";
      this.new_consultation.matter = "";
      this.new_consultation.message = "";
    },
  },
};
</script>

<style></style>
