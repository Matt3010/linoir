import {Routes} from '@angular/router';
import RoutesDefinition from '../common/routes-definition';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: RoutesDefinition.configurator,
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () =>
      import('./../features/layouts/layout.routes').then(m => m.LAYOUT_ROUTES)
  },
  {
    path: '**',
    redirectTo: RoutesDefinition.configurator
  }
];
