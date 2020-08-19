<style>
.travel-map {
  height: 400px;
}
</style>
<template>
  <div class="row justify-center">
    <div>
      <div id="map"></div>
    </div>
    <div class="col-12">
      <MglMap :zoom="17"  :interactive="true" :accessToken="accessToken" :mapStyle.sync="mapStyle" :center.sync="markerCoordinates" class="travel-map">
        <MglMarker
          :coordinates.sync="markerCoordinates"
          color='green'
        />
      </MglMap>
    </div>
    <div class="col-xl-9 col-lg-9 col-md-9 col-sm-11 col-xs-11">
      <div class="row justify-between q-ma-xl">
        <div class="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-xs-12 q-mt-lg">
          <div class="row">
            <div class="col-12 row">
              <q-img class="q-mr-sm q-mb-sm" src="/statics/icons/logo_facebook_blanco.svg" height="30px" width="30px" ></q-img>
              <span class="q-pt-sm">@CentroMedicoIncolger</span>
            </div>
            <div class="col-12 row">
              <q-img class="q-mr-sm q-mb-sm" src="/statics/icons/logo_instagram_blanco.svg" height="30px" width="30px" ></q-img>
              <span class="q-pt-sm">@CentroMedicoIncolger</span>
            </div>
            <div class="col-12 row">
              <q-img class="q-mr-sm q-mb-sm" src="/statics/icons/logo_servicio_cliente_blanco.svg" height="30px" width="30px" ></q-img>
              <span class="q-pt-sm">Servicio al cliente</span>
            </div>
            <span class="col-12 q-mt-lg">+57 313 834 8673</span>
            <div class="col-xl-4 col-lg-4 col-md-5 col-sm-5 col-xs-5 row justify-around">
              <q-btn class="col-5" flat rounded type="a" href="https://wa.me/573138348673?text=Hola estoy interesad@ en sus productos" icon="img:/statics/icons/whatsapp_gris.svg" height="30px" width="30px"></q-btn>
              <q-btn class="col-5" flat rounded type="a" href="tel:+573138348673" icon="img:/statics/icons/telefono_gris.svg" height="30px" width="30px"></q-btn>
            </div>
            <span class="col-12 q-mt-sm">+57 318 717 7955</span>
            <div class="col-xl-4 col-lg-4 col-md-5 col-sm-5 col-xs-5 row justify-around">
              <q-btn class="col-5" flat rounded type="a" href="https://wa.me/573187177955?text=Hola estoy interesad@ en sus productos" icon="img:/statics/icons/whatsapp_gris.svg" height="30px" width="30px"></q-btn>
              <q-btn class="col-5" flat rounded type="a" href="tel:+573187177955" icon="img:/statics/icons/telefono_gris.svg" height="30px" width="30px"></q-btn>
            </div>
            <div class="col-12 row q-mt-lg">
              <q-img class="q-mr-sm q-mb-sm" src="/statics/icons/marcador_gris.svg" height="30px" width="30px"></q-img>
              <span class="q-pt-sm">Cr 38 # 9-45 C.C Bahia</span>
            </div>
            <div class="col-12 q-mb-sm">
              <q-img src="/statics/icons/mail_gris.svg" height="30px" width="30px"></q-img>
              <q-btn no-caps rounded flat class="col-12" type="a" href="mailto:comercial@macaldy.com" label="comercial@macaldy.com"/>
            </div>
            </q-btn>
            <div class="col-12 row">
              <q-img class="q-mr-sm q-mb-sm" src="/statics/icons/mail_col.svg" height="30px" width="30px"></q-img>
              <span class="q-pt-sm">Bogotá - Colombia</span>
            </div>
          </div>
        </div>
        <div class="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-xs-12 q-mt-lg">
          <q-input type="text" v-model="name" label="Nombre" />
          <q-input type="email" v-model="email" label="Email" />
          <q-input type="text" v-model="telefono" label="Telefono" />
          <q-input v-model="mensaje" type="textarea" label="Mensaje" />
          <q-btn color="black" label="Enviar" no-caps class="q-mt-lg"></q-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Mapbox from "mapbox-gl";
import { MglMap, MglMarker } from "vue-mapbox";

export default {
  name: "contactenos",
  components: {
    MglMap,
    MglMarker
  },
  data() {
    return {
      name: "",
      email: "",
      telefono: "",
      mensaje: "",
      accessToken: "pk.eyJ1IjoibmVydXNvbiIsImEiOiJja2Rnc2o1M3YwOXlrMnJscm9vNDdybzh2In0.Dfgt6caD-x6nMRCSo8uuqw",
      mapStyle: "mapbox://styles/mapbox/streets-v11",
      markerCoordinates: [-74.102618, 4.616300],
      center: [4.616300, -74.102618]
    };
  },
};
</script>
