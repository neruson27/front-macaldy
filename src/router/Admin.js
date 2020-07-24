import { lazyLoad } from "./utils";

export default [
  {
    path: "/homeAdmin",
    name: "homeAdmin",
    components: { default: lazyLoad("/modules/admin/homeAdmin") },
    meta: {
      requiresAuth: true
    },
    props: true
  }
];
