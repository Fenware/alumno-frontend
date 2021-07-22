<template>
  <div
    class=" text-white rounded-3xl | bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl"
  >
    <p v-show="group == null" class="text-center text-xl my-1">
      Unite a un grupo
    </p>
    <p v-show="group != null" class="text-center text-xl my-1">Tu grupo</p>
    <div v-if="group == null" class="m-3 mb-1">
      <div>
        <input
          type="text"
          placeholder="Código de grupo"
          v-model="group_code"
          class="w-96 mr-2 py-2 px-2 | bg-white transition duration-300 focus:bg-opacity-20 hover:bg-opacity-20 bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl | rounded-2xl  outline-none placeholder-white"
        />
        <button
          @click="takeGroup()"
          class="ml-2 pr-2 | bg-green-400 bg-opacity-10 backdrop-filter backdrop-blur-xl transition duration-300 focus:bg-opacity-20 hover:bg-opacity-20 shadow-2xl | rounded-2xl"
        >
          <i
            class="fas fa-plus text-white text-md py-3 pl-3 | filter drop-shadow-xl"
          ></i>
          Unirse
        </button>
      </div>
      <span class="text-xs ml-2 text-yellow-200"
        >* Código de grupo que te proporcionaron los administradores</span
      >
    </div>

    <div class="" v-else>
      <div class="flex">
        <p
          class="m-3 mb-1 px-5 bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl rounded-full"
        >
          Grupo: <span class="font-bold">{{ group.group_name }}</span>
        </p>
      </div>

      <div class="flex">
        <p
          class="flex m-3 mt-1 px-5 bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl rounded-full"
        >
          Orientacion:
          <span class="font-bold ml-1">{{ group.orientation_name }} </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapMutations, mapState } from "vuex";

export default {
  name: "Groups",
  data: function() {
    return {
      group_code: "",
    };
  },
  computed: {
    ...mapState(["API_URL", "headers", "group"])
  },
  created() {
    this.getUserGroup();
  },
  methods: {
    ...mapMutations(['setGroup']),
    async getUserGroup() {
      await axios({
        method: "get",
        url: this.API_URL + "/user-grupo",
        headers: this.headers,
      })
        .then((res) => {
          console.log(res);
          if (Array.isArray(res.data) && res.data.length > 0) {
            this.setGroup(res.data[0]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async takeGroup() {
      let data = {
        code: this.group_code,
      };

      await axios({
        method: "post",
        url: this.API_URL + "/user-grupo",
        data: data,
        headers: this.headers,
      })
        .then((res) => {
          if (res.data == 1) {
            this.getUserGroup();
          } else {
            console.log("Error: takeGroup -> " + res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style></style>
