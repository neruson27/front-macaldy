<template>
  <div class="col-12 q-ma-sm">
    <q-card flat bordered class="my-card" style="width:100%;">
      <q-card-section class="text-center">
        <div class="text-h6">Agregar Imagen</div>
      </q-card-section>

      <q-card-section class="q-pt-none text-center">
        <q-img :src="preview" v-if="preview" width="200px" class="q-my-md"></q-img>
        <q-file
          v-model="image"
          label="Selecciona la imagen para el slider"
          accept=".jpg, .png, .svg"
          clearable
        />
        <q-input
          v-model="url"
          label="Url del producto (Opcional)"
          clearable
          hint="Ejemplo: https://www.google.com"
        />
      </q-card-section>
      <q-card-section class="row justify-between">
        <q-btn
          color="white"
          text-color="vinotinto"
          class="q-mt-md"
          @click="addSlide()"
          :disable="upload || disabled"
        >
          {{upload ? '' : 'Agregar'}}
          <q-spinner-gears size="50px" color="primary" v-if="upload"/>
        </q-btn>
        <q-btn color="negative" class="q-mt-md" @click="cancelar()" label="cancelar" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import {
  ALL_SLIDE_QUERY,
  SLIDE_ADD,
  SLIDE_DELETE
} from "@/graphql/slide";
import config from "@/config";
export default {
  name: "slidesform",
  components: {},
  props: ["slide"],
  data() {
    return {      
      config: config,
      id: "",
      name: "",
      preview: "",
      image: [],
      url: '',
      upload: false,
      disabled: true
    };
  },
  watch: {
    async image(newValue) {
      if(newValue.name) {
        this.disabled = false
        this.preview = await this.readFileAsync(newValue)
      } else {
        this.preview = null
      }
    },
  },
  methods: {
    addSlide() {
      const data = {
        image: this.image,
        url: this.url
      };
      this.upload = true
      return this.$apollo
        .mutate({
          mutation: SLIDE_ADD,
          variables: {
            data
          }
        })
        .then(response => {
          this.image = []
          this.upload = false
          this.$emit("created");
        })
        .catch(err => {
          this.upload = false
          this.$q.notify({
            message: err.message.split("GraphQL error:"),
            color: "negative"
          });
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
    cancelar() {
      this.$emit("cancel", "slide");
    }
  }
};
</script>