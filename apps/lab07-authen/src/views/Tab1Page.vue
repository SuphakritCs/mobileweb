<template>
  <ion-page>
    <!-- HEADER -->
    <ion-header translucent>
      <ion-toolbar class="header">
        <ion-title>Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- CONTENT -->
    <ion-content :fullscreen="true" class="content">
      <div class="wrapper">

        <!-- WELCOME CARD -->
        <ion-card class="welcome-card">
          <ion-card-header>
            <ion-card-title>Welcome 🎉</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <p>You are logged in successfully.</p>
            <p class="sub">This is Lab07 Authentication Demo</p>
          </ion-card-content>
        </ion-card>

        <!-- USER INFO -->
        <ion-card v-if="user" class="user-card">
          <ion-card-header>
            <ion-card-title>User Information</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>UID:</strong> {{ user.uid }}</p>
            <p><strong>Provider:</strong> {{ provider }}</p>
          </ion-card-content>
        </ion-card>

        <!-- INFO BOX -->
        <div class="info-box">
          <div class="info-item">
            <span class="icon">🔐</span>
            <div>
              <h3>Firebase Auth Connected</h3>
              <p>User session is active</p>
            </div>
          </div>

          <div class="info-item">
            <span class="icon">⚡</span>
            <div>
              <h3>Session Persistence</h3>
              <p>Refresh will not logout</p>
            </div>
          </div>
        </div>

        <!-- LOGOUT BUTTON -->
        <ion-button expand="block" class="logout-btn" @click="logout">
          Logout
        </ion-button>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { FirebaseWebAuthService } from "@/auth/auth-web";

const router = useRouter();
const authService = new FirebaseWebAuthService();

/* ✅ ใช้ user ตัวเดียว */
const user = ref<any>(null);
const provider = ref("");

onMounted(async () => {
  const currentUser = await authService.getCurrentUser();

  if (!currentUser) {
    router.replace("/login");
    return;
  }

  /* เก็บ user เพื่อโชว์ในหน้า */
  user.value = currentUser;

  /* ตรวจสอบว่า login ด้วยอะไร */
  const providerId = currentUser.providerId;

  if (providerId === "google.com") {
    provider.value = "Google";
  }
  else if (providerId === "password") {
    provider.value = "Email / Password";
  }
  else {
    provider.value = providerId ?? "Unknown";
  }
});

/* Logout */
const logout = async () => {
  await authService.logout();
  router.replace("/login");
};
</script>

<style scoped>
.content {
  --background: linear-gradient(135deg, #eef2f7, #ffffff);
}

.header {
  --background: #3880ff;
  color: white;
}

.wrapper {
  padding: 20px;
}

.welcome-card,
.user-card {
  border-radius: 18px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.sub {
  color: #666;
  font-size: 14px;
}

.info-box {
  color: #666;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: white;
  border-radius: 14px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
}

.icon {
  font-size: 26px;
}

.logout-btn {
  height: 46px;
  font-weight: 600;
  --border-radius: 12px;
}
</style>
