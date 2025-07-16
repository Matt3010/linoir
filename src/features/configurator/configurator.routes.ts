import {Routes} from '@angular/router';
import RoutesDefinition from '../../common/routes-definition';

export const CONFIGURATOR_ROUTES: Routes = [
  {
    path: RoutesDefinition.configurator,
    loadComponent: () => import('./../configurator/pages/configurator/configurator').then(m => m.Configurator)
  }
]
