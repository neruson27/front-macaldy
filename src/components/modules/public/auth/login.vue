<style>
.q-card {
  width: 360px;
}
</style>
<template>
  <q-page class="row justify-center q-pt-lg bg-header">
    <div class="column">
      <div class="row justify-center text-center">
        <q-img src="/statics/img/logo_1.svg" contain style="width: 240px; height: 180px;" />
      </div>
      <div class="row q-pt-sm" v-if="login">
        <q-card bordered class="q-pa-lg shadow-1 rounded-borders">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input color="franja" clearable v-model="email" type="email" label="Correo" />
              <q-input
                clearable
                v-model="password"
                color="franja"
                type="password"
                label="Contraseña"
              />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn
              unelevated
              color="franja"
              size="lg"
              @click="loginV()"
              class="full-width text-white"
              label="entrar"
            />
          </q-card-actions>
          <q-card-section class="text-center q-pa-none" v-if="notRegistered">
            <p
              class="text-grey-6"
              style="cursor: pointer;"
              @click="registerAppear()"
            >¿No posees cuenta?</p>
          </q-card-section>
        </q-card>
      </div>
      <div class="row" v-else>
        <registro @login="(e) => {login = e}"></registro>
      </div>
    </div>
  </q-page>
</template>
<script>
import registro from "./registro";
import { LOGIN_QUERY, ADMIN_EXIST_QUERY } from "@/graphql/seguridad";
import { saveToken, saveInfo } from "@/utils/auth";
export default {
  name: "login",
  components: {
    registro
  },
  data() {
    return {
      email: "",
      password: "",
      login: true,
      register: false,
      notRegistered: true,
      email: "",
      password: "",
    };
  },
  async created() {
    await this.isRegistered()
  },
  methods: {
    registerAppear() {
      this.login = false;
      this.register = true;
    },
    isRegistered() {
      this.$apollo
        .query({
          query: ADMIN_EXIST_QUERY,
          fetchPolicy: "network-only",
        })
        .then(response => {
          if(response.data.AdminExist) {
            this.notRegistered = false
          }
        })
        .catch(err => {
          console.error(err)
        }) 
    },
    loginV() {
      this.$apollo
        .query({
          query: LOGIN_QUERY,
          fetchPolicy: "network-only",
          variables: {
            data: {
              email: this.email,
              password: this.password
            }
          }
        })
        .then(async response => {
          console.log(response)
          if (response.data.Login.admin) {
            await this.$router.go({ name: "homeAdmin" });
            saveToken(response.data.Login)
          } else {
            this.email = "";
            this.password = "";
            this.error = "Contraseña o correo no válido";
          }
        })
        .catch(err => {
          console.log("hubo un error en login: ", err);
          console.log(err.message)
          this.$q.notify({
            message: err.message.split("GraphQL error:"),
            color: "negative"
          });
        });
    }
  }
};
</script>