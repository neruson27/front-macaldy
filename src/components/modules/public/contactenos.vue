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
      <googlemaps
      class="travel-map" :mapConfig="mapConfig" apiKey="AIzaSyB15S-rZ7wiCwMX9RTXfW-qdd1WsqFlMAM">
      </googlemaps>
    </div>
    <div class="col-9">
      <div class="row justify-between q-ma-xl">
        <div class="col-5 q-mt-lg">
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
            <div class="col-4 row justify-around">
              <q-btn flat rounded type="a" href="https://wa.me/573138348673?text=Hola estoy interesad@ en sus productos" icon="img:/statics/icons/whatsapp_gris.svg" height="30px" width="30px"></q-btn>
              <q-btn flat rounded type="a" href="tel:+573138348673" icon="img:/statics/icons/telefono_gris.svg" height="30px" width="30px"></q-btn>
            </div>
            <span class="col-12 q-mt-sm">+57 318 717 7955</span>
            <div class="col-4 row justify-around">
              <q-btn flat rounded type="a" href="https://wa.me/573187177955?text=Hola estoy interesad@ en sus productos" icon="img:/statics/icons/whatsapp_gris.svg" height="30px" width="30px"></q-btn>
              <q-btn flat rounded type="a" href="tel:+573187177955" icon="img:/statics/icons/telefono_gris.svg" height="30px" width="30px"></q-btn>
            </div>
            <div class="col-12 row q-mt-lg">
              <q-img class="q-mr-sm q-mb-sm" src="/statics/icons/marcador_gris.svg" height="30px" width="30px"></q-img>
              <span class="q-pt-sm">Cr 38 # 9-45 C.C Bahia</span>
            </div>
            <div class="col-12">
              <q-img src="/statics/icons/mail_gris.svg" height="30px" width="30px"></q-img>
              <q-btn no-caps rounded flat class="col-12" type="a" href="mailto:comercial@verticeaudio.com" label="comercial@verticeaudio.com"/>
            </div>
            </q-btn>
            <div class="col-12 row">
              <q-img class="q-mr-sm q-mb-sm" src="/statics/icons/mail_col.svg" height="30px" width="30px"></q-img>
              <span class="q-pt-sm">Bogotá - Colombia</span>
            </div>
          </div>
        </div>
        <div class="col-5">
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
import googlemaps from "@/components/components/googlemaps";
import GoogleMapMarker from "@/components/components/GoogleMapMarker"
import GoogleMapLine from "@/components/components/GoogleMapLine"
import { mapSettings } from "@/config/mapSettings";

export default {
  name: "contactenos",
  components: {
    googlemaps,
    GoogleMapMarker,
    GoogleMapLine
  },
  data() {
    return {
      name: "",
      email: "",
      telefono: "",
      mensaje: "",
       markers: [
        { id: 'a', position: { lat: 8, lng: 64 } },
        { id: 'b', position: { lat: 8, lng: -64} },
        { id: 'c', position: { lat: 6, lng: 97 } }
      ],
      lines: [
        { id: '1', path: [{ lat: 3, lng: 101 }, { lat: 5, lng: 99 }] },
        { id: '2', path: [{ lat: 5, lng: 99 }, { lat: 6, lng: 97 }] }
      ],
    };
  },
  computed: {
    mapConfig () {
      return {
        ...mapSettings,
        center: this.mapCenter
      }
    },

    mapCenter () {
      return this.markers[1].position
    }
  }
};
</script>
