<template>
  <div class="">
    <h1 class="text-white text-center text-3xl pt-1">Alumno Chathink</h1>
    <div class="flex flex-wrap gap-4 mt-10 mx-5">
      <div><Group /></div>
      <div>
        <CreateConsultation />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions } from "vuex";
import Group from "@/components/Group.vue";
import CreateConsultation from "@/components/CreateConsultation.vue";

export default {
  name: "Home",
  components: {
    Group,
    CreateConsultation,
  },
  created() {
    this.getUserGroup();
  },
  methods: {
    ...mapActions(["getUserGroup"]),
  },
};
</script>
