<template>
  <div class="row justify-center">
    <div class="col-9 q-my-lg">
      <div class="row justify-start">
        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-xs-12 q-ma-sm">
          <q-select
            dense
            filled
            v-model="filtroCategory"
            option.value="name"
            option-label="name"
            emit-value
            map-options
            :options="categories"
            label="Categorias"
            clearable
            @clear="clearAll()"
          />
        </div>
        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-xs-12 q-ma-sm q-ma-sm">
          <q-select
            dense
            filled
            v-model="filtroSubCategory"
            option.value="name"
            option-label="name"
            emit-value
            map-options
            :options="filtroCategory ? filtroCategory.subcategory : subcategories"
            label="Sub-categorias"
            clearable
            @clear="clearAll()"
          />
        </div>
        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-xs-12 q-ma-sm q-ma-sm">
          <q-select
            dense
            filled
            v-model="filtroTag"
            option.value="name"
            option-label="name"
            emit-value
            map-options
            :options="filtroCategory && filtroCategory.tagsgroup[0] ? filtroCategory.tagsgroup[0].tags : tags"
            label="Características"
            clearable
            @clear="clearAll()"
          />
        </div>
        <div class="col-xl-2 col-lg-2 col-md-2 col-sm-6 col-xs-5 q-ma-sm text-center">
          <q-btn v-if="botonBuscar" color="negative" @click="buscarProducto()" label="Buscar" />
        </div>
      </div>
    </div>
    <div class="col-xl-10 col-lg-10 col-md-9 col-sm-12 col-xs-12">
      <div class="row justify-center text-center" style="min-height:500px;" v-if="mensaje === true">
        <div class="col-12 self-center">
          <p>No se encontraron coincidencias para este producto</p>
        </div>
      </div>
      <div v-else class="row justify-center">
        <div class="q-my-lg row" v-if="loader">
          <q-spinner-gears size="50px" color="header" />
        </div>
        <div class="col-11 row" :class="$q.screen.lt.md ? 'justify-center' : 'justify-start'" v-if="data.length > 0 && loader === false">
          <q-card
            class="my-card q-my-md q-px-sm col-xl-3 col-lg-3 col-md-3 col-sm-12 col-xs-12 justify-center"
            v-for="(producto, index) in data"
            :key="index"
            flat
          >
            <q-item :to="{ path: '/detalles', query: { ref: producto.ref }}">
              <q-img
                :src="producto.highlight ? config.api.url + producto.highlight : config.api.url + producto.image[0]"
                height="280px"
                width="200px"
                contain
              />
            </q-item>

            <q-card-section class="row justify-center">
              <div class="text-subtitle1 text-bold col-12" style="color:#4b4b4b;">{{producto.name}}</div>
              <div
                style="color:#808080;"
                class="text-caption text-bold col-12"
              >{{producto.category.name}}</div>
              <div style="font-size:10px;color:#808080;" class="col-12 ellipsis">{{producto.description ? producto.description : 'No hay descripcion del producto'}}</div>
              <div class="text-h5 text-bold col-12" style="color:#4b4b4b;">$ {{format(producto.price)}}</div>
              <div class="row justify-between col-12">
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pa-xs">
                  <q-btn
                    :to="{ path: '/detalles', query: { ref: producto.ref }}"
                    style="font-size: 12px"
                    class="full-width text-white"
                    color="header"
                    no-caps
                  >
                    <div class="ellipsis">Ver producto</div>
                  </q-btn>
                </div>
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pa-xs">
                  <q-btn
                    style="font-size: 12px"
                    class="full-width text-white"
                    color="header"
                    label="Comprar"
                    no-caps
                    @click="add(producto)"
                  />
                </div>
              </div>
            </q-card-section>
            <q-separator class="q-mt-sm" style="height:1px;background-color:#4b4b4b;" />
          </q-card>
        </div>
        <div class="q-ma-xl" v-else>
          <span>No hay productos disponibles</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  SUBCATEGORY_QUERY,
  CATEGORY_QUERY,
  TAG_QUERY,
  PRODUCTOS_QUERY
} from "@/graphql/products";
import config from "@/config";
export default {
  name: "productos",
  data() {
    return {
      config: config,
      data: [],
      dataAll: [],
      filtroCategory: "",
      filtroSubCategory: "",
      filtroTag: "",
      tags: [],
      subcategories: [],
      selectSubcategory: false,
      botonBuscar: false,
      mensaje: false,
      categories: [],
      loader: true
    };
  },
  async created() {
    let funciones = [
      this.allSubcategories(),
      this.allProducts(),
      this.allCategories(),
      this.allTags()
    ];
    await this.loading(funciones);
    if (this.$route.query.search) {
      this.searchProducto(this.$route.query.search);
    }
  },
  watch: {
    "$route.query": function(newValue) {
      console.log("watch funcioann");
      console.log(newValue);
      if (newValue.search) this.searchProducto(newValue.search);
      else if (this.$route.name === "productos")
        this.data = Object.assign([], this.dataAll);
    },
    filtroCategory(newValue) {
      if (this.filtroCategory !== "") {
        return (this.botonBuscar = true);
      }
    },
    filtroSubCategory(newValue) {
      if (this.filtroSubCategory !== "") {
        return (this.botonBuscar = true);
      }
    },
    filtroTag(newValue) {
      if (this.filtroTag !== "") {
        return (this.botonBuscar = true);
      }
    }
  },
  methods: {
    allCategories() {
      return this.$apollo
        .query({
          query: CATEGORY_QUERY,
          fetchPolicy: "network-only"
        })
        .then(response => {
          console.log(response.data.AllCategories);
          this.categories = Object.assign([], response.data.AllCategories);
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    format(input) {
      let num = input
      if (!isNaN(num)) {
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/,'');
        return num;
      }
    },
    allTags() {
      return this.$apollo
        .query({
          query: TAG_QUERY,
          fetchPolicy: "network-only"
        })
        .then(response => {
          console.log(response.data.AllTags);
          this.tags = Object.assign([], response.data.AllTags);
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    allProducts() {
      return this.$apollo
        .query({
          query: PRODUCTOS_QUERY,
          fetchPolicy: "network-only"
        })
        .then(response => {
          console.log(response.data.AllProducts);
          this.data = Object.assign([], response.data.AllProducts);
          this.dataAll = Object.assign([], response.data.AllProducts);
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    // getDetail(producto) {
    //   this.$router.push({ name: "detalles", params: producto });
    // },
    buscarProducto() {
      this.data = Object.assign([], this.dataAll);
      if (this.filtroCategory.name)
        this.data = this.data.filter(
          dat => dat.category.name === this.filtroCategory.name
        );
      if (this.filtroSubCategory.name)
        this.data = this.data.filter(
          dat => dat.subcategory.name === this.filtroSubCategory.name
        );
      if (this.filtroTag.name)
        this.data = this.data.filter(dat =>
          dat.tags.find(tag => tag.name === this.filtroTag.name)
        );

      if (this.data.length === 0) {
        this.mensaje = true;
      } else {
        this.mensaje = false;
      }
    },
    searchProducto(search) {
      console.log(search);
      this.data = Object.assign([], this.dataAll);
      this.data = this.data.filter(
        dat => dat.name.toLowerCase().indexOf(search.toLowerCase()) > -1
      );
      if (this.data.length === 0) {
        this.mensaje = true;
      } else {
        this.mensaje = false;
      }
    },
    clearAll() {
      console.log("erase");
      this.filtroCategory = "";
      this.filtroSubCategory = "";
      this.filtroTag = "";
      this.botonBuscar = "";
      this.mensaje = false;
      this.data = Object.assign([], this.dataAll);
    },
    add(producto) {
      console.log(producto.highlight)

      let item = {
        name: producto.name,
        price: producto.price,
        highlight: producto.highlight,
        image: producto.image,
        model: producto.model,
        category: producto.category,
        important: producto.important,
        description: producto.description,
        subcategory: producto.subcategory,
        tag: producto.tag,
        ref: producto.ref,
        ctd: producto.ctd,
        createdAt: producto.createdAt
      };
      this.$store.commit("addItem", item);
      this.$q.notify({
        message: "Añadido al carrito de compras",
        color: "positive"
      });
    },
    allSubcategories() {
      return this.$apollo
        .query({
          query: SUBCATEGORY_QUERY,
          fetchPolicy: "network-only"
        })
        .then(response => {
          this.subcategories = Object.assign(
            [],
            response.data.AllSubcategories
          );
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    async loading(callbacks) {
      this.loader = true;
      for (let callback of callbacks) {
        await callback;
      }
      this.loader = false;
      return this.loader;
    }
  }
};
</script>
