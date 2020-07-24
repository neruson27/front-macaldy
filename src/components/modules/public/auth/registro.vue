<style>
.q-card {
  width: 360px;
}
</style>
<template>
  <div>
    <div class="row" v-if="registered">
      <q-card bordered class="q-pa-lg shadow-1 rounded-borders">
        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input square color="franja" clearable v-model="email" type="email" label="Correo" />
            <q-input square color="franja" clearable v-model="password" type="password" label="Contraseña" />
            <q-item-label v-if="messaje" class="text-red text-center">{{messaje}}</q-item-label>
            <q-input
              square
              color="franja"
              clearable
              v-model="password2"
              type="password"
              label="Repite la contraseña"
            />
          </q-form>
        </q-card-section>
        <q-card-actions class="q-px-md">
          <q-btn
            v-on:click="register()"
            unelevated
            color="franja"
            size="lg"
            class="full-width text-white"
            label="Registrarse"
            :disable="valid"
          />
        </q-card-actions>
        <q-card-section class="text-center q-pa-none">
          <p class="text-grey-6" style="cursor: pointer;" @click="loginAppear()">¿ya posees cuenta?</p>
        </q-card-section>
      </q-card>
    </div>
    <div class="row" v-else>
      <login></login>
    </div>
  </div>
</template>
<script>
import login from "./login";
import { REGISTRAR_MUTATION } from "@/graphql/seguridad";
export default {
  name: "registro",
  components: {
    login
  },
  data() {
    return {
      email: "",
      password: "",
      password2: "",
      messaje: "",
      valid: true,
      registered: true
    };
  },
  watch: {
    password(newValue) {
      if (newValue === this.password2) {
        this.messaje = ''
        return this.valid = false
      } else {
        this.messaje = "La contraseña no coincide"
        return this.valid = true
      }
    },
    password2(newValue) {
      if (newValue === this.password) {
        this.messaje = ''
        return this.valid = false
      } else {
        this.messaje = "La contraseña no coincide"
        return this.valid = true
      }
    }
  },
  methods: {
    register() {
      this.$apollo
        .mutate({
          mutation: REGISTRAR_MUTATION,
          variables: {
            data: {
              email: this.email,
              password: this.password
            }
          }
        })
        .then(response => {
          this.response = true;
          this.register = false
          this.$emit("login", true)
        })
        .catch(err => {
          console.log("hubo un error en registrar: ", err);
        });
    },
    loginAppear() {
      this.registered = false
      this.$emit("login", true)
    }
  }
};
</script>