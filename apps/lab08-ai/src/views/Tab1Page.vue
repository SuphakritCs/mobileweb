<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="toolbar">
        <ion-title>🌌 Forest AI Vision</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="bg">

      <!-- hidden input -->
      <input
        type="file"
        ref="fileInput"
        accept="image/*"
        hidden
        @change="handleFile"
      />

      <!-- Upload Panel -->
      <div class="panel">
        <h2>เลือกรูปภาพ</h2>

        <ion-button expand="block" class="btn choose" @click="chooseFile">
          📂 เลือกจากคอมพิวเตอร์
        </ion-button>

        <ion-button expand="block" class="btn camera" @click="takePhoto">
          📸 ถ่ายภาพ
        </ion-button>
      </div>

      <!-- Preview -->
      <div v-if="preview" class="preview-wrapper">
        <div class="preview-box">
          <img :src="preview" />
          <div class="scan-line"></div>
        </div>
      </div>

      <!-- Analyze -->
      <ion-button
        expand="block"
        class="analyze"
        :disabled="!imageData || loading"
        @click="analyzeImage"
      >
        🔍 วิเคราะห์ด้วย AI
      </ion-button>

      <!-- Loading -->
      <div v-if="loading" class="loading">
        <ion-spinner name="crescent"></ion-spinner>
        <p>AI กำลังวิเคราะห์...</p>
      </div>

      <!-- Result -->
      <div v-if="result" class="result">
        {{ result }}
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { PhotoService } from "../core/photo.service";
import { GeminiVisionService } from "../core/gemini.service";

const fileInput = ref<HTMLInputElement | null>(null);
const imageData = ref<any>(null);
const preview = ref<string>("");
const result = ref<string>("");
const loading = ref<boolean>(false);

/* เปิด file picker */
function chooseFile() {
  fileInput.value?.click();
}

/* รับไฟล์จากคอม */
async function handleFile(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  imageData.value = await PhotoService.fromFile(file);
  preview.value = URL.createObjectURL(file);
  result.value = "";

  /* reset เพื่อให้เลือกไฟล์เดิมซ้ำได้ */
  input.value = "";
}

/* เปิดกล้อง */
async function takePhoto() {
  const img = await PhotoService.fromCamera();
  imageData.value = img;
  preview.value = `data:${img.mimeType};base64,${img.base64}`;
  result.value = "";
}

/* วิเคราะห์ภาพ */
async function analyzeImage() {
  loading.value = true;
  result.value = "";

  try {
    result.value = await GeminiVisionService.analyze(imageData.value);
  } catch (e) {
    result.value = "เกิดข้อผิดพลาดในการวิเคราะห์";
  }

  loading.value = false;
}
</script>

<style scoped>

/* 🌌 Background */
.bg {
  --background: radial-gradient(circle at 30% 20%, #0b3d2e, #010504 70%);
  color: #b9ffd7;
}

/* Header */
.toolbar {
  --background: #021a13;
  --color: #5cffb3;
  text-shadow: 0 0 10px #00ff99;
}

/* Upload Panel */
.panel {
  margin: 20px;
  padding: 22px;
  border-radius: 18px;
  background: rgba(0,40,25,.6);
  border: 1px solid rgba(0,255,150,.35);
  box-shadow: 0 0 30px rgba(0,255,150,.18);
  backdrop-filter: blur(6px);
}

/* Buttons */
.btn {
  margin-top: 12px;
  font-weight: bold;
  height: 48px;
}

.choose {
  --background: linear-gradient(135deg,#00ffa6,#00c27a);
}

.camera {
  --background: linear-gradient(135deg,#00e1ff,#0099aa);
}

/* Preview */
.preview-wrapper {
  display: flex;
  justify-content: center;
  margin: 28px 0;
}

.preview-box {
  position: relative;
  width: 90%;
  max-width: 520px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid #00ffb3;
  box-shadow: 0 0 35px rgba(0,255,170,.35);
  transition: transform .35s ease;
}

.preview-box:hover {
  transform: scale(1.02);
}

.preview-box img {
  width: 100%;
  height: auto;
  display: block;
}

/* Scan animation */
.scan-line {
  position: absolute;
  width: 100%;
  height: 3px;
  background: #00ffcc;
  animation: scan 3s linear infinite;
  box-shadow: 0 0 12px #00ffcc;
}

@keyframes scan {
  0% { top:0 }
  100% { top:100% }
}

/* Analyze Button */
.analyze {
  margin: 20px;
  height: 56px;
  font-size: 18px;
  --background: linear-gradient(135deg,#39ff14,#00c853);
  box-shadow: 0 0 30px rgba(57,255,20,.6);
}

/* Loading */
.loading {
  text-align: center;
  margin-top: 24px;
}

/* ✅ RESULT อ่านง่าย + scroll + glow */
.result {
  margin: 24px;
  padding: 26px;
  border-radius: 18px;

  background: linear-gradient(
    145deg,
    rgba(0, 35, 25, 0.92),
    rgba(0, 20, 15, 0.95)
  );

  border: 1px solid rgba(0,255,170,.35);

  box-shadow:
    0 0 25px rgba(0,255,150,.25),
    inset 0 0 20px rgba(0,255,150,.08);

  color: #eafff4;
  font-size: 16px;
  line-height: 1.9;
  letter-spacing: .3px;

  white-space: pre-line;
  word-wrap: break-word;

  max-height: 320px;
  overflow-y: auto;

  animation: fadeInResult .6s ease;
}

.result::-webkit-scrollbar {
  width: 6px;
}

.result::-webkit-scrollbar-thumb {
  background: rgba(0,255,150,.5);
  border-radius: 10px;
}

@keyframes fadeInResult {
  from { opacity:0; transform:translateY(10px); }
  to { opacity:1; transform:translateY(0); }
}

</style>