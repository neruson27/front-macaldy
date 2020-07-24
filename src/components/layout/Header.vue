<style>
.q-header .q-tab__content, .q-footer .q-tab__content {
    min-width: auto;
}
</style>
<template>
  <section>
    <div class="bg-header" v-if="$route.name !== 'login'">
      <div class="row justify-center" v-if="!$store.state.user.isAuthenticated">
        <div class="bg-white col-12 sm-hide xs-hide">
          <div class="row justify-evenly">
            <q-space/>
            <div class="col-5">
              <q-banner style="width:100%;height:auto;">
                <q-img src="/statics/img/logo_1.png" contain style="width: 250px; height: 120px;" />
              </q-banner>
            </div>
            <div class="col-5 q-pl-xl self-center">
              <div class="row justify-center">
                <div class="col-12">
                  <q-btn
                    dark
                    no-caps
                    color="franja"
                    icon="mdi-facebook-box"
                    size="md"
                    flat
                    label="@CentroMedicoInColger"
                  ></q-btn>
                </div>
                <div class="col-12">
                  <q-btn
                    dark
                    no-caps
                    color="franja"
                    icon="mdi-instagram"
                    size="md"
                    flat
                    label="@CentroMedicoInColger"
                  ></q-btn>
                </div>
                <div class="col-12">
                  <q-btn
                    dark
                    no-caps
                    color="franja"
                    icon="mdi-headset"
                    size="md"
                    flat
                    label="Servicio al cliente"
                  ></q-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12" style="border-top: 6px solid #683d25; width:100vw;"></div>
        <div class="col-xl-9 col-lg-9 col-md-9 col-sm-12 col-xs-12">
          <q-toolbar class="q-my-xs">
            <q-btn
              class="lg-hide xl-hide md-hide"
              flat
              @click="drawer = !drawer"
              color="franja"
              round
              dense
              icon="menu"
            />
            <q-input
              :style="(this.$q.screen.lt.md) ? 'width:100%;' : 'width:40%;'"
              bg-color="white"
              outlined
              v-model="search"
              placeholder="Productos y mucho mas..."
              dense
              flat
              v-on:keyup.enter="searching()"
            >
              <template v-slot:append>
                <q-icon class="cursor-pointer" name="search" @click="searching()" />
              </template>
            </q-input>
            <q-btn dark to="/" color="franja" flat label="INICIO" class="xs-hide sm-hide" />
            <q-btn
              class="xs-hide sm-hide"
              dark
              to="/productos"
              flat
              color="franja"
              @mouseover="hello = true"
              label="Productos"
            ></q-btn>
            <q-btn class="xs-hide sm-hide" dark to="/servicios" color="franja" flat label="SERVICIOS" />
            <q-btn class="xs-hide sm-hide" dark to="/nosotros" color="franja" flat label="NOSOTROS" />
            <q-btn
              class="xs-hide sm-hide"
              dark
              to="/contactenos"
              color="franja"
              flat
              label="CONTACTENOS"
            />
            <q-space></q-space>
            <q-btn
              @click="open('right')"
              dark
              color="franja"
              icon="mdi-cart-outline"
              size="lg"
              flat
              v-if="!$store.state.user.isAuthenticated"
            ></q-btn>
            <q-btn
              @click="open('right')"
              class="text-black"
              color="white"
              size="md"
              :label="itemsInCart"
              v-if="!$store.state.user.isAuthenticated"
            ></q-btn>
          </q-toolbar>
        </div>
      </div>
      <div class="row justify-center" v-else>
        <div class="col-xl-9 col-lg-9 col-md-9 col-sm-12 col-xs-12">
          <q-toolbar class="q-mb-xs row justify-between">
            <q-btn flat @click="drawerA = !drawerA" color="white" round dense icon="menu" />
            <div class="text-white text-h6">Admin Panel</div>
            <q-btn no-caps flat icon="mdi-logout-variant" color="white" v-on:click="destroy()">Cerrar sesión</q-btn>
          </q-toolbar>
        </div>
      </div>
    </div>

    <q-drawer v-model="drawer" :width="200">
      <q-scroll-area class="fit" style="background-color:#2c2c2c;">
        <q-btn
          flat
          icon="mdi-arrow-left-bold"
          size="16px"
          @click="drawer = !drawer"
          color="white"
          class="absolute-top-right"
        ></q-btn>
        <q-banner
          class="bg-transparent text-white q-pa-md row justify-center"
          style="width:100%;height:auto;"
        >
          <q-img src="/statics/img/logo_1.png" style="width: 150px; height: 120px;" />
        </q-banner>
        <q-tabs v-model="tab" vertical class="text-white">
          <q-separator dark />
          <q-route-tab to="/" exact label="inicio"></q-route-tab>
          <q-separator dark />
          <q-route-tab to="/productos" exact label="productos"></q-route-tab>
          <q-separator dark />
          <q-route-tab to="/servicios" exact label="servicios"></q-route-tab>
          <q-separator dark />
          <q-route-tab to="/nosotros" exact label="nosotros"></q-route-tab>
          <q-separator dark />
          <q-route-tab to="/contactenos" exact label="contactenos"></q-route-tab>
          <q-separator dark />
        </q-tabs>
      </q-scroll-area>
    </q-drawer>

    <q-drawer
      v-model="drawerA"
      :show-if-above="drawerAdmin"
      elevated
      :breakpoint="700"
      :width="200"
      v-if="drawerAdmin"
    >
      <q-scroll-area class="fit" style="background-color:#2c2c2c;">
        <q-banner class="bg-transparent text-white q-pa-md" style="width:100%;height:auto;">
          <q-btn
            flat
            icon="mdi-arrow-left-bold"
            size="16px"
            @click="drawerA = !drawerA"
            color="white"
            class="absolute-top-right lg-hide xl-hide"
          ></q-btn>
          <q-img @click="$router.push('homeAdmin')" contain src="/statics/img/logo_1.png" style="width: 150px; height: 120px;" />
        </q-banner>
        <q-tabs v-model="tab" inline-label vertical class="text-white" active-bg-color="vinotinto">
          <q-route-tab style="justify-content: start;" icon="mdi-home-outline" to="/homeAdmin" exact label="Inicio"></q-route-tab>
          <q-separator dark />
          <q-route-tab style="justify-content: start;" icon="img:statics/icons/productos.svg" to="/homeAdmin?tab=productos" exact label="productos"></q-route-tab>
          <q-separator dark />
          <q-route-tab style="justify-content: start;" icon="img:statics/icons/categorias.svg" to="/homeAdmin?tab=categorias" exact label="categorias"></q-route-tab>
          <q-separator dark />
          <q-route-tab style="justify-content: start;" icon="img:statics/icons/sub-categorias.svg" to="/homeAdmin?tab=subcategorias" exact label="subcategorias"></q-route-tab>
          <q-separator dark />
          <!-- <q-route-tab style="justify-content: start;" icon="img:statics/icons/marcas.svg" to="/homeAdmin?tab=marcas" exact label="marcas"></q-route-tab> -->
          <q-separator dark />
          <q-route-tab style="justify-content: start;" icon="img:statics/icons/tags.svg" to="/homeAdmin?tab=etiquetas" exact label="tags"></q-route-tab>
          <q-separator dark />
          <q-route-tab style="justify-content: start;" icon="img:statics/icons/grupo_tags.svg" to="/homeAdmin?tab=grupo de etiquetas" exact label="grupostags"></q-route-tab>
          <q-separator dark />
          <q-route-tab style="justify-content: start;" icon="img:statics/icons/pedidos.svg" to="/homeAdmin?tab=ordenes" exact label="orders"></q-route-tab>
          <q-separator dark />
          <q-route-tab style="justify-content: start;" icon="mdi-file-image-outline" to="/homeAdmin?tab=slide" exact label="slide"></q-route-tab>
        </q-tabs>
      </q-scroll-area>
    </q-drawer>

    <q-dialog v-model="dialog" :position="position">
      <q-card>
        <q-card-section class="bg-header text-white">
          <div class="text-h6 text-right">total de productos: {{itemsInCart}}</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <cart></cart>
        </q-card-section>

        <q-separator />

        <div class="row justify-between bg-header text-white">
          <q-card-actions>Precio total: <b class="q-ml-xs">{{'$ ' + format(total)}}</b></q-card-actions>
          <q-card-actions v-if="itemsInCart > 0">
            <q-btn icon-right="mdi-credit-card" label="Comprar" v-on:click="$router.push('checkout')" />
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>
  </section>
