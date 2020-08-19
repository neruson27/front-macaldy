<template>
  <div>
    <div v-if="cart.length > 0">
      <div v-for="(product, index) in cart" :key="index" style="max-height: 50vh" class="scroll">
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-avatar rounded class="q-mb-xs">
                <img :src="product.highlight ? config.api.url + product.highlight : config.api.url + product.image[0]" />
              </q-avatar>
              <q-item-label>$ {{format(product.price)}}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label class="ellipsis-2-lines">{{product.name}}</q-item-label>
              <q-item-label>{{product.branch.name}}</q-item-label>
              <q-item-label caption lines="2">{{product.description}}</q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-item-label
                caption
              >
                Unidades: <q-btn
                outline
                class="text-black no-pointer-events"
                color="white"
                size="xs"
                :label="product.quantity"
                ></q-btn>
                <br v-if="$q.screen.lt.md">
                Total: <q-btn
                outline
                class="text-black no-pointer-events"
                color="white"
                size="xs"
                :label="'$ ' + format(product.price * product.quantity)"
                ></q-btn>
              </q-item-label>
              <div class="row">
                <q-btn flat round @click="add(product)" color="positive" icon="mdi-plus" />
                <q-btn size="12px" flat dense round icon="mdi-minus" color="negative" @click="del(product)"/>
                <q-btn flat round @click="del(product, product.quantity)" color="grey" icon="mdi-delete" />
              </div>
            </q-item-section>
          </q-item>
          <q-separator spaced inset />
        </q-list>
      </div>
    </div>
    <div v-else>
      <div class="row justify-center text-center">
        <div class="col-12">
          <span class="text-caption text-grey">No hay productos en el carrito de compra</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/config";
export default {
  name: "cart",
  data() {
    return {
      itemCount: (this.itemCount = this.$store.getters.itemCount),
      cart: (this.cart = this.$store.getters.cart),
      cartKeys: ["name", "store"],
      store: "Gunnison",
      config: config
    };
  },
  created() {
    this.$store.commit("cartKeys", this.cartKeys);
  },
  computed: {
    numberOfitemsInCart() {
      let cart = this.$store.getters.cart;
      return cart.reduce((accum, item) => accum + item.quantity, 0);
    },
    itemsInCart() {
      let cart = this.$store.getters.cart;
      return cart;
    },
    total() {
      return this.cart.reduce((total, p) => {
        return total + p.price * p.quantity;
      }, 0);
    }
  },
  methods: {
    format(input) {
      let num = input
      if (!isNaN(num)) {
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/,'');
        return num;
      }
    },
    add(producto) {
      let item = {
        name: producto.name,
        price: producto.price,
        image: producto.image,
        branch: producto.branch,
        model: producto.model,
        category: producto.category,
        important: producto.important,
        description: producto.description,
        subcategory: producto.subcategory,
        tag: producto.tag,
        ref: producto.ref,
        ctd: producto.ctd,
        createdAt: producto.createdAt
      };
      this.$store.commit("addItem", item);
      this.$q.notify({
        message: "Añadido al carrito de compras",
        color: "positive"
      });
    },
    del(product, quantity = 1) {
      this.$store.commit("delItem", {
        itemKeys: { name: product.name },
        quantity: quantity
      });
      this.$q.notify({
        message: "Eliminado del carrito de compras",
        color: "negative"
      });
    },
    itemKeys() {
      alert(JSON.stringify(this.$store.getters.itemKeys));
      this.$store.commit("empty");
      this.cart = this.$store.getters.cart;
    }
  }
};
</script>