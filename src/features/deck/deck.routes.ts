import {Routes} from '@angular/router';

export const DECK_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./../deck/pages/deck/deck').then(m => m.Deck)
  }
]
