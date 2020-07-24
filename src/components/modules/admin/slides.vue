<template>
  <div class="row justify-center">
    <q-tab-panels class="col-12" v-model="tab" animated style="background-color:#f7f8fb">
      <q-tab-panel name="slide">
        <div class="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <q-table
            :square="false"
            :data="slide"
            :columns="columns"
            :dense="$q.screen.lt.md"
            row-key="name"
            grid
          >
            <template v-slot:top>
              <p class="text-h6">Lista de Imagenes</p>
              <q-space />
              <q-btn
                label="Agregar Imagen"
                icon="mdi-plus"
                flat
                color="vinotinto"
                @click="agregarSlide()"
              ></q-btn>
            </template>
            <template v-slot:item="props">
              <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
                <q-card style="background: #2c2c2c">
                  <q-card-section class="flex flex-center">
                    <q-img :ratio="1" contain :src="config.api.url + props.row.image" >
                      <q-btn
                        @click="deleteSlide(props.row._id)"
                        flat
                        round
                        color="vinotinto"
                        icon="mdi-delete"
                        class="absolute-top-right"
                      >
                        <q-tooltip content-class="bg-vinotinto" :offset="[10, 10]">Eliminar</q-tooltip>
                      </q-btn>
                    </q-img>
                  </q-card-section>
                </q-card>
              </div>
            </template>
          </q-table>
        </div>
      </q-tab-panel>
      <q-tab-panel name="create">
        <slideform v-if="tab === 'create'" @created="allSlides()" @cancel="(ev) => tab = ev"></slideform>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script>
import { ALL_SLIDE_QUERY, SLIDE_ADD, SLIDE_DELETE } from "@/graphql/slide";
import slideform from "./slideform";
import config from "@/config";
export default {
  name: "slides",
  components: {
    slideform
  },
  data() {
    return {
      config: config,
      model: "",
      text: "",
      name: "",
      slide: [],
      tab: "slide",
      columns: [
        {
          name: "actions",
          align: "center",
          label: "Acciones",
          field: "actions"
        },
        {
          name: "image",
          align: "left",
          label: "",
          field: "image"
        }
      ]
    };
  },
  created() {
    this.allSlides();
  },
  methods: {
    allSlides() {
      this.$apollo
        .query({
          query: ALL_SLIDE_QUERY,
          fetchPolicy: "network-only"
        })
        .then(response => {
          this.slide = Object.assign([], response.data.AllSlide);
          this.tab = "slide";
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    deleteSlide(id) {
      this.$apollo
        .mutate({
          mutation: SLIDE_DELETE,
          variables: {
            id: id
          }
        })
        .then(response => {
          var vm = this;
          this.slide.some(function(slide, index) {
            if (slide.id === id) {
              vm.slide.splice(index, 1);
            }
          });
          this.allSlides();
        })
        .catch(err => {
          console.log("error delete BRANCH: ", err);
        });
    },
    agregarSlide() {
      this.tab = "create";
    }
  }
};
</script>