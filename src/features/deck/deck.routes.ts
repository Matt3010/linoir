import {Routes} from '@angular/router';

export const DECK_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/deck/deck.component').then(m => m.DeckComponent)
  }
]
