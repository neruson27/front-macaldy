<template>
  <div class="row justify-center">
    <div class="col-xl-9 col-lg-9 col-md-10 col-sm-12 col-xs-12 q-mt-xl q-mb-xl">
      <div class="row justify-center">
        <div class="col-xl-1 col-lg-1 col-md-1 xs-hide sm-hide q-mr-lg">
          <q-scroll-area style="height: 300px;">
            <div
              v-for="image in product.image"
              :key="image"
              name="style"
              class="column no-wrap flex-center"
            >
              <q-img
                :src="config.api.url + image"
                spinner-color="white"
                style="height: 90px; width: 80px"
                :style="imagenSelect === image ? 'border: 3px solid #fc0' : ''"
                @click="imagenSelect = image"
              />
            </div>
          </q-scroll-area>
        </div>
        <div class="col-xl-9 col-lg-9 col-md-9 col-sm-6 col-xs-6">
          <div class="row justify-center">
            <div
              class="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-xs-12 q-ma-md"
            >
              <q-img
                :src="config.api.url + imagenSelect"
                spinner-color="black"
                :ratio="4/3"
                contain
              />
              <div horizontal class="lg-hide xl-hide md-hide q-mt-xs scroll" style="height: 100px; width: 200px;">
                    <div class="row no-wrap">
                      <q-img
                      class="q-mr-xs"
                      v-for="image in product.image"
                      :key="image"
                      :src="config.api.url + image"
                      spinner-color="black"
                      style="height: 90px; width: 80px"
                      :style="imagenSelect === image ? 'border: 3px solid #fc0' : ''"
                      @click="imagenSelect = image"
                    />
                    </div>
              </div>
            </div>
            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 q-ma-md">
              <span class="text-h4 text-bold" :style="$q.screen.lt.md ? 'word-break: break-all;' : ''">{{product.name}}</span>
              <br />
              <p>
                <span class="text-bold">Ref. {{product.ref}}</span>
                <br />
                <span style="word-break: break-all;">{{product.description}}</span>
                <br />
                <span>
                  {{product.category.name}} > {{product.subcategory.name}} |
                  <span
                    v-for="(tag, index) in product.tags"
                    :key="index"
                    class="q-mr-sm"
                  >{{tag.name}}</span>
                </span>
                <br />
                <span class="text-bold">
                  Cantidad:
                  <span class="text-h6 text-bold">{{counter}}</span>
                  <q-btn
                    @click="counter--;"
                    :disable="counter <= 1"
                    flat
                    round
                    icon="mdi-arrow-down-circle"
                  />
                  <q-btn @click="counter++;" flat round icon="mdi-arrow-up-circle" />
                  <span>
                    <q-btn
                      round
                      @click="playSound(config.api.url + product.audio)"
                      flat
                      icon="mdi-play-circle"
                      :disable="playing"
                    />
                    <q-btn
                      round
                      @click="stopSound()"
                      flat
                      icon="mdi-stop-circle"
                      v-if="audio"
                    />
                  </span>
                  <span>Reproducir</span>
                </span>
                <br />
                <span class="text-h5 text-bold">$ {{format(product.price)}} COP</span>
                <br />
              </p>
              <div class="row">
                <div class="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-xs-12 q-mr-xs">
                  <q-btn
                    class="full-width text-white"
                    color="negative"
                    label="Comprar"
                    no-caps
                    icon-right="mdi-cart"
                    @click="add(product)"
                  />
                </div>
                <div class="col-xl-5 col-lg-5 col-md-6 col-sm-12 col-xs-12" :class="$q.screen.lt.md ? 'q-mt-sm' : ''">
                  <q-btn :class="$q.screen.lt.md ? 'full-width' : ''" no-caps outline color="negative" label="Pago en linea" icon-right="mdi-credit-card" @click="checkout(product)"/>
                </div>
              </div>
              <div class="row">
                <div class="col-xl-5 col-lg-5 col-md-6 col-sm-12 col-xs-12 q-mt-sm q-mr-sm">
                  <q-btn
                    :href="ws"
                    :class="$q.screen.lt.md ? 'full-width' : ''"
                    type="a"
                    target="_blank"
                    color="positive"
                    label="Mas información"
                    no-caps
                    icon-right="mdi-whatsapp"
                  />
                </div>
              </div>
            </div>
            <div class="col-10" style="border-top: 2px solid #ccc">
              <div class="row q-pt-md">
                <br />
                <span v-html="product.description_long"></span>
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/config";
import { PRODUCTOS_QUERY } from "@/graphql/products";
export default {
  name: "detalle",
  data() {
    return {
      counter: 1,
      cart: (this.cart = this.$store.getters.cart),
      // routerParams: "",
      // detalleData: [],
      config: config,
      data: [],
      ws: "",
      product: "",
      imagenSelect: "",
      audio: '',
      playing: false
    };
  },
  async created() {
    // if (this.$route.params) {
    //   this.routerParams = this.$route.params;
    // }
    await this.allProducts();
    await this.getData(this.$route.query.ref);
    console.log(this.product);
    this.imagenSelect = this.product.image[0];
    let url = "http://verticeaudio.com/"
    this.ws = `https://wa.me/3138348673?text=Hola,%20quisiera%20saber%20más%20al%20respecto%20de%20su%20producto:%20${url}%23/detalles?ref=${this.product.ref}`;
  },
  watch: {
    imagenSelect(newValue) {
      console.log(newValue);
    },
    slide(newValue) {
      console.log(newValue);
    },
  },
  methods: {
    allProducts() {
      return this.$apollo
        .query({
          query: PRODUCTOS_QUERY,
          fetchPolicy: "network-only"
        })
        .then(response => {
          console.log(response.data.AllProducts);
          this.data = Object.assign([], response.data.AllProducts);
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
    format(input) {
      let num = input
      if (!isNaN(num)) {
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/,'');
        return num;
      }
    },
    getData(ref) {
      let productos = this.data;
      this.product = productos.filter(item => {
        return item.ref == ref;
      });
      if (this.product.length > 0) this.product = this.product[0];
      return this.product;
    },
    playSound(sound) {
      if (sound) {
        this.audio = new Audio(sound);
        this.audio.play();
      }
    },
    stopSound() {
      this.audio.pause()
      this.audio = null
    },
    add(producto) {
      let item = {
        name: producto.name,
        price: producto.price,
        highlight: producto.highlight,
        image: producto.image,
        branch: producto.branch,
        model: producto.model,
        category: producto.category,
        audio: producto.audio,
        important: producto.important,
        description: producto.description,
        description: producto.description_long,
        subcategory: producto.subcategory,
        tag: producto.tag,
        ref: producto.ref,
        ctd: producto.ctd,
        quantity: this.counter,
        createdAt: producto.createdAt
      };
      this.$store.commit("addItem", item);
      this.$q.notify({
        message: "Añadido al carrito de compras",
        color: "positive"
      });
    },
    del(product, quantity = 1) {
      if (this.counter < 0) {
        this.counter = 0;
      } else {
        this.counter--;
      }
      this.$store.commit("delItem", {
        itemKeys: { name: product.name },
        quantity: quantity
      });
      this.$q.notify({
        message: "Eliminado del carrito de compras",
        color: "negative"
      });
    },
    checkout(producto) {
      this.$store.commit("empty")
      let item = {
        name: producto.name,
        price: producto.price,
        image: producto.image,
        branch: producto.branch,
        model: producto.model,
        category: producto.category,
        audio: producto.audio,
        important: producto.important,
        description: producto.description,
        description: producto.description_long,
        subcategory: producto.subcategory,
        tag: producto.tag,
        ref: producto.ref,
        ctd: producto.ctd,
        quantity: this.counter,
        createdAt: producto.createdAt
      };
      this.$store.commit("addItem", item);
      this.$router.push('checkout')
    }
  }
};
</script>
