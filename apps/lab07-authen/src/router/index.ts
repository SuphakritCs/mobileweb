import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";

import LoginView from "@/views/LoginView.vue";
import TabsPage from "@/views/TabsPage.vue";

// ✅ ใช้ observer ของ Firebase
import { observeAuthState } from "@/auth/auth-web";

// ----------------------------
// 🔐 เก็บสถานะ user + รอ Firebase init
// ----------------------------
let currentUser: any = null;
let authReady = false;

const waitForAuth = new Promise<void>((resolve) => {
  observeAuthState((user) => {
    currentUser = user;
    authReady = true;
    resolve(); // Firebase พร้อมแล้ว
  });
});

// ----------------------------
// ROUTES
// ----------------------------
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login"
  },

  // 🔓 Public
  {
    path: "/login",
    component: LoginView
  },

  // 🔐 Protected
  {
    path: "/tabs/",
    component: TabsPage,
    children: [
      {
        path: "",
        redirect: "/tabs/tab1"
      },
      {
        path: "tab1",
        component: () => import("@/views/Tab1Page.vue")
      },
      {
        path: "tab2",
        component: () => import("@/views/Tab2Page.vue")
      },
      {
        path: "tab3",
        component: () => import("@/views/Tab3Page.vue")
      }
    ]
  }
];

// ----------------------------
// CREATE ROUTER
// ----------------------------
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// ----------------------------
// ✅ ROUTE GUARD (เวอร์ชันที่ถูกต้อง)
// ----------------------------
router.beforeEach(async (to, from, next) => {
  // ⭐ รอ Firebase restore session ก่อนทุกครั้ง
  if (!authReady) {
    await waitForAuth;
  }

  // ❌ ยังไม่ login แต่จะเข้าหน้าอื่น
  if (!currentUser && to.path !== "/login") {
    next("/login");
    return;
  }

  // ✅ login แล้ว แต่กดกลับ login
  if (currentUser && to.path === "/login") {
    next("/tabs/tab1");
    return;
  }

  next();
});

export default router;
