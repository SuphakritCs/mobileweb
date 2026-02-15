<template>
  <ion-page>
    <ion-content class="login-bg">
      <div class="login-wrapper">
        <div class="login-card">

          <h1 class="title">Welcome Back</h1>
          <p class="subtitle">Sign in to continue</p>

          <!-- EMAIL -->
          <ion-item class="input-item" :class="{ invalid: emailError }">
            <ion-input
              v-model="email"
              type="email"
              placeholder="Email address"
            />
          </ion-item>
          <p class="error-text" v-if="emailError">{{ emailError }}</p>

          <!-- PASSWORD -->
          <ion-item class="input-item" :class="{ invalid: passwordError }">
            <ion-input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="Password"
            />
            <ion-button fill="clear" slot="end" @click="togglePassword">
              👁
            </ion-button>
          </ion-item>
          <p class="error-text" v-if="passwordError">{{ passwordError }}</p>

          <!-- LOGIN BUTTON -->
          <ion-button
            expand="block"
            class="login-btn"
            :disabled="loading"
            @click="loginEmail"
          >
            <ion-spinner v-if="loading" name="crescent" />
            <span v-else>Sign In</span>
          </ion-button>

          <div class="divider">
            <span>OR</span>
          </div>

          <!-- GOOGLE -->
          <ion-button
            expand="block"
            fill="outline"
            class="google-btn"
            :disabled="loading"
            @click="loginGoogle"
          >
            Continue with Google
          </ion-button>

        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

/* ✅ ต้อง import Ionic Components */
import {
  IonPage,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonSpinner
} from "@ionic/vue";

import { FirebaseWebAuthService } from "@/auth/auth-web";

const authService = new FirebaseWebAuthService();

const email = ref("");
const password = ref("");

const emailError = ref("");
const passwordError = ref("");

const showPassword = ref(false);
const loading = ref(false);

const router = useRouter();

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const validate = () => {
  emailError.value = "";
  passwordError.value = "";

  let valid = true;

  if (!email.value) {
    emailError.value = "Email is required";
    valid = false;
  }

  if (!password.value) {
    passwordError.value = "Password is required";
    valid = false;
  }

  if (password.value.length < 6) {
    passwordError.value = "Password must be at least 6 characters";
    valid = false;
  }

  return valid;
};

const loginEmail = async () => {
  if (!validate()) return;

  try {
    loading.value = true;

    await authService.loginWithEmailPassword({
      email: email.value,
      password: password.value,
    });

    router.replace("/tabs/tab1");

  } catch (e) {
    passwordError.value = "Invalid email or password";
  } finally {
    loading.value = false;
  }
};

const loginGoogle = async () => {
  try {
    loading.value = true;

    await authService.loginWithGoogle();

    router.replace("/tabs/tab1");

  } catch (e) {
    emailError.value = "Google login failed";
  } finally {
    loading.value = false;
  }
};
</script>



<style scoped>
.login-bg {
  --background: linear-gradient(135deg, #667eea, #764ba2);
}

.login-wrapper {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 380px;
  padding: 40px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
  text-align: center;
  animation: fadeIn 0.4s ease;
}

.title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #222;
}

.subtitle {
  color: #777;
  margin-bottom: 24px;
}

.input-item {
  --background: #f3f6fb;
  border-radius: 10px;
  margin-bottom: 6px;
  color: #222;
}

.input-item.invalid {
  border: 1px solid #ff4d4f;
}

ion-input {
  color: #222 !important;
}

.error-text {
  text-align: left;
  font-size: 12px;
  color: #ff4d4f;
  margin-bottom: 10px;
}

.login-btn {
  margin-top: 10px;
  height: 44px;
  font-weight: 600;
}

.google-btn {
  height: 44px;
  font-weight: 600;
}

.divider {
  margin: 20px 0;
  display: flex;
  align-items: center;
  color: #aaa;
  font-size: 12px;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #eee;
  margin: 0 10px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
