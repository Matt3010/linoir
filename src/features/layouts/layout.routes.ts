import {Routes} from '@angular/router';
import RoutesDefinition from '../../common/routes-definition';
import {MainLayout} from './main-layout/main-layout';
import {PluginHostType} from '../plugin-host/enums/plugin-host-type';
import {PluginHostResolver} from '../plugin-host/resolvers/plugin-host-resolver';

export const LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: RoutesDefinition.admin,
        loadComponent: () =>
          import('../plugin-host/pages/plugin-host-container/plugin-host-container-component').then(m => m.PluginHostContainerComponent),
        resolve: {
          hostComponent: PluginHostResolver
        },
        data: {
          pluginHostType: PluginHostType.Global,
          scope: 'admin'
        }
      },
      {
        path: RoutesDefinition.kiosk,
        loadComponent: () =>
          import('../plugin-host/pages/plugin-host-container/plugin-host-container-component').then(m => m.PluginHostContainerComponent),
        resolve: {
          hostComponent: PluginHostResolver
        },
        data: {
          pluginHostType: PluginHostType.Preview,
          scope: 'kiosk'
        }
      }
    ]
  }
];
