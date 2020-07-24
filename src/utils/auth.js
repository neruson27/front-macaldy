import store from "../store";
import moment from "moment";

function setFullName(fullName) {
  window.localStorage.setItem("user", fullName);
  store.commit("setFullName", fullName);
}

function saveToken(data) {
  console.log(data);
  if (!data.admin.config) data.admin.config = { darkMode: false };
  window.localStorage.setItem("user", data.admin.fullName);
  window.localStorage.setItem("user_id", data.admin.id);
  window.localStorage.setItem("isAuthenticated", true);
  window.localStorage.setItem("role", data.admin.role);
  window.localStorage.setItem("token", data.token.code);
  window.localStorage.setItem("expire", data.token.expire);
  store.commit("setUser", {
    fullName: data.admin.fullName,
    id: data.admin.id,
    isAuthenticated: true,
    email: data.admin.email
  });
}

function updateIsAuthenticated() {
  window.localStorage.setItem("isAuthenticated", "true");
}

function removeToken() {
  window.localStorage.removeItem("user");
  window.localStorage.removeItem("user_id");
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("expire");
  window.localStorage.removeItem("isAuthenticated");
  store.commit("setUser", { fullName: "", isAuthenticated: false });
}

function getToken() {
  return window.localStorage.getItem("token") || "";
}

function isAuthenticated() {
  const expire = window.localStorage.getItem("expire");
  const status = store.state.user.status;
  const auth = store.state.user.isAuthenticated;
  // si el token esta vencido, se remueve el token
  if (expire < moment().unix()) {
    removeToken();
    return false;
  }

  return true;
}

function isAuthorized(meta) {
  // si el usuario esta logueado
  // se consulta si tiene el rol exigido por la ruta
  // en router este valor es usado de forma inversa
  // si el role no esta permitido, se arroja error 404
  if (meta.roles && isAuthenticated()) {
    return meta.roles.indexOf(store.state.user.role) > -1;
  }
  // de lo contrario siempre se dará acceso
  return true;
}

// se refresca
function refreshUserStore() {
  if (isAuthenticated()) {
    const user = window.localStorage.getItem("user");
    const userId = window.localStorage.getItem("user_id");
    const auth = window.localStorage.getItem("isAuthenticated");
    store.commit("setUser", {
      image: store.getters.getUserImage,
      fullName: user,
      id: userId,
      isAuthenticated: auth === "true"
    });
  }
}

export {
  updateIsAuthenticated,
  saveToken,
  removeToken,
  isAuthenticated,
  isAuthorized,
  refreshUserStore,
  getToken,
  setFullName
};
