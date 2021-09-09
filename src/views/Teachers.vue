<template>
  <div>
    <h2 class="text-white text-center text-3xl font-semibold pt-1">
      Tus profesores
    </h2>

    <div
      class="grid grid-cols-3 gap-4 m-10 mb-0 p-5
       text-white bg-gray-700 border-2 border-gray-600 rounded-xl overflow-y-auto"
      style="height: 75vh;"
    >
      <div
        v-for="teacher in teachers"
        :key="teacher.id"
        class="py-3 bg-gray-800 bg-opacity-70 border-2 border-gray-500 rounded-xl shadow-xl"
        style="height: fit-content;"
      >
        <div class="flex items-center px-5">
          <div>
            <img
              class="w-16"
              :src="require('@/assets/avatars/' + teacher.avatar)"
            />
          </div>
          <div class="ml-2">
            <p class="font-bold text-lg ml-2">
              {{ teacher.name }} {{ teacher.surname }}
            </p>
            <p class="font-medium ml-2">{{ teacher.email }}</p>
          </div>
        </div>

        <div class="flex gap-2 mt-5 mx-2 overflow-x-auto">
          <p
            class="min-w-max bg-blue-500 rounded-md px-2 mb-1 select-none"
            v-for="subject in teacher.subjects"
            :key="subject.id"
          >
            {{ subject.name }}
          </p>
        </div>

        <div class="mt-8">
          <p class="pl-3 font-bold select-none">Horarios de disponibilidad</p>
          <div class="m-5">
            <p
              class="grid grid-cols-5"
              v-for="day in teacher.schedule"
              :key="day.day"
            >
              <span class=" col-span-2">{{ days[day.day] }}</span>
              <span class="col-span-3 text-sm">
                De: {{ getHour(day.start_hour) }} Hasta:
                {{ getHour(day.end_hour) }}</span
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Teachers",
  data: function() {
    return {
      days: {
        "1": "Lunes",
        "2": "Martes",
        "3": "Miércoles",
        "4": "Jueves",
        "5": "Viernes",
      },
    };
  },
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
    getHour(hour) {
      return hour.substring(0, 5);
    },
  },
};
</script>

<style></style>
