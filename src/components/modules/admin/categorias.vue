<template>
  <div class="row justify-center">
    <q-tab-panels class="col-12" v-model="tab" animated style="background-color:#f7f8fb">
      <q-tab-panel name="category">
        <div class="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <q-table :square="false" :data="categories" :columns="columns" :dense="$q.screen.lt.md" row-key="name">
            <template v-slot:top>
              <p class="text-h6">Lista de categorias</p>
              <q-space />
              <q-btn
                label="Agregar Categoria"
                icon="mdi-plus"
                flat
                color="vinotinto"
                @click="agregarCategoria()"
              ></q-btn>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <td class="text-center" key="name">{{props.row.name}}</td>
                <td class="text-center" key="subcategory">
                  <q-badge
                    color="vinotinto"
                    v-for="(sub,index) in props.row.subcategory"
                    :key="index"
                    class="q-ma-sm"
                  >{{sub.name}}</q-badge>
                </td>
                <td class="text-center" key="tagsgroup">
                  <q-badge
                    color="vinotinto"
                    v-for="(eti,index) in props.row.tagsgroup"
                    :key="index"
                  >{{eti.name}}</q-badge>
                </td>
                <td class="text-center" key="actions">
                  <q-btn
                    @click="updateCategories(props.row)"
                    flat
                    round
                    color="vinotinto"
                    icon="mdi-square-edit-outline"
                  >
                    <q-tooltip content-class="bg-vinotinto" :offset="[10, 10]">Editar</q-tooltip>
                  </q-btn>
                  <q-btn
                    @click="deleteCategory(props.row._id)"
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
        <categoriasform
          :updating="true"
          :category="categorySelected"
          @uploaded="allCategories()"
          @cancel="(ev) => tab = ev"
          v-if="tab === 'update'"
        ></categoriasform>
      </q-tab-panel>
      <q-tab-panel name="create">
        <categoriasform
          :updating="false"
          :category="null"
          v-if="tab === 'create'"
          @created="allCategories()"
          @cancel="(ev) => tab = ev"
        ></categoriasform>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script>
import {
  SUBCATEGORY_QUERY,
  GRUPOTAGS_QUERY,
  CATEGORY_QUERY,
  ADDCATEGORY_MUTATION,
  CATEGORY_DELETE,
  CATEGORY_UPDATE
} from "@/graphql/products";
import categoriasform from "./categoriasform";
export default {
  name: "categorias",
  components: {
    categoriasform
  },
  data() {
    return {
      columns: [
        {
          name: "name",
          required: true,
          label: "Nombre",
          align: "center",
          field: row => row.name,
          sortable: true
        },
        {
          name: "subcategory",
          align: "center",
          label: "Subcategorias",
          field: "subcategory"
        },
        {
          name: "tagsgroup",
          align: "center",
          label: "Grupos de etiquetas",
          field: "tagsgroup"
        },
        {
          name: "actions",
          align: "center",
          label: "Acciones",
          field: "actions"
        }
      ],
      tab: "category",
      dataCat: [],
      categories: [],
      updating: false,
      categorySelected: ""
    };
  },
  created() {
    this.allCategories();
  },
  methods: {
    allCategories() {
      this.$apollo
        .query({
          query: CATEGORY_QUERY,
          fetchPolicy: "network-only"
        })
        .then(response => {
          console.log(response.data.AllCategories);
          this.categories = Object.assign([], response.data.AllCategories);
          this.tab = "category";
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    deleteCategory(categoryID) {
      this.$apollo
        .mutate({
          mutation: CATEGORY_DELETE,
          variables: {
            categoryId: categoryID
          }
        })
        .then(response => {
          var vm = this;
          this.categories.some(function(category, index) {
            if (category.id === categoryID) {
              vm.categories.splice(index, 1);
            }
          });
          this.$q.notify({
            message: 'Categoria Borrada con exito',
            color: "positive"
          });
          this.allCategories();
        })
        .catch(err => {
          console.log("error delete CATEGORY: ", err);
          this.$q.notify({
            message: err.message.split("GraphQL error:"),
            color: "negative"
          });
        });
    },
    updateCategories(data) {
      this.tab = "update";
      this.categorySelected = data;
    },
    agregarCategoria() {
      this.tab = "create";
    }
  }
};
</script>