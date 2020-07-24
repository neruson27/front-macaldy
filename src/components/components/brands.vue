<style lang="stylus">
.hooper {
  height: 100px;
}
</style>
<template>
  <div>
    <hooper :settings="hooperSettings">
      <slide v-for="branch in branchs" :key="branch._id">
        <q-avatar size="70px">
          <img :src="config.api.url + branch.image" />
        </q-avatar>
      </slide>
    </hooper>
    <hooper :settings="hooperSettings">
      <slide v-for="branch in branchReverse" :key="branch._id">
        <q-avatar size="70px">
          <img :src="config.api.url + branch.image" />
        </q-avatar>
      </slide>
    </hooper>
  </div>
</template>

<script>
import { Hooper, Slide } from "hooper";
import { BRANCH_QUERY } from "@/graphql/products"
import "hooper/dist/hooper.css";
import config from "@/config"
export default {
  name: "brands",
  components: {
    Hooper,
    Slide
  },
  data() {
    return {
      config: config,
      hooperSettings: {
        infiniteScroll: true,
        autoPlay: true,
        itemsToShow: 6,
        centerMode: true,
        pagination: "no",
        breakpoints: {
          3: {
            centerMode: true,
            itemsToShow: 3
          },
          300: {
            centerMode: false,
            itemsToShow: 3
          },
          600: {
            centerMode: false,
            itemsToShow: 6
          },
          800: {
            centerMode: false,
            itemsToShow: 6
          },
          1000: {
            itemsToShow: 6,
            pagination: 'fraction'
          }
        },
      },
      branchs: [],
      branchReverse: []
    };
  },
  async created() {
    await this.allBranchs()
    this.hooperSettings.itemsToShow = this.branchs.length
  },
  methods: {
    allBranchs() {
      return this.$apollo
        .query({
          query: BRANCH_QUERY,
          fetchPolicy: "network-only"
        })
        .then(response => {
          this.branchs = Object.assign([], response.data.AllBranchs);
          this.branchReverse = Object.assign([], response.data.AllBranchs);
          this.branchReverse.sort(function(a, b) {
            return 1
          })
        })
        .catch(err => {
          console.log("hubo un error: ", err);
        });
    },
  }
};
</script>