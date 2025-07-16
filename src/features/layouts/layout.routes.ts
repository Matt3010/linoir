import {Routes} from '@angular/router';
import RoutesDefinition from '../../common/routes-definition';

export const LAYOUT_ROUTES: Routes = [
  {
    path: RoutesDefinition.base,
    pathMatch: 'full',
    redirectTo: RoutesDefinition.configurator,
  },
  {
    path: RoutesDefinition.base,
    children: [
      {
        path: RoutesDefinition.configurator,
        loadChildren: () =>
          import('./../configurator/configurator.routes').then(m => m.CONFIGURATOR_ROUTES)
      }
    ]
  },
  {
    path: '**',
    redirectTo: RoutesDefinition.configurator,
  }
];
