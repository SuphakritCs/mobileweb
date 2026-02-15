<template>
  <ion-app v-if="ready">
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const ready = ref(false);

onMounted(() => {
  const auth = getAuth();

  // รอ Firebase ตรวจ session ก่อน
  onAuthStateChanged(auth, () => {
    ready.value = true;
  });
});
</script>
