<template>
  <div class="antialiased sans-serif text-white h-full  items-center flex flex-col">
    <h2 class="font-semibold text-center text-3xl pt-2">Registro de estudiante</h2>

    <form
      class="flex flex-col justify-between w-full h-full"
      @submit.prevent="nextStep()"
    >
      <div class="w-9/12 mx-auto px-5 py-5">
        <!-- <div v-show.transition="step === 'complete'"> -->
        <div v-show="step === 'complete'">
          <div class="rounded-lg p-10 flex items-center justify-center">
            <div>
              <h2 class="text-2xl mb-4 text-center font-bold">
                Registro exitoso
              </h2>

              <div class="text-white text-center my-8">
                <p>¡{{ user.name }} {{ user.surname }} te has registrado correctamente!</p>
                <p>Debes esperar a que un administrador acepte la solicitud de ingreso al grupo</p>
              </div>

              <div class="flex justify-around mt-10">
                <!--                <router-link :to="{name: 'Users'}" class="btn-info text-md px-4 py-1 mx-auto" type="button">
                                  Volver a sección de usuarios
                                </router-link>
                                <router-link :to="{ name: 'User', params: { nickname: user.nickname } }"
                                             class="btn-success text-md px-4 py-1 mx-auto">
                                  Ver usuario creado
                                </router-link>-->
              </div>
            </div>
          </div>
        </div>

        <div v-show="step !== 'complete'">
          <!-- Top Navigation -->

          <div class="border-b-2 pt-4 pb-3">
            <div
              class="uppercase tracking-wide text-xs font-bold text-indigo-400 mb-1 leading-tight"
            >
              <span>Paso: {{ step }} de 4</span>
            </div>
            <div
              class="flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div class="flex-1">
                <div v-show="step === 1">
                  <div class="text-xl font-bold leading-tight">
                    Datos personales
                  </div>
                </div>

                <div v-show="step === 2">
                  <div class="text-xl font-bold leading-tight">
                    Unir a grupo
                  </div>
                </div>

                <div v-show="step === 3">
                  <div class="text-lg font-bold leading-tight">
                    Perfil de usuario
                  </div>
                </div>

                <div v-show="step === 4">
                  <div class="text-lg font-bold leading-tight">
                    Seguridad de la cuenta
                  </div>
                </div>
              </div>

              <div class="flex items-center md:w-64">
                <div class="w-full bg-white bg-opacity-80 rounded-full mr-2">
                  <div
                    :style="
                      'width: ' + parseInt((step / steps_amount) * 100) + '%'
                    "
                    class="rounded-full bg-green-500 text-xs leading-none h-2 text-center text-white"
                  ></div>
                </div>
                <span class="text-xs tracking-wider w-10 text-gray-300">
                  <!-- {{ parseInt(((step - 1) / steps_amount) * 100) + "%" }} -->
                  {{ step + "/" + steps_amount }}
                </span>
              </div>
            </div>
          </div>
          <!-- /Top Navigation -->

          <!-- Step Content -->
          <div class="max-w-5xl mx-auto py-10">
            <div v-if="step === 1" class="grid grid-cols-2 gap-5 justify-center">
              <div class="">
                <label class="font-medium text-sm mb-1 block" for="firstname"
                >Primer nombre *</label
                >
                <input
                  id="firstname"
                  v-model="user.name"
                  autocomplete="off"
                  class="input"
                  placeholder="Ingrese su nombre..."
                  required
                  type="text"
                />
              </div>

              <div>
                <label class="font-medium text-sm mb-1 block" for="middle_name"
                >Segundo nombre</label
                >
                <input
                  id="middle_name"
                  v-model="user.middle_name"
                  autocomplete="off"
                  class="input"
                  placeholder="Ingrese su segundo nombre..."
                  type="text"
                />
              </div>

              <div class="">
                <label class="font-medium text-sm mb-1 block" for="surname"
                >Primer apellido *</label
                >
                <input
                  id="surname"
                  v-model="user.surname"
                  autocomplete="off"
                  class="input"
                  placeholder="Ingrese su apellido..."
                  required
                  type="text"
                />
              </div>

              <div class="">
                <label
                  class="font-medium text-sm mb-1 block"
                  for="second_surname"
                >Segundo apellido</label
                >
                <input
                  id="second_surname"
                  v-model="user.second_surname"
                  autocomplete="off"
                  class="input"
                  placeholder="Ingrese su segundo apellido..."
                  type="text"
                />
              </div>

              <span
                class="mt-2 col-span-2 text-right  text-sm font-bold text-yellow-200"
              >* campos obligatorios</span
              >
            </div>

            <!-- ------------------------------------------- -->
            <div v-if="step === 2" class="grid grid-cols-2 gap-5">

              <div class="flex flex-col gap-3">
                <div class="col-span-2">
                  <label class="font-medium text-sm mb-1 block" for="ci"
                  >Cédula de identidad</label
                  >
                  <div class="w-2/3">
                    <input
                      id="ci"
                      v-model="user.ci"
                      autocomplete="off"
                      class="input tracking-widest"
                      max="99999999"
                      min="10000000"
                      pattern="^(0|[1-9][0-9]*)$"
                      placeholder="Ingrese su cédula de identidad..."
                      required
                      type="number"
                    />
                  </div>
                  <span class="text-xs leading-3 pl-1"
                  >* Sín puntos ni guiones. Ej: 56478622</span
                  >
                </div>

                <div class="">
                  <label class="font-medium text-sm mb-1 block" for="code"
                  >Código de grupo</label
                  >
                  <div class="flex items-center gap-2">
                    <input
                      id="code"
                      v-model="user.group_code"
                      :class="group && group.code === user.group_code ? 'ring-2 ring-green-500' : ''"
                      autocomplete="off"
                      class="input w-2/3 transition-all"
                      placeholder="Ingrese el codigo del grupo..."
                      required
                      type="text"
                    />
                    <div>
                      <SpinnerLoader v-show="loaders.group"/>
                      <span v-show="group && !loaders.group && user.group_code.length === 8"
                            class="material-icons text-green-500">check</span>
                      <span
                        v-show="((!group && user.group_code.length === 8) || (group && user.group_code.length !== 8 ) || (group && group.code !== user.group_code)) && !loaders.group && user.group_code.length !== 0"
                        class="material-icons text-red-500">close</span>
                    </div>
                  </div>

                  <span class="text-xs text-yellow-400 font-medium pl-1"
                  >
                    Código de grupo que le porporcionó el administrador
                  </span>
                </div>
              </div>

              <transition name="fade">
                <div v-if="group && group.code === user.group_code">
                  <div class="bg-gray-700 rounded-xl p-2 bg-opacity-40">
                    <p class="text-center">Grupo al que te unirás</p>
                    <div class="mt-2 px-5 flex justify-evenly">
                      <div>
                        <span class="block text-xs">Grupo</span>
                        <p class="text-indigo-500 text-2xl font-bold">{{ group.year }}{{ group.name }}</p>
                      </div>
                      <div>
                        <span class="block text-xs">Orientación</span>
                        <p class="font-medium text-xl">{{ group.orientation_name }}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </transition>

            </div>

            <!-- -------------------------------------------  -->

            <div v-if="step === 3" class="flex items-center gap-5">
              <div class="w-1/4 mx-10">
                <transition>
                  <img
                    :src="require('@/assets/avatars/' + user.avatar)"
                    alt="user_avatar"
                    class="w-90per mx-auto"
                  />
                </transition>
                <button class="mt-4 btn-info mx-auto block text-xs border-0" type="button"
                        @click="this.$refs.theModal.openModal()/*openModal()*/">
                  Cambiar avatar
                </button>
              </div>
              <div class="w-9/12">
                <div class="mb-5">
                  <label class="font-medium text-sm mb-1 block" for="nickname"
                  >Nombre de usuario</label
                  >
                  <div class="flex items-center gap-2">
                    <input
                      id="nickname"
                      v-model="user.nickname"
                      :class="!nicknameIsTaken ? (user.nickname !== '' ? 'ring-2 ring-green-500' : '') : 'ring-2 ring-red-500'"
                      autocomplete="off"
                      class="input max-w-sm"
                      minlength="4"
                      placeholder="Ingrese su nickname..."
                      required
                      type="text"
                    />
                    <span v-if="!nicknameIsTaken && user.nickname !== ''"
                          class="material-icons text-green-500">check</span>
                    <span v-else-if="user.nickname !== ''" class="material-icons text-red-500">close</span>
                  </div>
                  <span v-show="nicknameIsTaken" class="text-xs text-red-500 font-medium">El nombre de usuario ya esta tomado</span>
                </div>
                <div class="">
                  <label class="font-medium text-sm mb-1 block" for="email"
                  >Email</label
                  >
                  <input
                    id="email"
                    v-model="user.email"
                    autocomplete="off"
                    class="input "
                    minlength="4"
                    placeholder="Ingrese su correo electrónico..."
                    required
                    type="email"
                  />
                </div>
              </div>
            </div>

            <TheModal ref="theModal" closeButtonText="Seleccionar" title="Cambiar avatar">
              <div class="my-10">
                <div class="flex justify-center flex-wrap gap-3 px-5 mt-2">
                  <button
                    v-for="avatar_data in avatars"
                    :id="avatar_data.id"
                    :key="avatar_data.id"
                    class="w-16 transition duration-200 ease-in-out hover:bg-opacity-20 focus:bg-opacity-30 transform bg-white rounded-xl bg-opacity-10 cursor-pointer"
                    type="button"
                    @click="selectAvatar(avatar_data.id)"
                  >
                    <img
                      :src="require('@/assets/avatars/' + avatar_data.file)"
                      alt="avatar"
                      class="max-h-14 my-3 mx-1"
                    />
                  </button>
                </div>
              </div>
            </TheModal>

            <!-- -------------------------------------------  -->
            <div v-if="step === 4" class="grid grid-cols-2 gap-5">
              <div class="">
                <label class="font-medium text-sm mb-1 block" for="password"
                >Contraseña</label
                >
                <input
                  id="password"
                  v-model="user.password"
                  autocomplete="off"
                  class="input"
                  minlength="8"
                  placeholder="Ingrese una contraseña..."
                  required
                  type="password"
                />

                <ul class="text-xs mt-1">
                  <li>
                    * Mínimo 6 caracteres
                  </li>
                </ul>
              </div>
              <div class="">
                <label class="font-medium text-sm mb-1 block" for="password"
                >Confirmar contraseña</label
                >
                <div class="flex items-center">
                  <input
                    id="confirm_password"
                    v-model="user.confirm_password"
                    :class="
                      user.password === user.confirm_password &&
                      user.password !== ''
                        ? 'ring-2 ring-green-500'
                        : (user.confirm_password !== '' ? 'ring-2 ring-red-500' : '')
                    "
                    autocomplete="off"
                    class="input"
                    minlength="8"
                    placeholder="Repita la contraseña..."
                    required
                    type="password"
                  />
                  <span
                    :class="
                      user.password === user.confirm_password &&
                      user.password !== ''
                        ? 'opacity-100'
                        : 'opacity-0'
                    "
                    class="material-icons ml-2 text-3xl text-green-500 transition-all"
                  >check</span
                  >
                </div>
              </div>
            </div>
          </div>
          <!-- / Step Content -->
        </div>
      </div>

      <!-- Bottom Navigation -->
      <div v-show="step !== 'complete'" class="py-5">
        <div class="w-9/12 mx-auto px-4 ">
          <div class="flex justify-between">
            <div class="w-1/2 flex">
              <a
                v-show="step > 1"
                class="btn-warning flex items-center pr-5 pl-3 py-1.5 select-none"
                @click.prevent="previusStep()"
              >
                <span class=" mr-2 material-icons text-lg">
                  arrow_back
                </span>
                Paso anterior
              </a>
            </div>

            <div class="w-1/2 flex justify-end">
              <button
                v-show="step < steps_amount"
                :class="!validateDataByStep ? 'btn-disabled' : ''"
                :disabled="!validateDataByStep"
                class="btn-info pl-5 pr-3 py-1.5 flex items-center select-none"
              >
                Siguiente
                <span class="material-icons text-lg ml-2">
                  arrow_forward
                </span>
              </button>

              <div>
                <span>

                </span>
                <button
                  v-show="step === steps_amount"
                  id="create_user_button"
                  class="btn-success px-5 py-1.5"
                  type="button"
                  @click="create()"
                >
                  Completar registro
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- / Bottom Navigation https://placehold.co/300x300/e2e8f0/cccccc -->
    </form>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import TheModal from "@/components/TheModal";
