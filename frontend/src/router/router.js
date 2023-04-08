import { createWebHistory, createRouter } from "vue-router";

import AuthService from "../services/auth.service";

import HomePage from "../components/Public/HomePage.vue";
import SignIn from "../components/Public/SignIn.vue";
import SignUp from "../components/Public/SignUp.vue";
// lazy-loaded
const ProfilePage = () => import("../components/Users/ProfilePage.vue");
const BoardAdmin = () => import("../components/Admin/BoardAdmin.vue");
const BoardUser = () => import("../components/Users/BoardUser.vue");
const MyFilesPage = () => import("../components/Files/MyFilesPage.vue");
const UploadFilePage = () => import("../components/Files/UploadFilePage.vue");

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
    meta: {
      breadcrumbText: "Home",
    },
  },
  {
    path: "/login",
    name: "login",
    component: SignIn,
    meta: {
      breadcrumbText: "Login",
    },
  },
  {
    path: "/register",
    name: "register",
    component: SignUp,
    meta: {
      breadcrumbText: "Register",
    },
  },
  {
    path: "/user",
    name: "user",
    meta: {
      breadcrumbText: "User",
    },
    children: [
      {
        path: "profile",
        name: "userProfile",
        component: ProfilePage,
        meta: {
          breadcrumbText: "User Profile",
        },
      },
      {
        path: "dashboard",
        name: "userDashboard",
        component: BoardUser,
        meta: {
          breadcrumbText: "User Dashboard",
        },
      },
    ],
  },
  {
    path: "/admin",
    name: "admin",
    component: BoardAdmin,
    meta: {
      breadcrumbText: "Admin Dashboard",
    },
    children: [
      {
        path: "dashboard",
        name: "adminDashboard",
        component: BoardAdmin,
        meta: {
          breadcrumbText: "Admin Dashboard",
        },
      },
    ],
  },
  {
    path: "/files",
    name: "files",
    meta: {
      breadcrumbText: "Files",
    },
    children: [
      {
        path: "mine",
        name: "myFiles",
        component: MyFilesPage,
        meta: {
          breadcrumbText: "My Files",
        },
      },
      {
        path: "upload",
        name: "newFile",
        component: UploadFilePage,
        meta: {
          breadcrumbText: "Upload File",
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const publicPages = ["/login", "/register", "/home"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("user");
  const adminPaths = ["/admin", "/admin2"];

  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next("/login");
    return;
  }

  if (authRequired) {
    // check if user is admin
    try {
      const isAdmin = await AuthService.checkRole();
      if (adminPaths.includes(to.path) && !isAdmin) {
        // trying to access an admin page without being an admin
        // redirect to home page
        next("/");
        return;
      }
    } catch (err) {
      console.log(err);
    }
  }

  next();
});

export default router;
