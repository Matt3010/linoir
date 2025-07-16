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
          import('../configurator/admin.routes').then(m => m.CONFIGURATOR_ROUTES)
      },
      {
        path: RoutesDefinition.deck,
        loadChildren: () =>
          import('./../deck/deck.routes').then(m => m.DECK_ROUTES)
      }
    ]
  }
];
