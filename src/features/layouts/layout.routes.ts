import {Routes} from '@angular/router';
import RoutesDefinition from '../../common/routes-definition';
import {MainLayout} from './main-layout/main-layout';
import {RenderType} from '../render/enums/render-type';
import {RenderResolver} from '../render/resolvers/render-resolver.service';

export const LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: RoutesDefinition.admin,
        loadComponent: () =>
          import('../render/pages/render-container/render-container.component').then(m => m.RenderContainerComponent),
        resolve: {
          hostComponent: RenderResolver
        },
        data: {
          pluginHostType: RenderType.Admin,
          scope: 'admin'
        }
      },
      {
        path: RoutesDefinition.kiosk,
        loadComponent: () =>
          import('../render/pages/render-container/render-container.component').then(m => m.RenderContainerComponent),
        resolve: {
          hostComponent: RenderResolver
        },
        data: {
          pluginHostType: RenderType.Kiosk,
          scope: 'kiosk'
        }
      }
    ]
  }
];
