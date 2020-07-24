// import something here
import axios from "axios";
import apolloClient from "../utils/apollo";

// export default async ({ /* app, router, Vue, ... */ }) => {
export default async ({ Vue }) => {
  Vue.prototype.$apollo = apolloClient;

  Vue.prototype.$axios = axios;
};
