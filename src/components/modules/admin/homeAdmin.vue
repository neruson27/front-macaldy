<template>
  <div class="row justify-center" style="background-color:#f7f8fb">
    <div class="col-md-10 col-lg-10 col-xl-10 col-sm-12">
      <div
        class="q-mt-md text-h6"
      >{{tab === 'home' ? 'Resumen' : tab[0].toUpperCase() + tab.slice(1)}}</div>
      <div class="q-pa-sm">

        <q-tab-panels v-model="tab" animated style="background-color:#f7f8fb">
          <q-tab-panel name="home">
            <homepanel></homepanel>
          </q-tab-panel>

          <q-tab-panel name="productos">
            <productos></productos>
          </q-tab-panel>

          <q-tab-panel name="categorias">
            <categorias></categorias>
          </q-tab-panel>

          <q-tab-panel name="subcategorias">
            <subcategorias></subcategorias>
          </q-tab-panel>

          <!-- <q-tab-panel name="marcas">
            <marcas></marcas>
          </q-tab-panel> -->

          <q-tab-panel name="etiquetas">
            <tags></tags>
          </q-tab-panel>

          <q-tab-panel name="grupo de etiquetas">
            <grupostags></grupostags>
          </q-tab-panel>

          <q-tab-panel name="ordenes">
            <orders></orders>
          </q-tab-panel>

          <q-tab-panel name="slide">
            <slides></slides>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>
<script>
import categorias from "./categorias";
import subcategorias from "./subcategorias";
// import marcas from "./marcas";
import tags from "./tags";
import grupostags from "./grupostags";
import productos from "./productos";
import orders from "./orders";
import slides from "./slides"
import homepanel from "./homepanel";

export default {
  name: "homeAdmin",
  components: {
    categorias,
    subcategorias,
    tags,
    grupostags,
    productos,
    orders,
    slides,
    homepanel
  },
  data() {
    return {
      // tab: "productos"
    };
  },
  computed: {
    tab() {
      if (this.$route.query.tab) {
        return this.$route.query.tab;
      } else {
        return "home";
      }
    }
  },
  methods: {}
};
</script>