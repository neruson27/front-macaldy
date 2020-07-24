<template>
  <div class="row justify-center q-py-lg q-my-lg">
    <p class="text-h4">{{response ? 'Compra Realizada con exito!' : 'Error!'}}</p>
  </div>
</template>

<script>
  import { CREATE_ORDER } from "@/graphql/orders";
  export default {
    name: "checkout",
    data() {
      return {
        products: (this.products = this.$store.getters.cart),
        response: '',
      };
    },
    created() {
      console.log(this.$route.query.ref_payco)
      this.response = this.$route.query.ref_payco
      setTimeout(this.createOrder(), 1000)
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
      createOrder() {
        let data = {
          ref_payco: this.response,
          products: this.products,
          price: this.total,
        };
        this.$apollo
          .mutate({
            mutation: CREATE_ORDER,
            variables: {
              data
            }
          })
          .then(response => {
            console.log(response);
            this.$store.commit("empty")
            setTimeout(this.$router.push("/"), 30000)
          })
          .catch(err => {
            console.log("hubo un error: ", err);
          });
      },
    }
  }
</script>