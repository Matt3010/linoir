import {Routes} from '@angular/router';

export const KIOSK_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/kiosk/kiosk.component').then(m => m.KioskComponent)
  }
]
