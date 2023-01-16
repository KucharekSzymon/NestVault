import { createWebHistory, createRouter } from "vue-router";
import HomePage from "../components/HomePage.vue";
import SignIn from "../components/SignIn.vue";
import SignUp from "../components/SignUp.vue";
// lazy-loaded
const ProfilePage = () => import("../components/ProfilePage.vue");
const BoardAdmin = () => import("../components/BoardAdmin.vue");
const BoardUser = () => import("../components/BoardUser.vue");

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/register", "/home"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("user");

  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next("/login");
  } else {
    next();
  }
});

export default router;
