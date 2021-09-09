<template>
  <div>
    <h2 class="text-white text-center text-3xl font-semibold pt-1">
      Tus profesores
    </h2>
    <div></div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "Teachers",
  computed: {
    ...mapState({
      teachers: (state) => state.teachers.teachers,
    }),
  },
  created() {
    this.getUserGroup().then(() => {
      this.getTeachers();
    });
  },
  methods: {
    ...mapActions(["getTeachers", "getUserGroup"]),
  },
};
</script>

<style></style>
