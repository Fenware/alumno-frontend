<template>
  <div
    class="w-72 text-white h-full rounded-3xl | bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl shadow-2xl"
  >
    <div class="truncate">
      <h3 class="font-bold px-1 text-xl text-center pt-2">Consultas activas</h3>
    </div>
    <div class="flex justify-start items-center mt-2">
      <button 
      @click="syncConsultations()"
      class="bg-gray-700 hover:bg-gray-600 transition-colors ease-linear text-xs mx-2 px-2  rounded-full border-2 border-gray-400">
        Actualizar
        <i class="fas fa-sync-alt "></i>
      </button>
    </div>
    <div class="mt-3 p-2 h-5/6 overflow-y-auto">
      <ConsultationsContainer/>
    </div>
  </div>
</template>

<script>
import ConsultationsContainer from '@/components/ConsultationsContainer.vue';
export default {
  name: "SidebarComponent",
  components:{
    ConsultationsContainer,
  },
  
};
</script>

<style></style>
