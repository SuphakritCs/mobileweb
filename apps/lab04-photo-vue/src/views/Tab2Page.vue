<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>📸 Photo Gallery</ion-title>
      </ion-toolbar> 
    </ion-header>

    <ion-content :fullscreen="true">

      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Photo Gallery</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Profile Card -->
      <ion-card>
        <ion-card-content class="profile">
          <ion-avatar>
            <img src="/profile.png" />
          </ion-avatar>
          <div>
            <h2>663380403-1</h2>
            <p>นายศุภกฤต สังข์มณีวงศ์</p>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- Gallery -->
      <ion-grid>
        <ion-row>
          <ion-col size="6" v-for="(photo, index) in photos" :key="photo.filepath">
            <ion-card class="photo-card">
              <ion-img :src="photo.webviewPath" />

              <!-- ปุ่มลบ -->
              <ion-button
                size="small"
                color="danger"
                expand="block"
                @click="deletePhoto(index, photo.filepath)"
              >
                ลบรูป
              </ion-button>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Floating Camera Button -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button color="primary" @click="takePhoto">
          <ion-icon :icon="camera" />
        </ion-fab-button>
      </ion-fab>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { usePhotoGallery } from '@/composables/usePhotoGallery';
const { photos, takePhoto, loadSaved, deletePhoto } = usePhotoGallery();
loadSaved();

import { camera } from 'ionicons/icons';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol,
  IonImg, IonCard, IonCardContent, IonAvatar, IonButton
} from '@ionic/vue';
</script>

<style scoped>
.profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.photo-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 12px rgba(0,0,0,.15);
}
</style>
