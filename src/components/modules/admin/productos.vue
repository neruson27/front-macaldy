<template>
  <div class="row justify-center">
    <q-tab-panels class="col-12" v-model="tab" animated style="background-color:#f7f8fb">
      <q-tab-panel name="products">
        <div class="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <q-table :square="false" :filter="filter" :data="allProduct" :columns="columns" :dense="$q.screen.lt.md" row-key="name">
            <template v-slot:top-left>
              <p class="text-h6">Lista de productos</p>
            </template>
            <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-btn label="Agregar Producto" icon="mdi-plus" flat color="vinotinto" @click="agregarProducto()"></q-btn>
          </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <td class="text-left" key="highlight">
                  <q-avatar rounded>
                    <img :src="config.api.url + props.row.highlight" />
                  </q-avatar>
                </td>
                <td class="text-left" key="name">{{props.row.name}}</td>
                <td class="text-left" key="categoy">{{props.row.category.name}}</td>
                <td class="text-left" key="subcategory">{{props.row.subcategory.name}}</td>
                <td class="text-left" key="ctd">{{props.row.ctd}}</td>
                <td class="text-left" key="tags">
                  <q-badge
                    color="vinotinto"
                    v-for="(eti,index) in props.row.tags"
                    :key="index"
                  >{{eti.name}}</q-badge>
                </td>
                <td class="text-left" key="actions">
                  <q-btn
                    @click="updateProduct(props.row)"
                    flat
                    round
                    color="vinotinto"
                    icon="mdi-square-edit-outline"
                  >
                    <q-tooltip content-class="bg-vinotinto" :offset="[10, 10]">Editar</q-tooltip>
                  </q-btn>
                  <q-btn
                    @click="deleteProduct(props.row._id)"
                    flat
                    round
                    color="vinotinto"
                    icon="mdi-delete"
                  >
                    <q-tooltip content-class="bg-vinotinto" :offset="[10, 10]">Eliminar</q-tooltip>
                  </q-btn>
                </td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </q-tab-panel>
      <q-tab-panel name="update">
        <productform :updating="true" :product="productSelected" @uploaded="allProducts()" @cancel="(ev) => tab = ev" v-if="tab === 'update'" :categories="categories" :subcategories="subcategories" :tags="tags" :branchs="branchs"></productform>
      </q-tab-panel>
      <q-tab-panel name="create">
        <productform :updating="false" :product="null" v-if="tab === 'create'" @created="allProducts()" @cancel="(ev) => tab = ev" :categories="categories" :subcategories="subcategories" :tags="tags" :branchs="branchs"></productform>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script>
import {
  PRODUCTOS_QUERY,
  CATEGORY_QUERY,
  SUBCATEGORY_QUERY,
  TAG_QUERY,
  BRANCH_QUERY,
  ADDPRODUCT_MUTATION,
  PRODUCT_UPDATE,
  DELETE_PRODUCT_MUTATION
} from "@/graphql/products";
import config from "@/config";
import productform from "./productosform"
export default {
  name: "productos",
  components: {
    productform
  },
  data() {
    return {
      config: config,
      columns: [
        {
          name: "highlight",
          align: "left",
          label: "",
          field: "highlight"
        },
        {
          name: "name",
          required: true,
          label: "Nombre",
          align: "left",
          field: row => row.name,
          sortable: true
        },
        {
          name: "category",
          align: "left",
          label: "Categorias",
          field: row => row.category.name,
          sortable: true
        },
        {
          name: "subcategory",
          align: "left",
          label: "Sub-Categorias",
          field: row => row.subcategory.name,
          sortable: true
        },
        { name: "ctd", align: "left", label: "Ctd", field: "ctd" },
        { name: "tags", align: "left", label: "Etiquetas", field: "tags" },
        { name: "actions", align: "left", label: "Acciones", field: "actions" }
      ],
      tab: 'products',
      allProduct: [],
      categories: [],
      subcategories: [],
      tags: [],
      branchs: [],
      name: "",
      branch: "",
      description: "",
      description_long: "",
      model: "",
      price: "",
      highlight: '',
      image: [],
      audio: '',
      category: "",
      subcategory: "",
      tag: "",
      ref: "",
      ctd: 0,
      important: false,
      updating: false,
      productSelected: null,
      filter: '',
      dataPro: []
    };
  },
  created() {
    this.allProducts();
    this.allCategories();
    this.allSubcategories();
    this.allTags();
    this.allBranchs();
  },
  methods: {
    allProducts() {
      this.$apollo
        .query({
          query: PRODUCTOS_QUERY,
          fetchPolicy: "network-only"
        })
        .then(response => {
          this.allProduct = Object.assign([], response.data.AllProducts);
          this.tab = "products"
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
    allBranchs() {
      this.$apollo
        .query({
          query: BRANCH_QUERY,
          fetchPolicy: "network-only"
        })
        .then(response => {
          this.branchs = Object.assign([], response.data.AllBranchs);
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    deleteProduct(productID) {
      this.$apollo
        .mutate({
          mutation: DELETE_PRODUCT_MUTATION,
          variables: {
            productId: productID
          }
        })
        .then(response => {
          var vm = this;
          this.allProduct.some(function(product, index) {
            if (product.id === productID) {
              vm.allProduct.splice(index, 1);
            }
          });
          this.allProducts();
        })
        .catch(err => {
          console.log("error delete product: ", err);
          this.$q.notify({
            message: err.message.split("GraphQL error:"),
            color: "negative"
          });
        });
    },
    updateProduct(data) {
      this.tab = "update"
      this.productSelected = data
    },
    agregarProducto() {
      this.tab = "create"
    }
  }
};
</script>