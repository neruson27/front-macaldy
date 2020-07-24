export function lazyLoad(path) {
  return () => import(`@/components${path}.vue`); // path incluye slash inicial @/components/path
}

export function makeMeta(auth) {
  return {
    requiresAuth: auth
  };
}