</template>
<script>
import cart from "@/components/components/cart";
import { removeToken } from "@/utils/auth";
export default {
  name: "Header",
  components: {
    cart
  },
  data() {
    return {
      itemCount: (this.itemCount = this.$store.getters.itemCount),
      cart: (this.cart = this.$store.getters.cart),
      dialog: false,
      position: "top",
      search: "",
      drawer: false,
      drawerA: false,
      hello: false,
      tab: "",
    };
  },
  computed: {
    itemsInCart() {
      let cart = this.$store.getters.cart;
      return cart.reduce((accum, item) => accum + item.quantity, 0);
    },
    total() {
      return this.cart.reduce((total, p) => {
        return total + p.price * p.quantity;
      }, 0);
    },
    drawerAdmin() {
      return this.$store.getters.authenticate;
    },
    loginPage() {
      console.log(this.$router.history);
      return this.$router.history.current.name === "login";
    }
  },
  methods: {
    format(input) {
      let num = input
      if (!isNaN(num)) {
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/,'');
        return num;
      }
    },
    destroy() {
      removeToken();
      this.drawerA = false;
      this.$store.commit("logout");
      this.$router.push({ name: "Home" });
    },
    open(position) {
      this.position = position;
      this.dialog = true;
    },
    searching() {
      this.$router.push(`productos?search=${this.search}`)
    }
  }
};
</script>