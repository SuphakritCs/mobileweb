<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel
} from '@ionic/vue';

import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase';
import { useRouter } from 'vue-router';

/* ===== ROUTER ===== */
const router = useRouter();

/* ===== DATA ===== */
interface Expense {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

const expenses = ref<Expense[]>([]);
let unsubscribe: any = null;

/* ===== REALTIME FIREBASE ===== */
onMounted(() => {
  const q = query(
    collection(db, 'expenses'),
    orderBy('createdAt', 'desc')
  );

  unsubscribe = onSnapshot(q, (snapshot) => {
    expenses.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Expense, 'id'>)
    }));
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

/* ===== SUMMARY ===== */
const totalIncome = computed(() =>
  expenses.value.filter(e => e.type === 'income')
    .reduce((s, e) => s + e.amount, 0)
);

const totalExpense = computed(() =>
  expenses.value.filter(e => e.type === 'expense')
    .reduce((s, e) => s + e.amount, 0)
);

const balance = computed(() => totalIncome.value - totalExpense.value);

/* ===== GO EDIT ===== */
const goEdit = (id: string) => {
  router.push(`/edit/${id}`);
};
</script>

<template>
  <ion-page>
    <!-- HEADER -->
    <ion-header class="ion-no-border">
      <ion-toolbar class="header-glass">
        <ion-title>ภาพรวมการเงิน</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="bg-fancy">

      <!-- ===== SUMMARY ===== -->
      <div class="summary-card pop-in">
        <div class="summary-row">
          <div class="box income glow-green">
            <span>รายรับ</span>
            <strong>+{{ totalIncome.toLocaleString() }}</strong>
          </div>

          <div class="box expense glow-red">
            <span>รายจ่าย</span>
            <strong>-{{ totalExpense.toLocaleString() }}</strong>
          </div>
        </div>

        <div class="balance">
          คงเหลือ
          <strong
            class="balance-amount"
            :class="balance >= 0 ? 'income' : 'expense'"
          >
            {{ balance.toLocaleString() }}
          </strong>
        </div>
      </div>

      <!-- ===== EMPTY ===== -->
      <div v-if="expenses.length === 0" class="empty fade-in">
        <h3>ยังไม่มีรายการ</h3>
        <p>เริ่มต้นเพิ่มรายรับหรือรายจ่ายได้เลย ✨</p>
      </div>

      <!-- ===== LIST ===== -->
      <ion-list v-else class="list-wrap">
        <ion-item
          v-for="(item, i) in expenses"
          :key="item.id"
          lines="none"
          button
          class="list-card slide-stagger"
          :style="{ animationDelay: `${i * 60}ms` }"
          @click="goEdit(item.id)"
        >
          <ion-label>
            <h2>{{ item.title }}</h2>
            <p>{{ item.category }}</p>
          </ion-label>

          <div class="amount" :class="item.type">
            {{ item.type === 'income' ? '+' : '-' }}
            {{ item.amount.toLocaleString() }}
          </div>
        </ion-item>
      </ion-list>

    </ion-content>
  </ion-page>
</template>

<style scoped>
/* ===== BG ===== */
.bg-fancy {
  --background: radial-gradient(
    circle at top,
    #0f172a,
    #020617 70%
  );
}

/* ===== HEADER ===== */
.header-glass {
  --background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(14px);
  --color: #fff;
}

/* ===== SUMMARY ===== */
.summary-card {
  margin: 18px;
  padding: 20px;
  border-radius: 28px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(16px);
  color: #fff;
}

.summary-row {
  display: flex;
  gap: 14px;
}

.box {
  flex: 1;
  padding: 16px;
  border-radius: 18px;
  background: rgba(255,255,255,0.12);
  transition: transform 0.25s ease;
}

.box:hover {
  transform: translateY(-3px);
}

.box span {
  font-size: 13px;
  opacity: 0.75;
}

.box strong {
  display: block;
  margin-top: 8px;
  font-size: 20px;
}

/* ===== BALANCE ===== */
.balance {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid rgba(255,255,255,0.15);
  display: flex;
  justify-content: space-between;
  font-weight: 600;
}

.balance-amount {
  font-size: 20px;
  transition: transform 0.3s ease;
}

/* ===== COLORS ===== */
.income {
  color: #22c55e;
}
.expense {
  color: #ef4444;
}

/* ===== GLOW ===== */
.glow-green {
  box-shadow: 0 0 30px rgba(34,197,94,0.25);
}
.glow-red {
  box-shadow: 0 0 30px rgba(239,68,68,0.25);
}

/* ===== EMPTY ===== */
.empty {
  text-align: center;
  margin-top: 90px;
  color: #cbd5f5;
}

/* ===== LIST ===== */
.list-wrap {
  margin: 10px 14px 50px;
}

.list-card {
  margin-bottom: 14px;
  border-radius: 22px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(14px);
  color: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.list-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
}

.list-card:active {
  transform: scale(0.96);
}

.list-card h2 {
  font-size: 16px;
}

.list-card p {
  font-size: 13px;
  opacity: 0.65;
}

/* ===== AMOUNT ===== */
.amount {
  font-weight: 700;
  font-size: 15px;
}

/* ===== ANIMATION ===== */
.pop-in {
  animation: popIn 0.6s cubic-bezier(.25,.8,.25,1);
}

.fade-in {
  animation: fadeIn 0.6s ease;
}

.slide-stagger {
  animation: slideUp 0.5s ease both;
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.94);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
