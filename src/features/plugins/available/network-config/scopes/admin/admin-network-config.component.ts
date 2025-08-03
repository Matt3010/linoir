import {Component, input, InputSignal} from '@angular/core';
import {MixedNetworkConfigPlugin} from '../../../../entities';

@Component({
  selector: 'lin-admin-network-config',
  imports: [],
  templateUrl: './admin-network-config.component.html',
  styleUrl: './admin-network-config.component.css'
})
export class AdminNetworkConfigComponent {
  public classInput: InputSignal<MixedNetworkConfigPlugin> = input.required<MixedNetworkConfigPlugin>();

}
