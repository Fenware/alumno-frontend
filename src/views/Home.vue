<template>
  <div class="">
    <h1 class="text-white text-center text-3xl pt-1">Alumno Chathink</h1>
    <div class="flex mt-10 mx-5">
      <Group />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions } from "vuex";
import Group from '@/components/Group.vue';

export default {
  name: "Home",
  components: {
    Group
  },
  created() {
    this.syncToken();
    this.checkSession();
  },
  methods: {
    ...mapActions(["syncToken", "checkSession"]),
    
  },
};
</script>
