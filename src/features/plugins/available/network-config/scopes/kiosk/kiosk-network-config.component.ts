import {Component, input, InputSignal} from '@angular/core';
import {MixedNetworkConfigPlugin} from '../../../../entities';

@Component({
  selector: 'lin-kiosk-network-config',
  imports: [],
  templateUrl: './kiosk-network-config.component.html',
  styleUrl: './kiosk-network-config.component.css'
})
export class KioskNetworkConfigComponent {
  public classInput: InputSignal<MixedNetworkConfigPlugin> = input.required<MixedNetworkConfigPlugin>();
}
