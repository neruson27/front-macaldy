<template>
  <div class="col-12 q-ma-sm">
    <q-card flat bordered class="my-card" style="width:100%;">
      <q-card-section class="text-center">
        <div class="text-h6" v-if="updating === false">Agregar Marca</div>
        <div class="text-h6" v-if="updating === true">Modificar Marca</div>
      </q-card-section>

      <q-card-section class="q-pt-none text-center">
        <q-input v-model="name" label="Nombre" />
        <q-img :src="preview" v-if="preview" width="200px" class="q-my-md"></q-img>
        <q-file
          v-model="image"
          label="Selecciona la imagen de la marca"
          accept=".jpg, .png, .svg"
          clearable
        />
      </q-card-section>
      <q-card-section class="row justify-between">
        <q-btn
          color="white"
          text-color="vinotinto"
          v-if="updating === false"
          class="q-mt-md"
          @click="addBranch()"
        :disable="upload"
        >
          {{upload ? '' : 'Agregar'}}
          <q-spinner-gears size="50px" color="primary" v-if="upload"/>
        </q-btn>
        <q-btn
          color="white"
          text-color="vinotinto"
          v-if="updating === true"
          class="q-mt-md"
          @click="updatingBranch()"
          :disable="upload"
        >
          {{upload ? '' : 'Modificar'}}
          <q-spinner-gears size="50px" color="primary" v-if="upload"/>
        </q-btn>
        <q-btn color="negative" class="q-mt-md" @click="cancelar()" label="cancelar" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import {
  BRANCH_QUERY,
  ADDBRANCH_MUTATION,
  UPDATE_BRANCH,
  BRANCH_DELETE
} from "@/graphql/products";
import config from "@/config";
export default {
  name: "marcasform",
  components: {},
  props: ["updating", "branch"],
  data() {
    return {      
      config: config,
      id: "",
      name: "",
      preview: "",
      image: [],
      upload: false
    };
  },
  mounted() {
    if (this.updating) {
      this.id = this.branch._id;
      this.name = this.branch.name;
      this.preview = this.config.api.url + this.branch.image
    }
  },
  watch: {
    async image(newValue) {
      if(newValue.name) {
        this.preview = await this.readFileAsync(newValue)
      } else {
        this.preview = null
      }
    },
  },
  methods: {
    addBranch() {
      const data = {
        name: this.name,
        image: this.image
      };
      this.upload = true
      return this.$apollo
        .mutate({
          mutation: ADDBRANCH_MUTATION,
          variables: {
            data
          }
        })
        .then(response => {
          this.name = "";
          this.image = []
          this.upload = false
          this.$emit("created");
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    readFileAsync(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = () => {
          resolve(reader.result);
        };

        reader.onerror = reject;

        reader.readAsDataURL(file);
      })
    },
    updatingBranch() {
      const data = {
        name: this.name,
        image: this.image.length === 0 ? undefined : this.image
      };
      this.upload = true
      return this.$apollo
        .mutate({
          mutation: UPDATE_BRANCH,
          variables: {
            id: this.id,
            data
          }
        })
        .then(response => {
          this.name = "";
          this.image = []
          this.upload = false
          this.$emit("uploaded");
        })
        .catch(err => {
          console.log("error Grupos tag: ", err);
        });
    },
    cancelar() {
      this.$emit("cancel", "branch");
    }
  }
};
</script>