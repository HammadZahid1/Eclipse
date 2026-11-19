export const ROUTES = {
  home: '/',
  explore: '/explore',
  solarSystem: '/solar-system',
  blackHole: '/black-hole',
  galaxy: '/galaxy',
  orbitLab: '/orbit-lab',
  about: '/about',
} as const;

export type RouteKey = keyof typeof ROUTES;