import SpinnerLoader from '@/components/SpinnerLoader'
/*import { showAlert } from "../utils/alerts";*/

export default {
  name: "UserRegistration",
  data: () => {
    return {
      step: 2,
      steps_amount: 4,
      togglePassword: false,
      selectedAvatar: null,
      loaders: {
        group: false,
      },
      user: {
        /* ci: null, */
        ci: 52650714,
        nickname: "lucaspintos",
        name: "Lucas",
        middle_name: "Mateo",
        surname: "Pintos",
        second_surname: "Fitipaldi",
        group_code: "",
        type: 'teacher',
        email: "lucaspintos9090@gmail.com",
        avatar: "01-man.svg",
        password: "mnoseadmin1234",
        confirm_password: "mnoseadmin1234",
      },
      avatars: [
        {id: 1, file: "01-man.svg"},
        {id: 2, file: "02-boy.svg"},
        {id: 3, file: "03-woman.svg"},
        {id: 4, file: "04-boy-1.svg"},
        {id: 5, file: "05-girl-1.svg"},
        {id: 6, file: "06-woman-3.svg"},
        {id: 7, file: "07-boy-2.svg"},
      ],
    };
  },
  components: {
    TheModal,
    SpinnerLoader
  },
  watch: {
    'user.group_code': function () {
      this.validateGroupCode()
    }
  },
  computed: {
    ...mapState({
      group: (state) => state.user.group_data,
    }),
    nicknameIsTaken: function () {
      /*return this.users.find(user => user.nickname === this.user.nickname);*/
      return false;
    },
    validateDataByStep: function(){
      let isOk = false;
      if(this.step === 3 && !this.nicknameIsTaken){
        isOk = true;
      }
      if(this.step === 2 && this.group && this.group.code === this.user.group_code){
        isOk = true;
      }
      if(this.step === 1 || this.step === 4){
        isOk = true;
      }
      return isOk;
    }
  },
  created() {
    /*if (this.users.length === 0) {
      this.getUsers();
    }*/
  },
  methods: {
    ...mapActions(["createUser", "getGroupByCode"]),

    nextStep() {
      if (this.step === this.steps_amount) {
        this.step = "complete";
      } else if (this.step === "complete") {
        this.step = 1;
      } else {
        this.step++;
      }
    }
    ,
    previusStep() {
      this.step--;
    },
    validateGroupCode() {
      // Para que valide el codigo solo si tiene 8 caracteres
      if (this.user.group_code.length === 8) {
        this.loaders.group = true;
        this.getGroupByCode(this.user.group_code).then(() => {
          setTimeout(() => {
            this.loaders.group = false;
          }, 100)
        })
      }
    }
    ,
    create() {
      if (this.validateData()) {
        this.user.ci = this.user.ci.toString();
        this.createUser(this.user);

        let button = document.getElementById('create_user_button');
        button.disabled = true;
        button.classList.replace('btn-success', 'btn-disabled');

        setTimeout(() => {
          button.disabled = false;
          button.classList.replace('btn-disabled', 'btn-success');
        }, 1500);
        setTimeout(() => {
          this.nextStep();
        }, 1000);

      }
    },
    validateData() {
      let isOk = true;
      Object.values(this.user).forEach(element => {
        if (element.toString() === '') {
          isOk = false;
        }
      });
      return isOk;
    }
    ,
    selectAvatar(id) {
      let selectedAvatar = document.getElementById(id);
      this.selectedAvatar = id;

      this.avatars.forEach((avatar) => {
        let avatarAny = document.getElementById(avatar.id);

        avatarAny.classList.remove("scale-110");
        avatarAny.classList.remove("bg-opacity-30");
        avatarAny.classList.add("hover:bg-opacity-20");

        if (avatar.id === id) {
          selectedAvatar.classList.remove("hover:bg-opacity-20");
          this.user.avatar = avatar.file;
        }
      });

      selectedAvatar.classList.add("scale-110");
      selectedAvatar.classList.add("bg-opacity-30");
    },
  }
  ,
}
;
</script>


<style scoped>
.input {
  @apply block w-full font-normal text-lg bg-white bg-opacity-20 hover:bg-opacity-30 focus:bg-opacity-30 transition-all outline-none rounded-lg px-2 py-2;
}

label {
  @apply select-none;
}

span {
  @apply select-none;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
