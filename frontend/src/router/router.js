import { createWebHistory, createRouter } from "vue-router";

import AuthService from "../services/auth.service";

import HomePage from "../components/HomePage.vue";
import SignIn from "../components/SignIn.vue";
import SignUp from "../components/SignUp.vue";
// lazy-loaded
const ProfilePage = () => import("../components/ProfilePage.vue");
const BoardAdmin = () => import("../components/BoardAdmin.vue");
const BoardUser = () => import("../components/BoardUser.vue");
const MyFilesPage = () => import("../components/MyFilesPage.vue");

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  {
    path: "/home",
    component: HomePage,
  },
  {
    path: "/login",
    component: SignIn,
  },
  {
    path: "/register",
    component: SignUp,
  },
  {
    path: "/profile",
    name: "profile",
    // lazy-loaded
    component: ProfilePage,
  },
  {
    path: "/admin",
    name: "admin",
    // lazy-loaded
    component: BoardAdmin,
  },
  {
    path: "/user",
    name: "user",
    // lazy-loaded
    component: BoardUser,
  },
  {
    path: "/myfiles",
    name: "myFiles",
    component: MyFilesPage,
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
