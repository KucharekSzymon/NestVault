import { createWebHistory, createRouter } from "vue-router";

import AuthService from "../services/auth.service";

import HomePage from "../components/Public/HomePage.vue";
import SignIn from "../components/Public/SignIn.vue";
import SignUp from "../components/Public/SignUp.vue";
// lazy-loaded
const BoardAdmin = () => import("../components/Admin/BoardAdmin.vue");
const BoardUser = () => import("../components/Users/BoardUser.vue");
const FilesBoard = () => import("../components/Files/FilesBoard.vue");
const ShareCodesList = () => import("../components/Users/ShareCodesList.vue");
const UsersList = () => import("../components/Admin/UsersList.vue");
const MyFilesPage = () => import("../components/Files/MyFilesPage.vue");
const SharedWithMePage = () =>
  import("../components/Files/SharedWithMePage.vue");
const UploadFilePage = () => import("../components/Files/UploadFilePage.vue");

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
    children: [
      {
        path: "/login",
        name: "Sign in",
        component: SignIn,
      },
      {
        path: "/register",
        name: "Sign up",
        component: SignUp,
      },
    ],
  },

  {
    path: "/user",
    name: "User",
    component: BoardUser,

    children: [
      {
        path: "share-codes",
        name: "Share Codes",
        component: ShareCodesList,
      },
    ],
  },
  {
    path: "/admin",
    name: "Admin Board",
    component: BoardAdmin,
    children: [
      {
        path: "users",
        name: "User List",
        component: UsersList,
      },
    ],
  },
  {
    path: "/files",
    name: "Files",
    component: FilesBoard,
    children: [
      {
        path: "mine",
        name: "Mine",
        component: MyFilesPage,
      },
      {
        path: "sharedwithme",
        name: "Shared to me",
        component: SharedWithMePage,
      },
      {
        path: "upload",
        name: "Upload",
        component: UploadFilePage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const publicPages = ["/login", "/register", "/"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("user");
  const adminPaths = ["/admin", "/admin"];

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
