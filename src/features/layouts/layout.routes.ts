import {Routes} from '@angular/router';
import RoutesDefinition from '../../common/routes-definition';
import {MainLayout} from './main-layout/main-layout';
import {RenderType} from '../render/enums/render-type';
import {RenderResolver} from '../render/resolvers/render.resolver';

export const LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: RoutesDefinition.kiosk,
        loadComponent: () =>
          import('../render/pages/render-container/render-container.component').then(m => m.RenderContainerComponent),
        resolve: {
          hostComponent: RenderResolver
        },
        data: {
          scope: RenderType.Kiosk,
        },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../render/pages/render-container/render-container.component').then(m => m.RenderContainerComponent),
            resolve: {
              hostComponent: RenderResolver
            },
            data: {
              scope: RenderType.Dock,
            },
          }
        ]
      },
      {
        path: RoutesDefinition.admin,
        loadComponent: () =>
          import('../render/pages/render-container/render-container.component').then(m => m.RenderContainerComponent),
        resolve: {
          hostComponent: RenderResolver
        },
        data: {
          scope: RenderType.Admin,
        },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../render/pages/render-container/render-container.component').then(m => m.RenderContainerComponent),
            resolve: {
              hostComponent: RenderResolver
            },
            data: {
              scope: RenderType.Kiosk,
            },
          }
        ]
      },
    ]
  },
];
