import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'lin-main-layout',
  imports: [
    RouterOutlet
  ],
  templateUrl: 'main-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayout {

}
