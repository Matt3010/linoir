import {Component, input, InputSignal} from '@angular/core';
import {NetworkConfigPlugin} from '../../NetworkConfigPlugin';
import {WithDockable, WithKioskable} from '../../../../models';

@Component({
  selector: 'lin-network-config',
  imports: [],
  templateUrl: './network-config.component.html',
  styleUrl: './network-config.component.css'
})
export class NetworkConfigComponent {
  public classInput: InputSignal<WithKioskable<WithDockable<NetworkConfigPlugin>>> = input.required<WithKioskable<WithDockable<NetworkConfigPlugin>>>();
}
