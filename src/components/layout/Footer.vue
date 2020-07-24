<template>
  <section class="bg-secondary text-white" v-if="!$store.state.user.isAuthenticated && $route.name !== 'login'">
    <div class="row justify-center text-center bg-franja">
      <div class="col-12" style="height:30px;"></div>
    </div>
    <div class="row justify-center bg-footer">
      <div class="col-xl-9 col-lg-9 col-md-12 col-sm-9 col-xs-9">
        <div class="row">
          <div class="col-lg-5 col-xl-5 col-md-5 col-sm-12 col-xs-12 self-center">
            <q-img src="/statics/img/logo_2.png" style="width: 300px" />
          </div>
          <div class="col-lg-4 col-xl-4 col-md-4 col-sm-12 col-xs-12 self-center">
            <div class="row justify-center text-left">
              <div class="col-12">
                <q-btn
                  dark
                  no-caps
                  color="franja"
                  icon="mdi-facebook-box"
                  size="md"
                  flat
                  label="@CentroMedicoInColger"
                ></q-btn>
              </div>
              <div class="col-12">
                <q-btn
                  dark
                  no-caps
                  color="franja"
                  icon="mdi-instagram"
                  size="md"
                  flat
                  label="@CentroMedicoInColger"
                ></q-btn>
              </div>
              <div class="col-12">
                <q-btn
                  dark
                  no-caps
                  color="franja"
                  icon="mdi-headset"
                  size="md"
                  flat
                  label="Servicio al cliente"
                ></q-btn>
              </div>
              <div class="col-12 q-ma-sm q-ml-xl q-mt-xs">
                <span style="font-size:10px;" class="text-bold">Pago Online Seguro</span>
                <br />
                <q-img src="statics/img/logo_epayco_400px.png" spinner-color="franja" width="20%"  class="bg-franja q-mb-xs" style="border: 2px solid #572d14;" container/>
                <br />
                <q-img src="statics/img/parte_1.png" spinner-color="franja" width="60%" />
                <br />
                <q-img src="statics/img/parte_2.png" spinner-color="franja" width="60%" />
              </div>
              <div class="col-12 q-ma-sm q-ml-xl"></div>
            </div>
          </div>
          <div class="col-lg-3 col-xl-3 col-md-3 col-sm-12 col-xs-12 self-center">
            <div class="row">
              <div class="col-12">
                <q-btn
                  dark
                  no-caps
                  color="franja"
                  icon="mdi-google-maps"
                  flat
                  label="Cr 38 # 9-45 C.C Bahia"
                ></q-btn>
                <q-btn
                  dark
                  no-caps
                  color="franja"
                  icon="mdi-map"
                  flat
                  label="Bogota - Colombia"
                ></q-btn>
                <q-btn
                  dark
                  no-caps
                  color="franja"
                  icon="mdi-whatsapp"
                  flat
                  label="+57 313 8348673"
                  type="a"
                  href="https://wa.me/3138348673"
                ></q-btn>
                <q-btn
                  dark
                  no-caps
                  color="franja"
                  icon="mdi-phone-settings-outline"
                  flat
                  label="+57 310 206 6376"
                ></q-btn>
                <q-btn
                  dark
                  no-caps
                  color="franja"
                  icon="mdi-email"
                  flat
                  label="comercial@verticeaudio.com"
                  type="a"
                  href="mailto:comercial@verticeaudio.com"
                ></q-btn>
              </div>
            </div>
            <div class="row q-ml-md q-mt-xs q-mb-sm">
              <div class="col-6">
                <span style="font-size:10px;">Desarrollado por:</span>
                <q-img src="statics/img/logo_promedios.png" spinner-color="franja" width="80%" />
              </div>
              <div class="col-2 self-center">
                <q-btn align="left" flat rounded type="a" href="https://wa.me/573158394620?text=Hola estoy interesad@ en contactarlos" icon="mdi-whatsapp"></q-btn>
              </div>
              <div class="col-2 self-center">
                <q-btn flat rounded type="a" href="mailto:comercial@promediosdigitales.com" icon="mdi-email"></q-btn>
              </div>
              <div class="col-2 self-center">
                <q-btn flat rounded type="a" href="tel:+573182534334" icon="mdi-phone-settings-outline"></q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row text-center q-py-lg q-pl-xl" style="background-color:#111111;">
      <span class="text-justify q-mr-xs">Políticas de privacidad y tratamiento de datos personales /</span>

      <span class="text-justify q-mr-xs">© 2018 Vertice Audio S.A.S. Todos los derechos reservados /</span>

      <span class="text-justify text-no-wrap">Prohibida la copia, reproducción parcial o total de los contenidos</span>
    </div>
  </section>
</template>
<script>
export default {
  name: "Footer"
};
</script>