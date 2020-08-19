<template>
  <div class="row justify-center">
    <div class="col-xl-10 col-lg-10 col-md-10 col-sm-12 col-xs-12 q-mb-xl" :class="$q.screen.lt.md ? 'q-mt-sm' : 'q-mt-xl'">
      <div class="row justify-center">
        <div class="col-xl-1 col-lg-1 col-md-1 xs-hide sm-hide q-mr-lg">
          <q-scroll-area style="height: 26vw;">
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
        <div class="col-xl-9 col-lg-9 col-md-9 col-sm-9 col-xs-9">
          <div class="row justify-center">
            <div
              class="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-xs-12 q-ma-md"
            >
              <q-img
                :src="imagenSelect ? config.api.url + imagenSelect : config.api.url + product.highlight"
                spinner-color="black"
                :ratio="1"
                contain
              />
              <div horizontal class="lg-hide xl-hide md-hide q-mt-sm scroll">
                    <div class="row no-wrap">
                      <q-img
                      class="q-mr-xs"
                      v-for="image in product.image"
                      :key="image"
                      :src="config.api.url + image"
                      spinner-color="black"
                      style="height: 80px; width: 80px"
                      :style="imagenSelect === image ? 'border: 3px solid #fc0' : ''"
                      @click="imagenSelect = image"
                    />
                    </div>
              </div>
            </div>
            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12" :class="$q.screen.lt.md ? 'q-ma-xs' : 'q-ma-md'">
              <span class="text-h4 text-bold" :style="$q.screen.lt.md ? 'word-break: break-all;' : ''">{{product.name}}</span>
              <br />
              <p>
                <span class="text-bold">Ref. {{product.ref}}</span>
                <br />
                <span style="word-break: break-all;">{{product.description ? product.description : 'No hay descripcion del producto'}}</span>
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
                <div class="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-xs-12" :class="$q.screen.lt.md ? 'q-mt-sm' : ''">
                  <q-btn class="full-width" no-caps outline color="negative" label="Pago en linea" icon-right="mdi-credit-card" dense @click="checkout(product)"/>
                </div>
              </div>
              <div class="row">
                <div class="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-xs-12 q-mt-sm q-mr-sm">
                  <q-btn
                    :href="ws"
                    class="full-width"
                    type="a"
                    color="positive"
                    label="Mas información"
                    no-caps
                    dense
                    icon-right="mdi-whatsapp"
                    padding="xs"
                  />
                </div>
                <div class="col-xl-5 col-lg-5 col-md-5   col-sm-12 col-xs-12 q-mt-sm q-mr-sm">
                </div>
              </div>
            </div>
            <div class="col-xl-10 col-lg-10 col-md-12 col-sm-12 col-xs-12" style="border-top: 2px solid #ccc">
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
    let url = this.config.api.url
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
      productos = this.data.filter(item => {
        return item.ref == ref;
      });
      if (productos.length > 0) this.product = productos[0];
      if (this.product.image[0] !== this.product.highlight) this.product.image.splice(0, 0, this.product.highlight)
      return this.product;
    },
    add(producto) {
      let item = {
        name: producto.name,
        price: producto.price,
        highlight: producto.highlight,
        image: producto.image,
        model: producto.model,
        category: producto.category,
        important: producto.important,
        description: producto.description,
        description: producto.description_long,
        subcategory: producto.subcategory,
        tag: producto.tag,
        ref: producto.ref,
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
        model: producto.model,
        category: producto.category,
        important: producto.important,
        description: producto.description,
        description: producto.description_long,
        subcategory: producto.subcategory,
        tag: producto.tag,
        ref: producto.ref,
        quantity: this.counter,
        createdAt: producto.createdAt
      };
      this.$store.commit("addItem", item);
      this.$router.push('checkout')
    }
  }
};
</script>
