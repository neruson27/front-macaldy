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
        <q-input class="col-4 q-px-sm" v-model="name" label="Nombre" clearable :rules="[val => !!val || 'Esto es requerido!']" hide-bottom-space/>
        <q-input class="col-4 q-px-sm" v-model="description" label="Descripción Corta" clearable />
        <q-input
          class="col-4 q-px-sm"
          @input="val => inputing(val)"
          v-model="price"
          label="Precio"
          prefix="$"
          :mask="payMask"
          unmasked-value
          reverse-fill-mask
          clearable
          :rules="[val => !!val || 'Esto es requerido!']"
          hide-bottom-space
        />
        <q-editor
          class="col-12 q-mt-md"
          v-model="description_long"
          placeholder="Descripcion Larga"
          min-height="5rem"
        />
        <q-input class="col-4 q-px-sm" v-model="model" label="Modelo" clearable :rules="[val => !!val || 'Esto es requerido!']" hide-bottom-space/>
        <q-input class="col-4 q-px-sm" v-model="ref" label="Refencia" clearable :rules="[val => !!val || 'Esto es requerido!']" hide-bottom-space/>
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
          :rules="[val => !!val || 'Esto es requerido!']"
          hide-bottom-space
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
          :options="!category.subcategory ? [{name:'Selecciona una categoria'}] : category.subcategory"
          label="Sub-categoria"
          class="col-4 q-px-sm"
          clearable
          :rules="[val => !!val || 'Esto es requerido!']"
          hide-bottom-space
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
              <q-item-section>
                <q-item-label
                  class="text-vinotinto"
                  v-html="scope.opt"
                  v-if="scope.opt === 'Añadir'"
                />
                <q-item 
                  v-html="scope.opt.name"
                  disable
                  dense
                  v-else-if="scope.opt.name === 'Selecciona una categoria'"
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
          :options="selectedTags"
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
                <q-item 
                  v-html="scope.opt.name"
                  disable
                  dense
                  v-else-if="scope.opt.name === 'Selecciona una categoria'"
                />
                <q-item-label v-html="scope.opt.name" v-else />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <div class="col-12 text-center q-mt-md">
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
        <q-file
          v-model="highlight"
          label="Selecciona la imagen destacada"
          accept=".jpg, .png, .svg"
          clearable
          class="col-6 q-px-sm"
          :rules="[val => !!val || 'Esto es requerido!']"
          hide-bottom-space
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
      </q-card-section>
      <q-card-section class="row justify-between q-px-lgz">
        <q-btn
          color="white"
          text-color="vinotinto"
          v-if="updating === false"
          class="q-mt-md"
          @click="addProduct()"
          :disable="upload || disabled"
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
  ],
  data() {
    return {
      config: config,
      id: "",
      name: "",
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
      category: "",
      ref: "",
      upload: false,
      previewImgs: '',
      imghightlight: '',
      payMask: ''
    };
  },
  mounted() {
    this.categories.push("Añadir");
    if (this.updating) {
      this.id = this.product._id;
      this.name = this.product.name;
      this.model = this.product.model;
      this.subcategory = this.product.subcategory;
      this.tag = this.product.tags;
      this.description = this.product.description;
      this.description_long = this.product.description_long;
      this.price = this.product.price;
      this.highlight = undefined;
      this.image = undefined;
      this.highlightPreview = this.product.highlight
      this.imagePreview = this.product.image
      this.category = this.product.category;
      this.ref = this.product.ref;
    }
  },
  computed: {
    selectedTags() {
      let tags = []
      if (this.category) {
        this.category.tagsgroup.forEach(tag => {
          tag.tags.forEach(t => {
            tags.push(t)
          })
        })
        return tags
      } else {
        tags.push({name: 'Selecciona una categoria'})
        return tags
      }
    },
    disabled() {
      console.log(this.highlight.length)
      if (
        !this.name ||
        !this.price ||
        !this.model ||
        !this.ref ||
        !this.category ||
        !this.subcategory ||
        this.highlight.length === 0
      ) {
        console.log('desactivado')
        return true
      } else {
        return false
      }
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
    price(newValue) {
      if (newValue) {
          this.payMask = ''
          for(let i = 0; i < newValue.length; i++) {
            this.payMask = '#' + this.payMask
          }
          this.payMask = this.payMask.toString().split('').reverse().join('').replace(/(?=\#*\.?)(\#{3})/g,'###.');
          this.payMask = this.payMask.split('').reverse().join('').replace(/^[\.]/,'');
        }
    },
    async highlight(newValue) {
      this.imghightlight = "";
      let image = await this.readFileAsync(newValue);
      this.imghightlight = image;
    },
    category(newValue) {
      if (newValue === "Añadir") {
        this.$router.push("/homeAdmin?tab=categorias");
      }
      if (newValue.tagsgroup.length == 0) {
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
        model: this.model,
        subcategory: this.subcategory,
        tags: this.tag,
        description: this.description,
        description_long: this.description_long,
        price: this.price,
        highlight: this.highlight,
        image: this.image,
        category: this.category,
        ref: this.ref,
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
            (this.description = ""),
            (this.description_long = ""),
            (this.model = ""),
            (this.price = ""),
            (this.highlight = []),
            (this.image = []),
            (this.category = ""),
            (this.subcategory = ""),
            (this.tag = ""),
            (this.ref = ""),
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
        model: this.model,
        subcategory: this.subcategory,
        tags: this.tag,
        description: this.description,
        price: this.price,
        category: this.category,
        ref: this.ref,
        highlight: this.highlight,
        image: this.image,
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
          (this.description = ""),
          (this.model = ""),
          (this.price = ""),
          (this.image = ""),
          (this.category = ""),
          (this.subcategory = ""),
          (this.tag = ""),
          (this.ref = ""),
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