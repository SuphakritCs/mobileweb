<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar class="header">
        <ion-title>🚀 Arm Workout Coach</ion-title>
      </ion-toolbar>
    </ion-header>

```
<!-- ❌ เอา fullscreen ออก เพื่อไม่ให้ปุ่มโดน system bar ทับ -->
<ion-content class="space-bg">
  <div class="container">
    <!-- REP DISPLAY -->
    <div class="rep-card">
      <p class="label">REPS</p>
      <h1 class="rep">{{ state?.repDisplay ?? 0 }}</h1>
    </div>

    <!-- STATUS -->
    <div class="info-card">
      <p>🧠 Status</p>
      <h2>{{ state?.status ?? "Idle" }}</h2>
    </div>

    <!-- SCORE -->
    <div class="info-card">
      <p>🎯 Form Score</p>
      <h2>{{ state?.stats.score?.toFixed(1) ?? 0 }}%</h2>
    </div>

    <!-- MESSAGE -->
    <div class="message">
      {{ state?.stats.lastMessage ?? "Raise phone up and down" }}
    </div>
  </div>

  <!-- ✅ ปุ่มแยกออกมานอก container แล้ว FIX ไว้ล่างจอ -->
  <div class="btn-group">
    <ion-button expand="block" class="start-btn" @click="startWorkout">
      ▶ Start Workout
    </ion-button>

    <ion-button expand="block" fill="outline" class="stop-btn" @click="stopWorkout">
      ■ Stop
    </ion-button>
  </div>
</ion-content>
```

  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ArmWorkoutEngine } from "@/core/ArmWorkoutEngine";
import type { WorkoutState } from "@/core/types";

/*
 UI ห้ามเรียก Capacitor โดยตรง (ตามโจทย์)
 UI คุยกับ Engine อย่างเดียว
*/
const state = ref<WorkoutState | null>(null);

const engine = new ArmWorkoutEngine((s) => {
  state.value = { ...s };
});

const startWorkout = async () => {
  await engine.start();
};

const stopWorkout = async () => {
  await engine.stop();
};
</script>

<style scoped>
/* ===== BACKGROUND ===== */
.space-bg {
  --background: radial-gradient(circle at 20% 20%, #001a12, #000000 70%);
  color: #d2ffe9;
}

/* ===== HEADER ===== */
.header {
  --background: #001a12;
  --color: #5bffb2;
  text-align: center;
  font-weight: bold;
  letter-spacing: 1px;
}

/* ===== CONTENT LAYOUT ===== */
.container {
  padding: 24px;
  padding-bottom: 140px; /* กันเนื้อหาชนปุ่มล่าง */
  text-align: center;
}

/* ===== REP DISPLAY ===== */
.rep-card {
  margin-top: 30px;
  padding: 30px;
  border-radius: 20px;
  background: rgba(0, 255, 150, 0.05);
  box-shadow: 0 0 40px rgba(0, 255, 150, 0.25);
}

.label {
  letter-spacing: 3px;
  color: #7dffcc;
}

.rep {
  font-size: 90px;
  margin: 10px 0;
  color: #00ff9c;
  text-shadow: 0 0 25px #00ff9c;
}

/* ===== INFO CARD ===== */
.info-card {
  margin-top: 20px;
  padding: 18px;
  border-radius: 14px;
  background: rgba(0, 255, 150, 0.07);
}

/* ===== MESSAGE ===== */
.message {
  margin-top: 25px;
  font-style: italic;
  color: #9affd5;
}

/* ===== FIX ปุ่มล่างจอ (สำคัญมาก) ===== */
.btn-group {
  position: fixed;
  bottom: 20px;
  left: 16px;
  right: 16px;
  z-index: 10;

  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* กัน Android gesture bar ทับ */
ion-content::part(scroll) {
  padding-bottom: 160px;
}

/* ===== BUTTON STYLE ===== */
.start-btn {
  --background: #00ff9c;
  --color: black;
  font-weight: bold;
  box-shadow: 0 0 20px #00ff9c;
}

.stop-btn {
  --border-color: #00ff9c;
  --color: #00ff9c;
}
</style>
