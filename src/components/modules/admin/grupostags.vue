<template>
  <div class="row justify-center">
    <q-tab-panels class="col-12" v-model="tab" animated style="background-color:#f7f8fb">
      <q-tab-panel name="tagsgroup">
        <div class="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <q-table :square="false" :data="grupostags" :columns="columns" :dense="$q.screen.lt.md" row-key="name">
            <template v-slot:top>
              <p class="text-h6">Lista de Grupos de etiquetas</p>
              <q-space />
              <q-btn
                label="Agregar Grupo de etiquetas"
                icon="mdi-plus"
                flat
                color="vinotinto"
                @click="agregarTagsgroup()"
              ></q-btn>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <td class="text-center" key="name">{{props.row.name}}</td>
                <td class="text-center" key="tags">
                  <q-badge
                    color="vinotinto"
                    v-for="(eti,index) in props.row.tags"
                    :key="index"
                    class="q-ma-sm"
                  >{{eti.name}}</q-badge>
                </td>
                <td class="text-center" key="actions">
                  <q-btn
                    @click="updateTagsgroup(props.row)"
                    flat
                    round
                    color="vinotinto"
                    icon="mdi-square-edit-outline"
                  >
                    <q-tooltip content-class="bg-vinotinto" :offset="[10, 10]">Editar</q-tooltip>
                  </q-btn>
                  <q-btn
                    @click="deleteGrupotag(props.row._id)"
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
        <grupostagsform
          :updating="true"
          :tagsgroup="tagsgroupSelected"
          @uploaded="allGrupoTags()"
          @cancel="(ev) => tab = ev"
          v-if="tab === 'update'"
        ></grupostagsform>
      </q-tab-panel>
      <q-tab-panel name="create">
        <grupostagsform
          :updating="false"
          :tagsgroup="null"
          v-if="tab === 'create'"
          @created="allGrupoTags()"
          @cancel="(ev) => tab = ev"
        ></grupostagsform>
      </q-tab-panel>
    </q-tab-panels>
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
import grupostagsform from './grupostagsform'
export default {
  name: "grupostags",
  components: {
    grupostagsform
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
          name: "tags",
          align: "center",
          label: "Etiquetas",
          field: "tags"
        },
        {
          name: "actions",
          align: "center",
          label: "Acciones",
          field: "actions"
        }
      ],
      tab: "tagsgroup",
      tagsgroupSelected: '',
      dataGrup: [],
      tagsUpdate: "",
      grupostags: [],
      tags: [],
      name: "",
      tag: "",
      updating: false
    };
  },
  created() {
    this.allGrupoTags();
    this.allTags();
  },
  watch: {
    tag(newValue) {
      this.updatingSelectTag = true;
    }
  },
  methods: {
    allGrupoTags() {
      this.$apollo
        .query({
          query: GRUPOTAGS_QUERY,
          fetchPolicy: "network-only"
        })
        .then(response => {
          this.grupostags = Object.assign([], response.data.AllTagsgroup);
          this.tab = 'tagsgroup'
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
    deleteGrupotag(grupostagID) {
      this.$apollo
        .mutate({
          mutation: GRUPOSTAG_DELETE,
          variables: {
            grupostagId: grupostagID
          }
        })
        .then(response => {
          var vm = this;
          this.tags.some(function(grupostags, index) {
            if (grupostags.id === grupostagID) {
              vm.grupostags.splice(index, 1);
            }
          });
          this.allGrupoTags();
        })
        .catch(err => {
          console.log("error delete CATEGORY: ", err);
        });
    },
    updateTagsgroup(tagsgroup) {
      this.tab = 'update'
      this.tagsgroupSelected = tagsgroup
    },
    agregarTagsgroup() {
      this.tab = 'create'
    }
  }
};
</script>