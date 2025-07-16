import {Routes} from '@angular/router';
import RoutesDefinition from '../../common/routes-definition';

export const LAYOUT_ROUTES: Routes = [
  {
    path: RoutesDefinition.configurator,
    loadChildren: () => import('./../configurator/configurator.routes').then(m => m.CONFIGURATOR_ROUTES)
  }
]
