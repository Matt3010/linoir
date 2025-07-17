import {Routes} from '@angular/router';
import RoutesDefinition from '../../common/routes-definition';
import {MainLayout} from './main-layout/main-layout';

export const LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: RoutesDefinition.admin,
        loadChildren: () =>
          import('../admin/admin.routes').then(m => m.CONFIGURATOR_ROUTES)
      },
      {
        path: RoutesDefinition.kiosk,
        loadChildren: () =>
          import('../deck/kiosk.routes').then(m => m.KIOSK_ROUTES)
      }
    ]
  }
];
