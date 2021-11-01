<template>
  <div class="">
    <h1 class="text-white text-center text-3xl font-semibold pt-1">
      {{getWord({file:'lang',word:'student_chathink',lang})}}
    </h1>
    <div class="flex flex-wrap gap-4 mt-10 mx-5">
      <div><Group /></div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions, mapState } from "vuex";
import Group from "@/components/Group.vue";
import { getWord } from "@/utils/lang";


export default {  
  name: "Home",
  components: {
    Group,
  },
  created() {
    this.getUserGroup();
  },
  computed: {
    ...mapState({ 
      lang: (state) => state.lang,
    }),
  },
  methods: {
    ...mapActions(["getUserGroup"]),
    getWord,
  },
};
</script>
