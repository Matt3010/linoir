import {Routes} from '@angular/router';
import RoutesDefinition from '../common/routes-definition';

export const APP_ROUTES: Routes = [
  {
    path: RoutesDefinition.base,
    redirectTo: RoutesDefinition.configurator,
    pathMatch: 'full'
  },
  {
    path: RoutesDefinition.base,
    loadChildren: () =>
      import('./../features/layouts/layout.routes').then(m => m.LAYOUT_ROUTES)
  },
  {
    path: '**',
    redirectTo: RoutesDefinition.configurator
  }
];
