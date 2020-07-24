<template>
  <div class="q-my-md row justify-center">
    <q-card class="q-px-md q-mx-md col-10" bordered>
      <q-card-section class="row q-pt-xs">
        <q-card-section class="row"  :style="$q.screen.lt.md ? 'margin-left: -40px' : ''" :class="$q.screen.lt.md ? 'justify-center' : 'justify-start'">
          <div class="text-h5 q-mt-sm q-mb-lg col-12">Resumen de la compra</div>
          <q-list bordered class="col-11 bg-white rounded-borders">
            <q-item class="row justify-between" v-for="(product,index) in products" :key="index">
              <q-card-section class="col-6">
                <q-img
                  class="rounded-borders q-mr-lg"
                  :src="product.highlight ? config.api.url + product.highlight : config.api.url + product.image[0]"
                  width="100px"
                  height="100px"
                />
                <span><b>{{product.name}}</b> - {{product.branch.name}} | {{product.description.slice(0,10)}}...</span>
              </q-card-section>

              <q-item-section class="col-6">
                <div class="row justify-end text-grey-8">
                  <span class="q-mr-md"><b>Unidades: </b><q-btn
              outline
              class="text-black no-pointer-events"
              color="white"
              size="xs"
              :label="product.quantity"
              ></q-btn></span>
              <span class="q-mr-md"><b>Total: </b><q-btn
              outline
              class="text-black no-pointer-events"
              color="white"
              size="xs"
              :label="'$ ' + format(product.quantity*product.price)"
              ></q-btn></span>
                  <div>
                    <q-btn size="12px" flat dense round icon="mdi-plus" @click="add(product)"/>
                    <q-btn size="12px" flat dense round icon="mdi-minus" @click="del(product)"/>
                    <q-btn size="12px" flat dense round icon="mdi-delete" @click="deleted(product, product.quantity)"/>
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card-section>

      <q-separator />

      <q-card-actions class="row justify-between">
        <p class="text-subtitle1">Total: <b class="q-ml-xs"><span class="text-h6">{{'$ '}}</span>{{format(total)}}</b></p>
        <form ref="myform"></form>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
  import config from "@/config"
  export default {
    name: "checkout",
    data() {
      return {
        products: (this.products = this.$store.getters.cart),
        config: config
      };
    },
    mounted() {
      console.log(this.products)
      let payconame = `Vertice Audio: Compra de ${this.numberOfitemsInCart} articulos`
      let description = ''
      for (let item of this.products) {
        description = `${item.name} [Ctd: ${item.quantity}] ` + description
      }
      console.log(description)
      let foo = document.createElement('script');    
      foo.setAttribute("src","https://checkout.epayco.co/checkout.js")
      foo.setAttribute("class","epayco-button")
      foo.setAttribute("data-epayco-key","491d6a0b6e992cf924edd8d3d088aff1")
      foo.setAttribute("data-epayco-amount", this.total)
      foo.setAttribute("data-epayco-name", payconame)
      foo.setAttribute("data-epayco-description", description)
      foo.setAttribute("data-epayco-currency","cop")
      foo.setAttribute("data-epayco-country","co")
      foo.setAttribute("data-epayco-test","true")
      foo.setAttribute("data-epayco-external","true")
      foo.setAttribute("data-epayco-response","http://localhost:8080/#/response")
      this.$refs.myform.appendChild(foo);
    },
    computed: {
      total() {
        return this.products.reduce((total, p) => {
          return total + p.price * p.quantity;
        }, 0);
      },
      numberOfitemsInCart() {
        let cart = this.$store.getters.cart;
        return cart.reduce((accum, item) => accum + item.quantity, 0);
      },
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
          audio: producto.audio,
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
      deleted(product, quantity) {
        this.$store.commit("delItem", {
          itemKeys: { name: product.name },
          quantity: quantity
        });
        this.$q.notify({
          message: "Eliminado del carrito de compras",
          color: "negative"
        });
      },
    }
  }
</script>