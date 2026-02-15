import { Capacitor } from "@capacitor/core";
import type { IAuthService } from "./auth-interface";
import { FirebaseWebAuthService } from "./auth-web";
import { FirebaseAppAuthService } from "./auth-app";

// ตรวจว่ากำลังรันบน Android/iOS หรือ Browser
function createAuthService(): IAuthService {
  if (Capacitor.isNativePlatform()) {
    console.log("Running on Native → use FirebaseAppAuthService");
    return new FirebaseAppAuthService();
  } else {
    console.log("Running on Web → use FirebaseWebAuthService");
    return new FirebaseWebAuthService();
  }
}

export const authService = createAuthService();
