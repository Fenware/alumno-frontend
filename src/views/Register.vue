<template>
  <div
    class="antialiased sans-serif text-white h-full  items-center flex flex-col"
  >
    <h2
      v-show="step !== 'complete'"
      class="font-semibold text-center text-3xl pt-2"
    >
      {{getWord({file:'register',word:'student_register',lang})}}
    </h2>

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
                {{getWord({file:'register',word:'succes_register',lang})}}
              </h2>

              <div class="text-white text-center my-8">
                <p>
                  ¡{{ user.name }} {{ user.surname }} {{getWord({file:'register',word:'succes_register_name',lang})}}
                </p>
                <p>
                  {{getWord({file:'register',word:'wait_admin',lang})}}
                </p>
              </div>

              <div class="flex justify-around mt-10">
                <router-link
                  :to="{ name: 'Login' }"
                  class="btn-info text-md px-4 py-1 mx-auto"
                  type="button"
                >
                  {{getWord({file:'register',word:'back_to_login',lang})}}
                </router-link>
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
              <span>{{getWord({file:'register',word:'step',lang})}}: {{ step }} {{getWord({file:'register',word:'of',lang})}} 4</span>
            </div>
            <div
              class="flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div class="flex-1">
                <div v-show="step === 1">
                  <div class="text-xl font-bold leading-tight">
                    {{getWord({file:'register',word:'personal_data',lang})}}
                  </div>
                </div>

                <div v-show="step === 2">
                  <div class="text-xl font-bold leading-tight">
                    {{getWord({file:'register',word:'join_group',lang})}}
                  </div>
                </div>

                <div v-show="step === 3">
                  <div class="text-lg font-bold leading-tight">
                    {{getWord({file:'register',word:'user_profile',lang})}}
                  </div>
                </div>

                <div v-show="step === 4">
                  <div class="text-lg font-bold leading-tight">
                    {{getWord({file:'register',word:'account_security',lang})}}
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
            <div
              v-if="step === 1"
              class="grid grid-cols-2 gap-5 justify-center"
            >
              <div class="">
                <label class="font-medium text-sm mb-1 block" for="firstname"
                  >{{getWord({file:'user',word:'first_name',lang})}} *</label
                >
                <input
                  id="firstname"
                  v-model="user.name"
                  autocomplete="off"
                  class="input"
                  :placeholder="getWord({file:'register',word:'enter_name',lang})"
                  required
                  type="text"
                />
              </div>

              <div>
                <label class="font-medium text-sm mb-1 block" for="middle_name"
                  >{{getWord({file:'user',word:'middle_name',lang})}}</label
                >
                <input
                  id="middle_name"
                  v-model="user.middle_name"
                  autocomplete="off"
                  class="input"
                  :placeholder="getWord({file:'register',word:'enter_middle_name',lang})"
                  type="text"
                />
              </div>

              <div class="">
                <label class="font-medium text-sm mb-1 block" for="surname"
                  >{{getWord({file:'user',word:'surname',lang})}} *</label
                >
                <input
                  id="surname"
                  v-model="user.surname"
                  autocomplete="off"
                  class="input"
                  :placeholder="getWord({file:'register',word:'enter_surname',lang})"
                  required
                  type="text"
                />
              </div>

              <div class="">
                <label
                  class="font-medium text-sm mb-1 block"
                  for="second_surname"
                  >{{getWord({file:'user',word:'second_surname',lang})}}</label
                >
                <input
                  id="second_surname"
                  v-model="user.second_surname"
                  autocomplete="off"
                  class="input"
                  :placeholder="getWord({file:'register',word:'enter_second_surname',lang})"
                  type="text"
                />
              </div>

              <span
                class="mt-2 col-span-2 text-right  text-sm font-bold text-yellow-200"
                >{{getWord({file:'lang',word:'required_fields',lang})}}</span
              >
            </div>

            <!-- ------------------------------------------- -->
            <div v-if="step === 2" class="grid grid-cols-2 gap-5">
              <div class="flex flex-col gap-3">
                <div class="col-span-2 relative">
                  <label class="font-medium text-sm mb-1 block" for="ci"
                    >{{getWord({file:'user',word:'identification_document',lang})}}</label
                  >
                  <div class="w-2/3">
                    <input
                      id="ci"
                      v-model="user.ci"
                      autocomplete="off"
                      class="input placeholder"
                      :class="
                        user.ci.toString().length === 8 &&
                        !ciIsTaken &&
                        ciIsValid
                          ? 'ring-2 ring-green-500'
                          : user.ci.toString().length === 8
                          ? 'ring-2 ring-red-500'
                          : ''
                      "
                      max="99999999"
                      min="10000000"
                      pattern="^(0|[1-9][0-9]*)$"
                      :placeholder="getWord({file:'register',word:'enter_id',lang})"
                      required
                      type="number"
                    />
                  </div>
                  <transition name="fade" type="out-in">
                    <span
                      v-if="user.ci.toString().length === 8 && !ciIsValid"
                      class="mt-1 text-red-500 font-medium absolute text-sm pl-1"
                    >
                      {{ getWord({file:'register',word:'non_valid_id',lang}) }}
                    </span>
                    <span
                      v-else-if="user.ci.toString().length === 8 && ciIsTaken"
                      class="mt-1 text-red-500 font-medium absolute text-sm pl-1"
                    >
                      {{ getWord({file:'register',word:'taken_id',lang}) }}
                    </span>
                    <span v-else class="mt-1 absolute text-xs pl-1">
                      {{ getWord({file:'register',word:'ej_id',lang}) }}
                    </span>
                  </transition>
                </div>

                <div class="mt-5">
                  <label class="font-medium text-sm mb-1 block" for="code"
                    >{{getWord({file:'register',word:'group_code',lang})}}</label
                  >
                  <div class="flex items-center gap-2">
                    <input
                      id="code"
                      v-model="user.group"
                      :class="
                        group && group.code === user.group
                          ? 'ring-2 ring-green-500'
                          : user.group.length > 0
                          ? 'ring-2 ring-red-500'
                          : ''
                      "
                      autocomplete="off"
                      class="input w-2/3 transition-all"
                      :placeholder="getWord({file:'register',word:'enter_code',lang})"
                      required
                      type="text"
                    />
                    <div>
                      <SpinnerLoader v-show="loaders.group" />
                      <span
                        v-show="
                          group &&
                            group.code === user.group &&
                            !loaders.group &&
                            user.group.length === 8
                        "
                        class="material-icons text-green-500"
                        >check</span
                      >
                      <span
                        v-show="
                          ((!group && user.group.length === 8) ||
                            (group && user.group.length !== 8) ||
                            (group && group.code !== user.group)) &&
                            !loaders.group &&
                            user.group.length !== 0
                        "
                        class="material-icons text-red-500"
                        >close</span
                      >
                    </div>
                  </div>

                  <span class="text-xs text-yellow-400 font-medium pl-1">
                    {{getWord({file:'register',word:'admin_group',lang})}}
                  </span>
                </div>
              </div>

              <transition name="fade">
                <div v-if="group && group.code === user.group">
                  <div class="bg-gray-700 rounded-xl p-2 bg-opacity-40">
                    <p class="text-center">Grupo al que te unirás</p>
                    <div class="mt-2 px-5 flex justify-evenly">
                      <div>
                        <span class="block text-xs">Grupo</span>
                        <p class="text-indigo-500 text-2xl font-bold">
                          {{ group.year }}{{ group.name }}
                        </p>
                      </div>
                      <div>
                        <span class="block text-xs">Orientación</span>
                        <p class="font-medium text-xl">
                          {{ group.orientation_name }}
                        </p>
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
                <button
                  class="mt-4 btn-info mx-auto block text-xs border-0"
                  type="button"
                  @click="this.$refs.theModal.openModal()"
                >
                  {{getWord({file:'register',word:'change_avatar',lang})}}
                </button>
              </div>
              <div class="w-9/12">
                <div class="mb-5 relative">
                  <label class="font-medium text-sm mb-1 block" for="nickname"
                    >{{getWord({file:'user',word:'nickname',lang})}}</label
                  >
                  <div class="flex items-center gap-2">
                    <input
                      id="nickname"
                      v-model="user.nickname"
                      :class="
                        !nicknameIsTaken
                          ? user.nickname.length >= 4 && user.nickname !== ''
                            ? 'ring-2 ring-green-500'
                            : ''
                          : user.nickname !== '' && user.nickname.length >= 4
                          ? 'ring-2 ring-red-500'
                          : ''
                      "
                      autocomplete="off"
                      class="input max-w-sm"
                      minlength="4"
                      :placeholder="getWord({file:'register',word:'enter_nickname',lang})"
                      required
                      type="text"
                    />
                    <SpinnerLoader v-show="loaders.nickname" />

                    <span
                      v-if="
                        !nicknameIsTaken &&
                          user.nickname !== '' &&
                          user.nickname.length >= 4 &&
                          !loaders.nickname
                      "
                      class="material-icons text-green-500"
                      >check</span
                    >
                    <span
                      v-else-if="!loaders.nickname && user.nickname.length >= 4"
                      class="material-icons text-red-500"
                      >close</span
                    >
                  </div>
                  <span
                    v-show="
                      nicknameIsTaken &&
                        !loaders.nickname &&
                        user.nickname.length >= 4
                    "
                    class="text-sm mt-1 absolute text-red-500 font-medium"
                    > {{getWord({file:'register',word:'taken_nickname',lang})}}</span
                  >
                </div>
                <div class="relative mt-10">
                  <label class="font-medium text-sm mb-1 block" for="email"
                    >{{getWord({file:'user',word:'email',lang})}}</label
                  >
                  <div class="flex items-center">
                    <input
                      id="email"
                      v-model="user.email"
                      autocomplete="off"
                      class="input "
                      :class="
                        emailIsTaken && user.email !== ''
                          ? 'ring-2 ring-red-500'
                          : ''
                      "
                      minlength="4"
                      :placeholder="getWord({file:'register',word:'enter_email',lang})"
                      required
                      type="email"
                    />
                    <span
                      v-show="emailIsTaken && user.email !== ''"
                      class="material-icons ml-2 text-red-500"
                      >warning_amber</span
                    >
                  </div>
                  <p
                    v-show="emailIsTaken && user.email !== ''"
                    class="flex items-center mt-1 ml-1 absolute font-medium text-sm text-red-500 "
                  >
                   {{getWord({file:'register',word:'taken_email',lang})}}
                  </p>
                </div>
              </div>
            </div>

            <TheModal
              ref="theModal"
              closeButtonText="Seleccionar"
              title="Cambiar avatar"
            >
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
                  >{{getWord({file:'user',word:'password',lang})}}</label
                >
                <input
                  id="password"
                  v-model="user.password"
                  autocomplete="off"
                  class="input"
                  minlength="8"
                  :placeholder="getWord({file:'register',word:'enter_password',lang})"
                  required
                  type="password"
                />

                <ul class="text-xs mt-1">
                  <li>
                    {{getWord({file:'register',word:'password_restriction',lang})}}
                  </li>
                </ul>
              </div>
              <div class="">
                <label class="font-medium text-sm mb-1 block" for="password"
                  >{{getWord({file:'register',word:'password_confirm',lang})}}</label
                >
                <div class="flex items-center">
                  <input
                    id="confirm_password"
                    v-model="user.confirm_password"
                    :class="
                      user.password === user.confirm_password &&
                      user.password !== ''
                        ? 'ring-2 ring-green-500'
                        : user.confirm_password !== ''
                        ? 'ring-2 ring-red-500'
                        : ''
                    "
                    autocomplete="off"
                    class="input"
                    minlength="8"
                    :placeholder="getWord({file:'register',word:'password_confirm',lang})"
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
                {{ getWord({file:'register',word:'back_step',lang}) }}
              </a>
            </div>

            <div class="w-1/2 flex justify-end">
              <button
                v-show="step < steps_amount"
                :class="!validateDataByStep ? 'btn-disabled' : ''"
                :disabled="!validateDataByStep"
                class="btn-info pl-5 pr-3 py-1.5 flex items-center select-none"
              >
                {{ getWord({file:'register',word:'next_step',lang}) }}
                <span class="material-icons text-lg ml-2">
                  arrow_forward
                </span>
              </button>

              <div>
                <span> </span>
                <button
                  v-show="step === steps_amount"
                  id="create_user_button"
                  class="btn-success px-5 py-1.5"
                  type="button"
                  @click="create()"
                >
                  {{ getWord({file:'register',word:'complete',lang}) }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- / Bottom Navigation https://placehold.co/300x300/e2e8f0/cccccc -->
    </form>
    <ToggleLanguageButton class="absolute top-0 right-0 m-2"/>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import TheModal from "@/components/TheModal";
import SpinnerLoader from "@/components/SpinnerLoader";
import { getWord } from "@/utils/lang";
import ToggleLanguageButton from '@/components/ToggleLanguageButton.vue';
/*import { showAlert } from "../utils/alerts";*/

export default {
  name: "UserRegistration",
  data: () => {
    return {
      step: 1,
      steps_amount: 4,
      togglePassword: false,
      selectedAvatar: null,
      loaders: {
        group: false,
        nickname: false,
        email: false,
        ci: false,
      },
      user: {
        ci: "",
        nickname: "",
        name: "",
        middle_name: "",
        surname: "",
        second_surname: "",
        group: "",
        type: "student",
        email: "",
        avatar: "01-man.svg",
        password: "",
        confirm_password: "",
      },
      avatars: [
        { id: 1, file: "01-man.svg" },
        { id: 2, file: "02-boy.svg" },
        { id: 3, file: "03-woman.svg" },
        { id: 4, file: "04-boy-1.svg" },
        { id: 5, file: "05-girl-1.svg" },
        { id: 6, file: "06-woman-3.svg" },
        { id: 7, file: "07-boy-2.svg" },
      ],
    };
  },
  components: {
    TheModal,
    SpinnerLoader,
    ToggleLanguageButton,
  },
  watch: {
    "user.group": function() {
      this.validateGroupCode();
    },
    "user.nickname": function() {
      this.validateNickname();
    },
    "user.ci": function() {
      this.validateUserCi();
    },
    "user.email": function() {
      this.validateEmail();
    },
  },
  computed: {
    ...mapState({
      group: (state) => state.user.group_data,
      nicknameIsTaken: (state) => state.user.nicknameIsTaken,
      emailIsTaken: (state) => state.user.emailIsTaken,
      ciIsTaken: (state) => state.user.ciIsTaken,
      ciIsValid: (state) => state.user.ciIsValid,
      registration_state: (state) => state.user.registration_state,
      lang: (state) => state.lang,
    }),
    validateDataByStep: function() {
      let isOk = false;
      if (this.step === 3 && !this.nicknameIsTaken && !this.emailIsTaken) {
        isOk = true;
      }
      if (this.step === 2) {
        if (
          this.group &&
          this.group.code === this.user.group &&
          !this.ciIsTaken &&
          this.ciIsValid
        )
          isOk = true;
      }
      if (this.step === 1 || this.step === 4) {
        isOk = true;
      }
      return isOk;
    },
  },
  created() {
    /*if (this.users.length === 0) {
      this.getUsers();
    }*/
  },
  methods: {
    ...mapActions([
      "createUser",
      "getGroupByCode",
      "validateUserNickname",
      "validateUserEmail",
      "validateUserCiIsTaken",
      "validateCi",
    ]),

    nextStep() {
      if (this.step === this.steps_amount) {
        this.step = "complete";
      } else if (this.step === "complete") {
        this.step = 1;
      } else {
        this.step++;
      }
    },
    previusStep() {
      this.step--;
    },
    validateGroupCode() {
      // Para que valide el codigo solo si tiene 8 caracteres
      if (this.user.group.length === 8) {
        this.loaders.group = true;
        this.getGroupByCode(this.user.group).then(() => {
          this.loaders.group = false;
        });
      }
    },
    validateUserCi() {
      // Para que valide el codigo solo si tiene 8 caracteres
      if (this.user.ci.toString().length === 8) {
        this.loaders.ci = true;
        this.validateCi(this.user.ci.toString()).then(() => {
          if (this.ciIsValid) {
            this.validateUserCiIsTaken(this.user.ci.toString()).then(() => {
              this.loaders.ci = false;
            });
          } else {
            this.loaders.ci = false;
          }
        });
      }
    },
    validateNickname() {
      // Para que valide el nickname solo si tiene 8 caracteres
      if (this.user.nickname.length >= 4) {
        this.loaders.nickname = true;
        this.validateUserNickname(this.user.nickname).then(() => {
          setTimeout(() => {
            this.loaders.nickname = false;
          }, 100);
        });
      }
    },
    validateEmail() {
      this.loaders.group = true;
      this.validateUserEmail(this.user.email).then(() => {
        setTimeout(() => {
          this.loaders.email = false;
        }, 100);
      });
    },
    create() {
      if (this.validateData()) {
        let button = document.getElementById("create_user_button");
        button.disabled = true;
        button.classList.replace("btn-success", "btn-disabled");

        this.user.ci = this.user.ci.toString();
        this.createUser(this.user).then(() => {
          if (this.registration_state) {
            setTimeout(() => {
              button.disabled = false;
              button.classList.replace("btn-disabled", "btn-success");
            }, 1500);
            setTimeout(() => {
              this.nextStep();
            }, 2000);
          } else {
            setTimeout(() => {
              button.disabled = false;
              button.classList.replace("btn-disabled", "btn-success");
            }, 1500);
          }
        });
      }
    },
    validateData() {
      let isOk = true;
      let keys = Object.keys(this.user);
      Object.values(this.user).forEach((element, index) => {
        if (
          element.toString() === "" &&
          keys[index] != "middle_name" &&
          keys[index] != "second_surname"
        ) {
          isOk = false;
        }
      });
      return isOk;
    },
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
    getWord,
  },
};
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
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
