import { lazyLoad } from "./utils";

export default [
  {
    path: "/login",
    name: "login",
    component: lazyLoad("/modules/public/auth/login"),
  },
  {
    path: "/registro",
    name: "registro",
    component: lazyLoad("/modules/public/auth/registro")
  }
];
