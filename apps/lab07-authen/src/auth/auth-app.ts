import type {
  IAuthService,
  AuthUser,
  EmailPasswordCredentials,
  PhoneCredentials
} from "./auth-interface";

export class FirebaseAppAuthService implements IAuthService {

  async getCurrentUser(): Promise<AuthUser | null> {
    console.log("App: getCurrentUser");
    return null;
  }

  async loginWithEmailPassword(creds: EmailPasswordCredentials): Promise<AuthUser> {
    console.log("App: loginWithEmailPassword", creds.email);

    // TODO: จะไปใส่ Firebase Native จริงในขั้นถัดไป
    return {
      uid: "mock-app-user",
      email: creds.email
    };
  }

  async loginWithGoogle(): Promise<AuthUser> {
    console.log("App: loginWithGoogle");

    return {
      uid: "mock-google-user",
      displayName: "Google User"
    };
  }

  async startPhoneLogin(creds: PhoneCredentials): Promise<{ verificationId: string }> {
    console.log("App: startPhoneLogin", creds.phoneNumberE164);

    return { verificationId: "mock-verification-id" };
  }

  async confirmPhoneCode(payload: { verificationId: string; verificationCode: string }): Promise<AuthUser> {
    console.log("App: confirmPhoneCode", payload);

    return {
      uid: "mock-phone-user",
      phoneNumber: "mock"
    };
  }

  async logout(): Promise<void> {
    console.log("App: logout");
  }
}
