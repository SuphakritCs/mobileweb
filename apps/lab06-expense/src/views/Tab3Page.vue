<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent
} from '@ionic/vue';

import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';

/* ===== DATA ===== */
interface Expense {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

const expenses = ref<Expense[]>([]);
let unsubscribe: any;

/* ===== FIREBASE ===== */
onMounted(() => {
  unsubscribe = onSnapshot(collection(db, 'expenses'), snap => {
    expenses.value = snap.docs.map(d => ({
      id: d.id,
      ...(d.data() as Omit<Expense, 'id'>)
    }));
  });
});

onUnmounted(() => unsubscribe && unsubscribe());

/* ===== CALC ===== */
const income = computed(() =>
  expenses.value
    .filter(e => e.type === 'income')
    .reduce((s, e) => s + e.amount, 0)
);

const expense = computed(() =>
  expenses.value
    .filter(e => e.type === 'expense')
    .reduce((s, e) => s + e.amount, 0)
);

const balance = computed(() => income.value - expense.value);

const percentIncome = computed(() => {
  const total = income.value + expense.value;
  return total ? Math.round((income.value / total) * 100) : 0;
});

/* ===== CATEGORY ===== */
const categoryMap = computed(() => {
  const map: Record<string, number> = {};
  expenses.value
    .filter(e => e.type === 'expense')
    .forEach(e => {
      map[e.category || 'อื่นๆ'] =
        (map[e.category || 'อื่นๆ'] || 0) + e.amount;
    });
  return map;
});
</script>

<template>
  <ion-page>
    <!-- ===== HEADER ===== -->
    <ion-header class="ion-no-border">
      <ion-toolbar class="header-glass">
        <ion-title>Analytics</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="bg-fancy">

      <!-- ===== BALANCE ===== -->
      <div class="balance-card fade-in">
        <span>ยอดคงเหลือ</span>
        <strong :class="balance >= 0 ? 'income' : 'expense'">
          {{ balance.toLocaleString() }}
        </strong>
      </div>

      <!-- ===== PIE ===== -->
      <div class="chart-card glow slide-up">
        <svg viewBox="0 0 36 36" class="pie">
          <path
            class="bg"
            d="M18 2
               a 16 16 0 0 1 0 32
               a 16 16 0 0 1 0 -32"
          />
          <path
            class="income"
            :stroke-dasharray="`${percentIncome}, 100`"
            d="M18 2
               a 16 16 0 0 1 0 32
               a 16 16 0 0 1 0 -32"
          />
        </svg>

        <div class="center">
          <span>รายรับ</span>
          <strong>{{ percentIncome }}%</strong>
        </div>
      </div>

      <!-- ===== TOTAL ===== -->
      <div class="total-row fade-in">
        <div>
          <span>รายรับ</span>
          <strong class="income">+{{ income.toLocaleString() }}</strong>
        </div>
        <div>
          <span>รายจ่าย</span>
          <strong class="expense">-{{ expense.toLocaleString() }}</strong>
        </div>
      </div>

      <!-- ===== BREAKDOWN ===== -->
      <div class="breakdown slide-up">
        <h3>รายจ่ายตามหมวด</h3>

        <div
          v-for="(value, key) in categoryMap"
          :key="key"
          class="row"
        >
          <span>{{ key }}</span>
          <strong>{{ value.toLocaleString() }}</strong>
        </div>

        <div v-if="Object.keys(categoryMap).length === 0" class="empty">
          ยังไม่มีข้อมูลรายจ่าย
        </div>
      </div>

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
  --background: rgba(15,23,42,0.65);
  backdrop-filter: blur(14px);
  --color: #fff;
}

/* ===== BALANCE ===== */
.balance-card {
  margin: 20px;
  padding: 20px;
  border-radius: 26px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(14px);
  text-align: center;
  color: #fff;
}
.balance-card span {
  font-size: 14px;
  opacity: 0.7;
}
.balance-card strong {
  display: block;
  margin-top: 6px;
  font-size: 34px;
  font-weight: 800;
}

/* ===== CHART ===== */
.chart-card {
  margin: 24px;
  padding: 24px;
  border-radius: 30px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(16px);
  text-align: center;
  position: relative;
}

.pie {
  width: 180px;
  height: 180px;
  transform: rotate(-90deg);
}
.pie path {
  fill: none;
  stroke-width: 3.2;
}
.pie .bg {
  stroke: rgba(255,255,255,0.2);
}
.pie .income {
  stroke: #22c55e;
  transition: stroke-dasharray 0.8s ease;
}

.center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
}
.center strong {
  font-size: 28px;
}

/* ===== TOTAL ===== */
.total-row {
  margin: 0 24px 10px;
  display: flex;
  justify-content: space-between;
  color: #fff;
}
.total-row span {
  font-size: 13px;
  opacity: 0.6;
}
.total-row strong {
  font-size: 18px;
}

/* ===== BREAKDOWN ===== */
.breakdown {
  margin: 20px;
  padding: 22px;
  border-radius: 26px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(14px);
  color: #fff;
}
.breakdown h3 {
  margin-bottom: 14px;
}
.row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.empty {
  margin-top: 10px;
  text-align: center;
  opacity: 0.6;
}

/* ===== COLORS ===== */
.income { color: #22c55e; }
.expense { color: #ef4444; }

/* ===== GLOW ===== */
.glow {
  box-shadow: 0 0 40px rgba(34,197,94,0.25);
}

/* ===== ANIM ===== */
.fade-in {
  animation: fadeIn .6s ease;
}
.slide-up {
  animation: slideUp .5s ease;
}

@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
