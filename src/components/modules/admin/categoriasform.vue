<template>
  <div class="col-12 q-ma-sm">
    <q-card flat bordered class="my-card" style="width:100%;">
      <q-card-section class="text-center">
        <div class="text-h6" v-if="updating === false">Agregar categoria</div>
        <div class="text-h6" v-if="updating === true">Modificar categoria</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input v-model="name" label="Nombre" />
        <div v-if="updating === false">
          <q-select
            v-model="subcategory"
            :options="subcategories"
            option-label="name"
            multiple
            use-chips
            stack-label
            label="Sub-categoria"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section>
                  <q-item-label class="text-vinotinto" v-html="scope.opt" v-if="scope.opt === 'Añadir'"/>
                  <q-item-label v-html="scope.opt.name" v-else/>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-select
            v-model="tagsgroup"
            :options="grupostags"
            option-label="name"
            label="Grupo de etiquetas"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section>
                  <q-item-label class="text-vinotinto" v-html="scope.opt" v-if="scope.opt === 'Añadir'"/>
                  <q-item-label v-html="scope.opt.name" v-else/>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div v-if="updating === true">
          <q-select
            v-model="subcategory"
            :options="subcategories"
            option-label="name"
            stack-label
            multiple
            use-chips
            label="Sub-categoria"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section>
                  <q-item-label class="text-vinotinto" v-html="scope.opt" v-if="scope.opt === 'Añadir'"/>
                  <q-item-label v-html="scope.opt.name" v-else/>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-select
            v-model="tagsgroup"
            :options="grupostags"
            option-label="name"
            map-options
            stack-label
            use-chips
            label="Grupo de etiquetas"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section>
                  <q-item-label class="text-vinotinto" v-html="scope.opt" v-if="scope.opt === 'Añadir'"/>
                  <q-item-label v-html="scope.opt.name" v-else/>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </q-card-section>
      <q-card-section class="row justify-between">
        <q-btn
          color="white"
          text-color="vinotinto"
          v-if="updating === false"
          class="q-mt-md"
          @click="addCategory()"
          label="Agregar"
        />
        <q-btn
          color="white"
          text-color="vinotinto"
          v-if="updating === true"
          class="q-mt-md"
          @click="updatingCategory()"
          label="Modificar"
        />
        <q-btn
          color="negative"
          class="q-mt-md"
          @click="cancelar()"
          label="cancelar"
        />
      </q-card-section>
    </q-card>
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
export default {
  name: "categoriasform",
  components: {},
  props: ["updating", "category"],
  data() {
    return {
      grupostags: [],
      subcategories: [],
      id: "",
      name: "",
      subcategory: [],
      tagsgroup: [],
    }
  },
  watch: {
    subcategory(newValue) {
      if(newValue[0] === 'Añadir') {
        this.$router.push('/homeAdmin?tab=subcategorias')
      }
    },
    tagsgroup(newValue) {
      if(newValue === 'Añadir') {
        this.$router.push('/homeAdmin?tab=grupo de etiquetas')
      }
    }
  },
  async mounted() {
    await this.allSubcategories();
    await this.allGrupoTags();
    this.grupostags.push("Añadir")
    this.subcategories.push("Añadir")
    if (this.updating) {
      this.id = this.category._id
      this.name = this.category.name;
      this.subcategory = this.category.subcategory;
      this.tagsgroup = this.category.tagsgroup[0].name ? this.category.tagsgroup[0] : [];
    }
  },
  methods: {
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
    allGrupoTags() {
      return this.$apollo
        .query({
          query: GRUPOTAGS_QUERY,
          fetchPolicy: "network-only"
        })
        .then(response => {
          this.grupostags = Object.assign([], response.data.AllTagsgroup);
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    addCategory() {
      const data = {
        name: this.name,
        subcategory: this.subcategory,
        tagsgroup: this.tagsgroup
      };
      this.$apollo
        .mutate({
          mutation: ADDCATEGORY_MUTATION,
          variables: {
            data
          }
        })
        .then(response => {
          this.name = "";
          this.subcategory = "";
          this.tagsgroup = "";
          this.$emit("created");
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    updatingCategory() {
      const data = {
        name: this.name,
        subcategory: this.subcategory,
        tagsgroup: this.tagsgroup
      };
      this.$apollo
        .mutate({
          mutation: CATEGORY_UPDATE,
          variables: {
            categoryId: this.id,
            data
          }
        })
        .then(response => {
          this.name = "";
          this.subcategory = "";
          this.tagsgroup = "";
          this.$emit("uploaded");
        })
        .catch(err => {
          console.log("error CATEGORY: ", err);
        });
    },
    cancelar() {
      this.$emit("cancel", "category");
    },
  }
};
</script>