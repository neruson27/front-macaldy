<template>
  <div class="row justify-center">
    <div class="col-lg-12 col-xl-12 col-md-12 col-sm-12">
      <q-table :square="false" :data="subcategories" :columns="columns" :dense="$q.screen.lt.md" row-key="name">
        <template v-slot:top>
          <p class="text-h6">Lista de Sub-Categorias</p>
          <q-space />
          <q-btn label="Agregar Sub-Categoria" icon="mdi-plus" flat color="vinotinto">
            <q-popup-edit v-model="name">
              <template v-slot="{ initialValue, value, emitValue, validate, cancel }">
                <q-input
                  autofocus
                  dense
                  :value="name"
                  hint="Nombre de la Sub-categoria"
                  @input="emitValue"
                  v-on:keyup.enter="addSubcategory()"
                >
                  <template v-slot:after>
                    <q-btn flat dense color="negative" icon="cancel" @click.stop="cancel" />
                    <q-btn
                      flat
                      dense
                      color="positive"
                      icon="check_circle"
                      @click.stop="addSubcategory()"
                      :disable="validate(value) === false || initialValue === value"
                    />
                  </template>
                </q-input>
              </template>
            </q-popup-edit>
          </q-btn>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <td class="text-center" key="name">
              {{props.row.name}}
              <q-popup-edit v-model="props.row.name" color="vinotinto" buttons @save="(value) => updateSubcategory(props.row._id, value)">
                <q-input v-model="props.row.name" dense autofocus counter />
              </q-popup-edit>
              <q-tooltip content-class="bg-vinotinto text-white" anchor="center right" self="center middle" :offset="[2, 2]">
                Click para editar
              </q-tooltip>
            </td>
            <td class="text-center" key="category">
              <q-badge
                color="vinotinto"
                v-for="(sub,index) in inCategory(props.row.name)"
                :key="index"
                class="q-ma-sm"
              >{{sub.name}}</q-badge>
            </td>
            <td class="text-center" key="actions">
              <q-btn
                @click="deleteSubcategory(props.row._id)"
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
  </div>
</template>
<script>
import {
  CATEGORY_QUERY,
  SUBCATEGORY_QUERY,
  ADDSUBCATEGORY_MUTATION,
  UPDATE_SUBCATEGORY,
  SUBCATEGORY_DELETE
} from "@/graphql/products";
export default {
  name: "subcategorias",
  components: {},
  data() {
    return {
      expanded: false,
      model: "",
      text: "",
      name: "",
      subcategories: [],
      categories: [],
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
          name: "category",
          align: "center",
          label: "Category",
          field: "category"
        },
        {
          name: "actions",
          align: "center",
          label: "Acciones",
          field: "actions"
        }
      ]
    };
  },
  created() {
    this.allSubcategories();
    this.allCategories();
  },
  methods: {
    allSubcategories() {
      this.$apollo
        .query({
          query: SUBCATEGORY_QUERY,
          fetchPolicy: "network-only"
        })
        .then(response => {
          console.log(response.data.AllSubcategories);
          this.subcategories = Object.assign(
            [],
            response.data.AllSubcategories
          );
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
          console.log(response.data.AllCategories);
          this.categories = Object.assign([], response.data.AllCategories);
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    inCategory(subCategory) {
      console.log('incategory')
      console.log(subCategory)
      let array = []
      array =  this.categories.filter(cat => {
        return cat.subcategory.some(subcat => subcat.name == subCategory)
      })
      return array
    },
    addSubcategory() {
      const data = {
        name: this.name
      };
      this.$apollo
        .mutate({
          mutation: ADDSUBCATEGORY_MUTATION,
          variables: {
            data
          }
        })
        .then(response => {
          console.log(response);
          this.name = "";
          this.$q.notify({
            message: 'Sub-Categoria creada con exito',
            color: "positive"
          });
          this.allSubcategories();
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    deleteSubcategory(subcategoryID) {
      this.$apollo
        .mutate({
          mutation: SUBCATEGORY_DELETE,
          variables: {
            subcategoryId: subcategoryID
          }
        })
        .then(response => {
          var vm = this;
          this.subcategories.some(function(subcategory, index) {
            if (subcategory.id === subcategoryID) {
              vm.subcategories.splice(index, 1);
            }
          });
          this.$q.notify({
            message: 'Sub-Categoria eliminada con exito',
            color: "negative"
          });
          this.allSubcategories();
        })
        .catch(err => {
          console.log("error delete SUBCATEGORY: ", err);
          this.$q.notify({
            message: err.message.split("GraphQL error:"),
            color: "negative"
          });
        });
    },
    updateSubcategory(id, name) {
      this.$apollo
        .mutate({
          mutation: UPDATE_SUBCATEGORY,
          variables: {
            id: id,
            data: {
              name: name
            }
          }
        })
        .then(response => {
          console.log(response);
          this.allSubcategories();
          this.allCategories()
        })
    }
  }
};
</script>