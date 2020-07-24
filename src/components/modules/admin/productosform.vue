<template>
  <div class="col-12 q-ma-sm">
    <q-card flat bordered class="my-card" style="width:100%;">
      <q-card-section class="text-center">
        <div class="flex flex-start">
          <q-btn icon="mdi-arrow-left" flat rounded @click="cancelar()"></q-btn>
        </div>
        <div class="text-h6" v-if="updating === false">Agregar producto</div>
        <div class="text-h6" v-if="updating === true">Modificar producto</div>
      </q-card-section>
      <q-card-section class="q-pt-none row justify-center">
        <q-input class="col-4 q-px-sm" v-model="name" label="Nombre" clearable />
        <q-input class="col-4 q-px-sm" v-model="description" label="Descripción Corta" clearable />
        <q-input
          class="col-4 q-px-sm"
          @input="val => inputing(val)"
          v-model="price"
          label="Precio"
          prefix="$"
          clearable
        />
        <q-editor
          class="col-12 q-mt-md"
          v-model="description_long"
          placeholder="Descripcion Larga"
          min-height="5rem"
        />
        <q-input class="col-4 q-px-sm" v-model="model" label="Modelo" clearable />
        <q-select
          class="col-4 q-px-sm"
          v-model="branch"
          option-label="name"
          map-option
          :options="branchs"
          label="Marca"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
              <q-item-section>
                <q-item-label
                  class="text-vinotinto"
                  v-html="scope.opt"
                  v-if="scope.opt === 'Añadir'"
                />
                <q-item-label v-html="scope.opt.name" v-else />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-input class="col-4 q-px-sm" v-model="ref" label="Refencia" clearable />
        <q-select
          v-model="category"
          option-label="name"
          :options="categories"
          label="Categoria"
          class="col-4 q-px-sm"
          @input="() => {
            subcategory = ''
            tag = []
          }"
          clearable
          @clear="clearCategory()"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
              <q-item-section>
                <q-item-label
                  class="text-vinotinto"
                  v-html="scope.opt"
                  v-if="scope.opt === 'Añadir'"
                />
                <q-item-label v-html="scope.opt.name" v-else />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select
          v-model="subcategory"
          option-label="name"
          :options="category.subcategory"
          label="Sub-categoria"
          class="col-4 q-px-sm"
          clearable
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
              <q-item-section>
                <q-item-label
                  class="text-vinotinto"
                  v-html="scope.opt"
                  v-if="scope.opt === 'Añadir'"
                />
                <q-item-label v-html="scope.opt.name" v-else />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select
          class="col-4 q-px-sm"
          v-model="tag"
          option-label="name"
          multiple
          use-chips
          :options="category.tagsgroup[0].tags"
          label="Tag"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
              <q-item-section>
                <q-item-label
                  class="text-vinotinto"
                  v-html="scope.opt"
                  v-if="scope.opt === 'Añadir'"
                />
                <q-item-label v-html="scope.opt.name" v-else />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <div class="col-6 text-center q-mt-md">
          <q-slide-transition v-if="!updating || imghightlight">
            <img
              v-show="imghightlight"
              class="rounded-borders q-px-sm"
              :src="imghightlight"
              style="max-width: 300px; height: 180px;"
              contain
            />
          </q-slide-transition>
          <q-slide-transition v-else>
            <img
              v-show="highlightPreview"
              class="rounded-borders q-px-sm"
              :src="config.api.url + highlightPreview"
              style="max-width: 300px; height: 180px;"
              contain
            />
          </q-slide-transition>
        </div>
        <div class="col-6 text-center self-center q-mt-md" v-if="!updating || audioSelect">
          <audio :src="audioSelect" controls="controls" v-if="audioSelect">  
            Tu navegador no soporta el elemento <code>audio</code>.
          </audio>
        </div>
        <div class="col-6 text-center self-center q-mt-md" v-else>
          <audio :src="config.api.url + audioPrevie" controls="controls">  
            Tu navegador no soporta el elemento <code>audio</code>.
          </audio>
        </div>
        <q-file
          v-model="highlight"
          label="Selecciona la imagen destacada"
          accept=".jpg, .png, .svg"
          clearable
          class="col-6 q-px-sm"
        />
        <q-file
          v-model="audio"
          label="Selecciona el audio"
          accept=".mp3, .wav"
          clearable
          class="col-6 q-px-sm"
        />
        <q-scroll-area horizontal style="height: 200px;" class="col-12 q-mt-sm">
          <div class="row no-wrap full-width" v-if="!updating || previewImgs.length > 0">
            <q-slide-transition v-for="(img, index) in previewImgs" :key="index">
              <img
                v-show="img"
                class="rounded-borders q-px-sm"
                :src="img"
                style="max-width: 300px; height: 180px;"
                contain
              />
            </q-slide-transition>
          </div>
          <div class="row nowrap full-width" v-else>
            <q-slide-transition v-for="img in imagePreview" :key="img._id">
              <img
                v-show="img"
                class="rounded-borders q-px-sm"
                :src="config.api.url + img"
                style="max-width: 300px; height: 180px;"
                contain
              />
            </q-slide-transition>
          </div>
        </q-scroll-area>
        <p v-if="previewImgs.length === 0 && !updating">Selecciona una imagen (Maximo 5)</p>
        <q-file
          v-model="image"
          label="Selecciona las imagenes"
          multiple
          use-chips
          max-files="5"
          accept=".jpg, .png, .svg"
          class="col-12 q-px-sm"
        />
        <q-input class="col-4 q-px-sm" v-model="ctd" label="Cantidad" clearable />
        <div class="col-8 q-px-sm text-right q-mt-lg">
          <div class="rounded-borders">
            <span>Agregar como importante:</span>
            <q-toggle v-model="important" color="green" />
          </div>
        </div>
      </q-card-section>
      <q-card-section class="row justify-between q-px-lgz">
        <q-btn
          color="white"
          text-color="vinotinto"
          v-if="updating === false"
          class="q-mt-md"
          @click="addProduct()"
          :disable="upload"
        >
          {{upload ? '' : 'Agregar'}}
          <q-spinner-gears size="50px" color="primary" v-if="upload" />
        </q-btn>
        <q-btn
          color="white"
          text-color="vinotinto"
          v-if="updating === true"
          class="q-mt-md"
          @click="updatingProducto()"
          :disable="upload"
        >
          {{upload ? '' : 'Modificar'}}
          <q-spinner-gears size="50px" color="primary" v-if="upload" />
        </q-btn>
        <q-btn color="negative" class="q-mt-md" @click="cancelar()" label="cancelar" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import {
  PRODUCTOS_QUERY,
  CATEGORY_QUERY,
  SUBCATEGORY_QUERY,
  TAG_QUERY,
  BRANCH_QUERY,
  ADDPRODUCT_MUTATION,
  PRODUCT_UPDATE,
  DELETE_PRODUCT_MUTATION
} from "@/graphql/products";
import config from "@/config";
export default {
  name: "productform",
  components: {},
  props: [
    "updating",
    "product",
    "categories",
    "subcategories",
    "tags",
    "branchs"
  ],
  data() {
    return {
      config: config,
      id: "",
      name: "",
      branch: "",
      model: "",
      subcategory: "",
      tag: [],
      description: "",
      description_long: "",
      price: "",
      goodValue: "",
      highlight: [],
      highlightPreview: '',
      image: [],
      imagePreview: [],
      audio: [],
      audioPrevie: '',
      category: {
        name:'Selecciona una categoria',
        subcategory: [],
        tagsgroup: [{
          tags: []
        }]
      },
      ref: "",
      ctd: "",
      important: false,
      upload: false,
      previewImgs: '',
      imghightlight: '',
      audioSelect: ''
    };
  },
  mounted() {
    this.categories.push("Añadir");
    this.category.subcategory.push("Añadir");
    this.category.tagsgroup[0].tags.push("Añadir");
    this.branchs.push("Añadir");
    if (this.updating) {
      this.id = this.product._id;
      this.name = this.product.name;
      this.branch = this.product.branch;
      this.model = this.product.model;
      this.subcategory = this.product.subcategory;
      this.tag = this.product.tags;
      this.description = this.product.description;
      this.description_long = this.product.description_long;
      this.price = this.product.price;
      this.highlight = undefined;
      this.image = undefined;
      this.audio = undefined;
      this.highlightPreview = this.product.highlight
      this.imagePreview = this.product.image
      this.audioPrevie = this.product.audio
      this.category = this.product.category;
      this.ref = this.product.ref;
      this.ctd = this.product.ctd;
      this.important = this.product.important;
    }
  },
  watch: {
    async image(newValue) {
      this.previewImgs = [];
      for (let img of newValue) {
        let image = await this.readFileAsync(img);
        this.previewImgs.push(image);
      }
    },
    async highlight(newValue) {
      this.imghightlight = "";
      let image = await this.readFileAsync(newValue);
      this.imghightlight = image;
    },
    async audio(newValue) {
      this.audioSelect = "";
      let audio = await this.readFileAsync(newValue);
      this.audioSelect = audio;
    },
    branch(newValue) {
      if (newValue === "Añadir") {
        this.$router.push("/homeAdmin?tab=marcas");
      }
    },
    category(newValue) {
      if (newValue === "Añadir") {
        this.$router.push("/homeAdmin?tab=categorias");
      }
      if (newValue.tagsgroup[0] === undefined) {
        newValue.tagsgroup = [{tags: [{_id:0,name: 'Añade un grupo de etiquetas a la categoria'}]}]
      }
      if (newValue.subcategory.length == 0) {
        newValue.subcategory = [{name: 'Añade una sub-categoria a la categoria'}]
      }
    },
    subcategory(newValue) {
      if (newValue === "Añadir") {
        this.$router.push("/homeAdmin?tab=subcategorias");
      }
    },
    tag(newValue) {
      if (newValue === "Añadir") {
        this.$router.push("/homeAdmin?tab=etiquetas");
      }
    }
  },
  methods: {
    readFileAsync(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = () => {
          resolve(reader.result);
        };

        reader.onerror = reject;

        reader.readAsDataURL(file);
      });
    },
    clearCategory() {
      this.category = {
        name:'Selecciona una categoria',
        subcategory: ['Añadir'],
        tagsgroup: [{
          tags: ['Añadir']
        }]
      }
      this.subcategory = '',
      this.tag = []
    },
    addProduct() {
      this.upload = true;
      const data = {
        name: this.name,
        branch: this.branch,
        model: this.model,
        subcategory: this.subcategory,
        tags: this.tag,
        description: this.description,
        description_long: this.description_long,
        price: this.price,
        highlight: this.highlight,
        image: this.image,
        audio: this.audio.length === 0 ? '' : this.audio,
        category: this.category,
        ref: this.ref,
        ctd: parseInt(this.ctd),
        important: this.important
      };
      this.$apollo
        .mutate({
          mutation: ADDPRODUCT_MUTATION,
          variables: {
            data
          }
        })
        .then(response => {
          (this.name = ""),
            (this.branch = ""),
            (this.description = ""),
            (this.description_long = ""),
            (this.model = ""),
            (this.price = ""),
            (this.highlight = []),
            (this.image = []),
            (this.audio = []),
            (this.category = ""),
            (this.subcategory = ""),
            (this.tag = ""),
            (this.ref = ""),
            (this.ctd = ""),
            (this.important = "");
          this.$emit("created");
          this.upload = false;
        })
        .catch(err => {
          this.upload = false;
          console.log("hubo un error: ", err);
          this.$q.notify({
            message: err.message.split("GraphQL error:"),
            color: "negative"
          });
        });
    },
    updatingProducto() {
      const data = {
        name: this.name,
        branch: this.branch,
        model: this.model,
        subcategory: this.subcategory,
        tags: this.tag,
        description: this.description,
        price: this.price,
        category: this.category,
        ref: this.ref,
        highlight: this.highlight,
        image: this.image,
        audio: this.audio,
        ctd: parseInt(this.ctd),
        important: this.important
      };
      this.upload = true;
      this.$apollo
        .mutate({
          mutation: PRODUCT_UPDATE,
          variables: {
            productId: this.id,
            data
          }
        })
        .then(response => {
          (this.name = ""),
            (this.branch = ""),
            (this.description = ""),
            (this.model = ""),
            (this.price = ""),
            (this.image = ""),
            (this.audio = ""),
            (this.category = ""),
            (this.subcategory = ""),
            (this.tag = ""),
            (this.ref = ""),
            (this.ctd = ""),
            (this.important = "");
          this.upload = true;
          this.$emit("uploaded");
        })
        .catch(err => {
          console.log("error CATEGORY: ", err);
          this.$q.notify({
            message: err.message.split("GraphQL error:"),
            color: "negative"
          });
        });
    },
    cancelar() {
      this.$emit("cancel", "products");
    },
    inputing(value) {
      if (/^[0-9]+(\.[0-9]{1,2})?$/.test(value)) {
        this.price = value;
        this.goodValue = value;
      } else {
        this.price = this.goodValue;
      }
    }
  }
};
</script>

<style>
</style>