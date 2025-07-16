import {Routes} from '@angular/router';

export const CONFIGURATOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/admin/admin.component').then(m => m.AdminComponent)
  }
];
