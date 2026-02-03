<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonInput, IonSelect, IonSelectOption, IonTextarea,
  IonButton, IonItem, IonCard, IonCardContent,
  IonSegment, IonSegmentButton, toastController
} from '@ionic/vue';

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';

/* ===== STATE ===== */
const title = ref('');
const amount = ref<number | null>(null);
const type = ref<'income' | 'expense'>('expense');
const category = ref('');
const note = ref('');

/* ===== SAVE ===== */
const saveExpense = async () => {
  if (!amount.value || !title.value) {
    const toast = await toastController.create({
      message: 'กรุณากรอกข้อมูลให้ครบ',
      duration: 1800,
      color: 'warning'
    });
    return toast.present();
  }

  await addDoc(collection(db, 'expenses'), {
    title: title.value,
    amount: Number(amount.value),
    type: type.value,
    category: category.value,
    note: note.value,
    createdAt: serverTimestamp()
  });

  title.value = '';
  amount.value = null;
  category.value = '';
  note.value = '';

  const toast = await toastController.create({
    message: 'บันทึกสำเร็จ 🎉',
    duration: 1500,
    color: 'success'
  });
  toast.present();
};
</script>

<template>
  <ion-page>
    <!-- ===== HEADER ===== -->
    <ion-header class="ion-no-border">
      <ion-toolbar class="header-glass">
        <ion-title>เพิ่มรายการ</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="bg-fancy">

      <!-- ===== SEGMENT ===== -->
      <ion-segment v-model="type" mode="ios" class="segment-fancy pop-in">
        <ion-segment-button value="income">รายรับ</ion-segment-button>
        <ion-segment-button value="expense">รายจ่าย</ion-segment-button>
      </ion-segment>

      <!-- ===== AMOUNT HERO ===== -->
      <ion-card
        class="amount-card glow"
        :class="type"
      >
        <ion-card-content>
          <ion-item lines="none" class="amount-item">
            <ion-input
              v-model="amount"
              type="number"
              inputmode="decimal"
              placeholder="0.00"
            />
          </ion-item>
          <div class="amount-hint">
            {{ type === 'income' ? 'รายรับ' : 'รายจ่าย' }}
          </div>
        </ion-card-content>
      </ion-card>

      <!-- ===== FORM ===== -->
      <ion-card class="form-card slide-up">
        <ion-card-content>

          <!-- TITLE -->
          <ion-item class="input-line">
            <ion-input
              v-model="title"
              placeholder="ชื่อรายการ"
            />
          </ion-item>

          <!-- CATEGORY -->
          <ion-item class="input-line">
            <ion-select
              v-model="category"
              placeholder="หมวดหมู่"
              interface="popover"
            >
              <ion-select-option value="อาหาร">🍜 อาหาร</ion-select-option>
              <ion-select-option value="เดินทาง">🚗 เดินทาง</ion-select-option>
              <ion-select-option value="อื่นๆ">📦 อื่นๆ</ion-select-option>
            </ion-select>
          </ion-item>

          <!-- NOTE -->
          <ion-item class="input-line no-line">
            <ion-textarea
              v-model="note"
              placeholder="หมายเหตุ"
              auto-grow
            />
          </ion-item>

        </ion-card-content>
      </ion-card>

      <!-- ===== BUTTON ===== -->
      <ion-button
        expand="block"
        class="save-btn float-btn"
        :class="type"
        :disabled="!amount || !title"
        @click="saveExpense"
      >
        บันทึกข้อมูล
      </ion-button>

    </ion-content>
  </ion-page>
</template>

<style scoped>
/* ===== BG ===== */
.bg-fancy {
  --background: radial-gradient(circle at top, #0f172a, #020617 70%);
}

/* ===== HEADER ===== */
.header-glass {
  --background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(14px);
  --color: #fff;
}

/* ===== SEGMENT ===== */
.segment-fancy {
  margin: 18px;
  padding: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 18px;
}
.segment-fancy ion-segment-button {
  --color: #cbd5f5;
  --color-checked: #fff;
  --background-checked: #020617;
  border-radius: 14px;
  font-weight: 600;
}

/* ===== AMOUNT ===== */
.amount-card {
  margin: 16px;
  border-radius: 28px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(18px);
  text-align: center;
  transition: transform 0.3s ease;
}
.amount-card:hover {
  transform: translateY(-4px);
}
.amount-item {
  --background: transparent;
}
.amount-item ion-input {
  font-size: 48px;
  font-weight: 800;
  text-align: center;
}
.amount-hint {
  margin-top: 6px;
  font-size: 13px;
  opacity: 0.6;
}

/* ===== COLORS + GLOW ===== */
.amount-card.income ion-input { color: #22c55e; }
.amount-card.expense ion-input { color: #ef4444; }

.glow.income {
  box-shadow: 0 0 40px rgba(34,197,94,0.25);
}
.glow.expense {
  box-shadow: 0 0 40px rgba(239,68,68,0.25);
}

/* ===== FORM ===== */
.form-card {
  margin: 14px 16px;
  border-radius: 26px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(16px);
}

/* ===== INPUT ===== */
.input-line {
  --background: transparent;
  --inner-border-width: 0 0 1px 0;
  --inner-border-color: rgba(255,255,255,0.25);
  color: #fff;
}
.no-line {
  --inner-border-width: 0;
}

/* ===== BUTTON ===== */
.save-btn {
  margin: 30px 18px;
  height: 54px;
  font-weight: 600;
  --border-radius: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.save-btn:active {
  transform: scale(0.95);
}
.save-btn.income {
  --background: linear-gradient(135deg, #22c55e, #16a34a);
}
.save-btn.expense {
  --background: linear-gradient(135deg, #ef4444, #b91c1c);
}
ion-button[disabled] {
  opacity: 0.4;
}

/* ===== ANIMATION ===== */
.pop-in {
  animation: popIn 0.6s cubic-bezier(.25,.8,.25,1);
}
.slide-up {
  animation: slideUp 0.5s ease;
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.94); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
