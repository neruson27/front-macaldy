<template>
  <div class="row justify-center">
    <q-tab-panels class="col-12" v-model="tab" animated style="background-color:#f7f8fb">
      <q-tab-panel name="branch">
        <div class="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <q-table :square="false" :data="branchs" :columns="columns" :dense="$q.screen.lt.md" row-key="name">
            <template v-slot:top>
              <p class="text-h6">Lista de Marcas</p>
              <q-space />
              <q-btn
                label="Agregar Marcas"
                icon="mdi-plus"
                flat
                color="vinotinto"
                @click="agregarBranch()"
              ></q-btn>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <td class="text-center" key="image">
                  <q-avatar rounded>
                    <img :src="config.api.url + props.row.image" />
                  </q-avatar>
                </td>
                <td class="text-center" key="name">{{props.row.name}}</td>
                <td class="text-center" key="actions">
                  <q-btn
                    @click="updateBranch(props.row)"
                    flat
                    round
                    color="vinotinto"
                    icon="mdi-square-edit-outline"
                  >
                    <q-tooltip content-class="bg-vinotinto" :offset="[10, 10]">Editar</q-tooltip>
                  </q-btn>
                  <q-btn
                    @click="deleteBranch(props.row._id)"
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
        <marcasform
          :updating="true"
          :branch="branchSelected"
          @uploaded="allBranchs()"
          @cancel="(ev) => tab = ev"
          v-if="tab === 'update'"
        ></marcasform>
      </q-tab-panel>
      <q-tab-panel name="create">
        <marcasform
          :updating="false"
          :category="null"
          v-if="tab === 'create'"
          @created="allBranchs()"
          @cancel="(ev) => tab = ev"
        ></marcasform>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script>
import {
  BRANCH_QUERY,
  ADDBRANCH_MUTATION,
  BRANCH_DELETE
} from "@/graphql/products";
import marcasform from "./marcasform"
import config from "@/config";
export default {
  name: "marcas",
  components: {
    marcasform
  },
  data() {
    return {
      config: config,
      model: "",
      text: "",
      name: "",
      branchs: [],
      branchSelected: "",
      tab: 'branch',
      columns: [
        {
          name: "image",
          align: "left",
          label: "",
          field: "image"
        },
        {
          name: "name",
          required: true,
          label: "Nombre",
          align: "center",
          field: row => row.name,
          sortable: true
        },
        {
          name: "actions",
          align: "center",
          label: "Acciones",
          field: "actions"
        }
      ],
    };
  },
  created() {
    this.allBranchs();
  },
  methods: {
    allBranchs() {
      this.$apollo
        .query({
          query: BRANCH_QUERY,
          fetchPolicy: "network-only"
        })
        .then(response => {
          this.branchs = Object.assign([], response.data.AllBranchs);
          this.tab = 'branch'
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    deleteBranch(branchID) {
      this.$apollo
        .mutate({
          mutation: BRANCH_DELETE,
          variables: {
            branchId: branchID
          }
        })
        .then(response => {
          var vm = this;
          this.branchs.some(function(branch, index) {
            if (branch.id === branchID) {
              vm.branchs.splice(index, 1);
            }
          });
          this.allBranchs();
        })
        .catch(err => {
          console.log("error delete BRANCH: ", err);
        });
    },
    updateBranch(data) {
      this.tab = "update";
      this.branchSelected = data;
    },
    agregarBranch() {
      this.tab = "create";
    }
  }
};
</script>