export default [
  {
    path: "/contactenos",
    name: "contactenos",
    component: () => import("components/modules/public/contactenos")
  },
  {
    path: "/productos",
    name: "productos",
    component: () => import("components/modules/public/productos"),
    meta: {
      requiresAuth: false
    },
  },
  {
    path: "/servicios",
    name: "servicios",
    component: () => import("components/modules/public/servicios")
  },
  {
    path: "/nosotros",
    name: "nosotros",
    component: () => import("components/modules/public/nosotros")
  },
  {
    path: "/detalles",
    name: "detalles",
    component: () => import("@/components/components/detalles"),
    meta: {
      requiresAuth: false
    },
  },
  {
    path: "/checkout",
    name: "checkout",
    component: () => import("@/components/components/checkout")
  },
  {
    path: "/response",
    name: "response",
    component: () => import("@/components/components/response"),
    props: true
  },
  {
    path: "/confirmacion",
    name: "confirmacion",
    component: () => import("@/components/components/confirmacion"),
    props: true
  },
];
