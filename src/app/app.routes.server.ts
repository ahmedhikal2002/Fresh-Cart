import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'product/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'category/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'brand/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'order/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
