<template>
  <div class="col-12 q-ma-sm">
    <q-card flat bordered class="my-card" style="width:100%;">
      <q-card-section class="text-center">
        <div class="text-h6" v-if="updating === false">Agregar Grupo de etiquetas</div>
        <div class="text-h6" v-if="updating === true">Modificar Grupo de etiquetas</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input v-model="name" label="Nombre" />
        <div>
          <q-select
            v-model="selectedTags"
            :options="tags"
            option-label="name"
            multiple
            use-chips
            stack-label
            label="Etiquetas"
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
          @click="addGruposTag()"
          label="Agregar"
        />
        <q-btn
          color="white"
          text-color="vinotinto"
          v-if="updating === true"
          class="q-mt-md"
          @click="updatingGrupostag()"
          label="Guardar"
        />
        <q-btn color="negative" class="q-mt-md" @click="cancelar()" label="cancelar" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import {
  GRUPOTAGS_QUERY,
  TAG_QUERY,
  ADDGRUPOSTAG_MUTATION,
  GRUPOSTAG_DELETE,
  GRUPOSTAG_UPDATE
} from "@/graphql/products";
export default {
  name: "grupostagsform",
  components: {},
  props: ["updating", "tagsgroup"],
  data() {
    return {
      tags: [],
      id: "",
      name: "",
      selectedTags: []
    };
  },
  async mounted() {
    await this.allTags();
    this.tags.push("Añadir");
    if (this.updating) {
      this.id = this.tagsgroup._id;
      this.name = this.tagsgroup.name;
      this.selectedTags = this.tagsgroup.tags;
    }
  },
  watch: {
    selectedTags(newValue) {
      if (newValue[0] === "Añadir") {
        this.$router.push("/homeAdmin?tab=etiquetas");
      }
    }
  },
  methods: {
    allTags() {
      return this.$apollo
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
    addGruposTag() {
      const data = {
        name: this.name,
        tags: this.selectedTags
      };
      this.$apollo
        .mutate({
          mutation: ADDGRUPOSTAG_MUTATION,
          variables: {
            data
          }
        })
        .then(response => {
          this.name = "";
          this.tag = "";
          this.$emit("created");
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    updatingGrupostag() {
      const data = {
        name: this.name,
        tags: this.selectedTags
      };
      this.$apollo
        .mutate({
          mutation: GRUPOSTAG_UPDATE,
          variables: {
            grupostagId: this.id,
            data
          }
        })
        .then(response => {
          this.name = "";
          this.tag = "";
          this.$emit("uploaded");
        })
        .catch(err => {
          console.log("error Grupos tag: ", err);
        });
    },
    cancelar() {
      this.$emit("cancel", "tagsgroup");
    }
  }
};
</script>