import {Routes} from '@angular/router';

export const CONFIGURATOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./../configurator/pages/configurator/configurator').then(m => m.Configurator)
  }
];
