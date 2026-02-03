<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonInput, IonSelect, IonSelectOption, IonTextarea,
  IonButton, IonItem, IonCard, IonCardContent,
  alertController, toastController
} from '@ionic/vue';

import { useRoute, useRouter } from 'vue-router';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase';

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;

/* ===== STATE ===== */
const title = ref('');
const amount = ref<number | null>(null);
const type = ref<'income' | 'expense'>('expense');
const category = ref('');
const note = ref('');

/* ===== LOAD DATA ===== */
onMounted(async () => {
  const snap = await getDoc(doc(db, 'expenses', id));
  if (snap.exists()) {
    const d = snap.data();
    title.value = d.title;
    amount.value = d.amount;
    type.value = d.type;
    category.value = d.category;
    note.value = d.note;
  }
});

/* ===== UPDATE ===== */
const updateExpense = async () => {
  await updateDoc(doc(db, 'expenses', id), {
    title: title.value,
    amount: Number(amount.value),
    type: type.value,
    category: category.value,
    note: note.value
  });

  const toast = await toastController.create({
    message: 'อัปเดตข้อมูลแล้ว',
    duration: 1500,
    color: 'success'
  });
  toast.present();

  router.back();
};

/* ===== DELETE ===== */
const confirmDelete = async () => {
  const alert = await alertController.create({
    header: 'ลบรายการนี้?',
    message: 'ไม่สามารถกู้คืนข้อมูลได้',
    buttons: [
      { text: 'ยกเลิก', role: 'cancel' },
      {
        text: 'ลบ',
        role: 'destructive',
        handler: async () => {
          await deleteDoc(doc(db, 'expenses', id));
          router.back();
        }
      }
    ]
  });

  alert.present();
};
</script>

<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="header-glass">
        <ion-title>แก้ไขรายการ</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="bg-fancy">

      <ion-card class="form-card">
        <ion-card-content>

          <ion-item class="input-line">
            <ion-input v-model="title" placeholder="ชื่อรายการ" />
          </ion-item>

          <ion-item class="input-line">
            <ion-input
              v-model="amount"
              type="number"
              placeholder="จำนวนเงิน"
            />
          </ion-item>

          <ion-item class="input-line">
            <ion-select v-model="type">
              <ion-select-option value="income">รายรับ</ion-select-option>
              <ion-select-option value="expense">รายจ่าย</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item class="input-line">
            <ion-select v-model="category">
              <ion-select-option value="อาหาร">อาหาร</ion-select-option>
              <ion-select-option value="เดินทาง">เดินทาง</ion-select-option>
              <ion-select-option value="อื่นๆ">อื่นๆ</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item class="input-line no-line">
            <ion-textarea v-model="note" placeholder="หมายเหตุ" auto-grow />
          </ion-item>

        </ion-card-content>
      </ion-card>

      <ion-button expand="block" class="save-btn" @click="updateExpense">
        บันทึกการแก้ไข
      </ion-button>

      <ion-button
        expand="block"
        fill="outline"
        color="danger"
        class="delete-btn"
        @click="confirmDelete"
      >
        ลบรายการ
      </ion-button>

    </ion-content>
  </ion-page>
</template>

<style scoped>
.bg-fancy {
  --background: linear-gradient(180deg, #0f172a, #020617);
}
.header-glass {
  --background: rgba(15,23,42,0.7);
  backdrop-filter: blur(10px);
  --color: #fff;
}
.form-card {
  margin: 20px;
  border-radius: 24px;
  background: rgba(255,255,255,0.08);
}
.input-line {
  --background: transparent;
  --inner-border-color: rgba(255,255,255,0.2);
  color: #fff;
}
.no-line {
  --inner-border-width: 0;
}
.save-btn {
  margin: 20px;
  --border-radius: 16px;
}
.delete-btn {
  margin: 0 20px 30px;
}
</style>
