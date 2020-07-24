<template>
  <div class="row justify-center">
    <div class="col-lg-12 col-xl-12 col-md-12 col-sm-12">
      <q-table :square="false" :data="tags" :columns="columns" :dense="$q.screen.lt.md" row-key="name">
        <template v-slot:top>
          <p class="text-h6">Lista de Etiquetas</p>
          <q-space />
          <q-btn label="Agregar Etiqueta" icon="mdi-plus" flat color="vinotinto">
            <q-popup-edit v-model="name">
              <template v-slot="{ initialValue, value, emitValue, validate, set, cancel }">
                <q-input
                  autofocus
                  dense
                  :value="name"
                  hint="Nombre de la Etiqueta"
                  @input="emitValue"
                  v-on:keyup.enter="addTags()"
                >
                  <template v-slot:after>
                    <q-btn flat dense color="negative" icon="cancel" @click.stop="cancel" />
                    <q-btn
                      flat
                      dense
                      color="positive"
                      icon="check_circle"
                      @click.stop="addTags()"
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
              <q-popup-edit v-model="props.row.name" color="vinotinto" buttons @save="(value) => updateTag(props.row._id, value)">
                <q-input v-model="props.row.name" dense autofocus counter />
              </q-popup-edit>
              <q-tooltip content-class="bg-vinotinto text-white" anchor="center right" self="center middle" :offset="[2, 2]">
                Click para editar
              </q-tooltip>
            </td>
            <td class="text-center" key="tagsgroup">
              <q-badge
                color="vinotinto"
                v-for="(tg,index) in inTagsgroup(props.row.name)"
                :key="index"
                class="q-ma-sm"
              >{{tg.name}}</q-badge>
            </td>
            <td class="text-center" key="actions">
              <q-btn
                @click="deleteTag(props.row._id)"
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
import { GRUPOTAGS_QUERY, TAG_QUERY, ADDTAG_MUTATION, TAG_DELETE, UPDATE_TAG } from "@/graphql/products";
export default {
  name: "tags",
  components: {},
  data() {
    return {
      expanded: false,
      model: "",
      text: "",
      name: "",
      tags: [],
      grupostags: [],
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
          name: "tagsgroup",
          align: "center",
          label: "Grupo de Etiquetas",
          field: "tagsgroup"
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
    this.allGrupoTags();
    this.allTags();
  },
  methods: {
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
    allGrupoTags() {
      this.$apollo
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
    addTags() {
      const data = {
        name: this.name
      };
      this.$apollo
        .mutate({
          mutation: ADDTAG_MUTATION,
          variables: {
            data
          }
        })
        .then(response => {
          this.name = "";
          this.$q.notify({
            message: 'Etiqueta creada con exito',
            color: "positive"
          });
          this.allTags();
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    deleteTag(tagID) {
      this.$apollo
        .mutate({
          mutation: TAG_DELETE,
          variables: {
            tagId: tagID
          }
        })
        .then(response => {
          var vm = this;
          this.tags.some(function(tag, index) {
            if (tag.id === tagID) {
              vm.tags.splice(index, 1);
            }
          });
          this.allTags();
        })
        .catch(err => {
          console.log("error delete TAG: ", err);
        });
    },
    inTagsgroup(tag) {
      let array = []
      array =  this.grupostags.filter(cat => {
        return cat.tags.some(subcat => subcat.name == tag)
      })
      return array
    },
    updateTag(id, name) {
      this.$apollo
        .mutate({
          mutation: UPDATE_TAG,
          variables: {
            id: id,
            data: {
              name: name
            }
          }
        })
        .then(response => {
          this.allTags();
          this.allGrupoTags()
        })
    }
  }
};
</script>