<template>
  <div class="row justify-center">
    <div @click="$router.push('/homeAdmin?tab=categorias')" class="col-lg-3 col-xl-3 col-md-3 col-sm-12 q-pa-md">
      <q-card bordered class="my-card">
        <q-card-section horizontal>
          <q-card-section class="q-pa-md">
            <div class="text-overline">Categorias</div>
            <div class="text-h5 q-mt-sm q-mb-xs">{{categories.length}}</div>
            <div class="text-caption text-grey">Click para gestionarlas.</div>
          </q-card-section>

          <q-card-section class="absolute-top-right">
            <q-icon name="mdi-vector-line" size="32px" />
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
    <div @click="$router.push('/homeAdmin?tab=subcategorias')" class="col-lg-3 col-xl-3 col-md-3 col-sm-12 q-pa-md">
      <q-card bordered class="my-card">
        <q-card-section horizontal>
          <q-card-section class="q-pa-md">
            <div class="text-overline ellipsis">Sub-Categorias</div>
            <div class="text-h5 q-mt-sm q-mb-xs">{{subcategories.length}}</div>
            <div class="text-caption text-grey">Click para gestionarlas.</div>
          </q-card-section>

          <q-card-section class="absolute-top-right">
            <q-icon name="mdi-vector-polyline" size="32px" />
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
    <!-- <div @click="$router.push('/homeAdmin?tab=marcas')" class="col-lg-3 col-xl-3 col-md-3 col-sm-12 q-pa-md">
      <q-card bordered class="my-card">
        <q-card-section horizontal>
          <q-card-section class="q-pa-md">
            <div class="text-overline">Marcas</div>
            <div class="text-h5 q-mt-sm q-mb-xs">{{branchs.length}}</div>
            <div class="text-caption text-grey">Click para gestionarlas.</div>
          </q-card-section>

          <q-card-section class="absolute-top-right">
            <q-icon name="mdi-star-outline" size="32px" />
          </q-card-section>
        </q-card-section>
      </q-card>
    </div> -->
    <div @click="$router.push('/homeAdmin?tab=etiquetas')" class="col-lg-3 col-xl-3 col-md-3 col-sm-12 q-pa-md">
      <q-card bordered class="my-card">
        <q-card-section horizontal>
          <q-card-section class="q-pa-md">
            <div class="text-overline">Etiquetas</div>
            <div class="text-h5 q-mt-sm q-mb-xs">{{tags.length}}</div>
            <div class="text-caption text-grey">Click para gestionarlas.</div>
          </q-card-section>

          <q-card-section class="absolute-top-right">
            <q-icon name="mdi-tag" size="32px" />
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
    <div @click="$router.push('/homeAdmin?tab=productos')" class="col-lg-5 col-xl-5 col-md-5 col-sm-12 q-pa-md">
      <q-card bordered class="my-card">
        <q-card-section>
          <q-card-section class="q-pa-md">
            <div class="text-overline">Productos: {{products.length}}</div>
            <q-list separator>
              <q-item clickable v-ripple v-for="producto in productsReduced" :key="producto.ref">
                <q-item-section avatar>
                  <q-avatar rounded>
                    <img :src="config.api.url + producto.highlight" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{producto.name}}</q-item-label>
                  <q-item-label
                    caption
                    class="ellipsis"
                  >{{producto.category.name}} - {{producto.subcategory.name}}</q-item-label>
                </q-item-section>

                <q-item-section side top>
                  <q-item-label caption>${{producto.price}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
    <div @click="$router.push('/homeAdmin?tab=ordenes')" class="col-lg-7 col-xl-7 col-md-7 col-sm-12 q-pa-md">
      <q-card bordered class="my-card">
        <q-card-section>
          <q-card-section class="q-pa-md">
            <div class="text-overline">Ordenes: {{orders.length}}</div>
            <q-table
              dense
              :data="orders"
              :columns="columns"
              row-key="name"
              hide-bottom
              :pagination.sync="initialPagination"
              flat
            />
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>
import {
  PRODUCTOS_QUERY,
  CATEGORY_QUERY,
  SUBCATEGORY_QUERY,
  TAG_QUERY,
  ADDPRODUCT_MUTATION,
  PRODUCT_UPDATE,
  DELETE_PRODUCT_MUTATION
} from "@/graphql/products";
import { ALL_ORDER_QUERY } from "@/graphql/orders";
import config from "@/config";
export default {
  name: "productos",
  components: {},
  data() {
    return {
      config: config,
      products: [],
      categories: [],
      subcategories: [],
      tags: [],
      orders: [],
      productsReduced: [],
      columns: [
        {
          name: "asc",
          required: true,
          label: "Orden Nª",
          align: "center",
          field: row => row.orderNumber,
          format: val => `000${val}`,
          sortable: true
        },
        {
          name: "products",
          label: "Ctd de productos:",
          field: row => row.products,
          format: val => val.length
        },
        { name: "status", label: "Estado:", field: "status" },
        {
          name: "price",
          label: "Valor:",
          field: "price",
          format: val => `${val}$`
        }
      ],
      initialPagination: {
        sortBy: "asc",
        descending: true,
        rowsPerPage: 5
      }
    }
  },
  created() {
    this.allProducts();
    this.allCategories();
    this.allSubcategories();
    this.allTags();
    this.allOrders();
  },
  methods: {
    allProducts() {
      this.$apollo
        .query({
          query: PRODUCTOS_QUERY,
          fetchPolicy: "network-only"
        })
        .then(response => {
          this.products = Object.assign([], response.data.AllProducts);
          this.products = this.products.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          let count = 4
          if (this.products.length < 4) count = this.products.length
          for (let cont = 0; cont < count; cont++) {
            this.productsReduced.push(this.products[cont]);
          }
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    allCategories() {
      this.$apollo
        .query({
          query: CATEGORY_QUERY,
          fetchPolicy: "network-only"
        })
        .then(response => {
          this.categories = Object.assign([], response.data.AllCategories);
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    allSubcategories() {
      this.$apollo
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
    allTags() {
      this.$apollo
        .query({
          query: TAG_QUERY,
          fetchPolicy: "network-only"
        })
        .then(response => {
          this.tags = Object.assign([], response.data.AllTags);
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    // allBranchs() {
    //   this.$apollo
    //     .query({
    //       query: BRANCH_QUERY,
    //       fetchPolicy: "network-only"
    //     })
    //     .then(response => {
    //       this.branchs = Object.assign([], response.data.AllBranchs);
    //     })
    //     .catch(err => {
    //       console.log("hubo un error: ", err);
    //     });
    // },
    allOrders() {
      this.$apollo
        .query({
          query: ALL_ORDER_QUERY,
          fetchPolicy: "network-only"
        })
        .then(response => {
          this.orders = Object.assign([], response.data.AllOrders);
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    }
  }
};
</script>