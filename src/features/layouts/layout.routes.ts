import {Routes} from '@angular/router';
import RoutesDefinition from '../../common/routes-definition';
import {MainLayout} from './main-layout/main-layout';

export const LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: RoutesDefinition.configurator,
        loadChildren: () =>
          import('./../configurator/configurator.routes').then(m => m.CONFIGURATOR_ROUTES)
      }
    ]
  }
];
