import {Component, input, InputSignal} from '@angular/core';
import {NetworkConfigPluginWithMixins} from '../../../../entities';

@Component({
  selector: 'lin-kiosk-network-config',
  imports: [],
  templateUrl: './kiosk-network-config.component.html',
  styleUrl: './kiosk-network-config.component.css'
})
export class KioskNetworkConfigComponent {
  public classInput: InputSignal<InstanceType<typeof NetworkConfigPluginWithMixins>> = input.required<InstanceType<typeof NetworkConfigPluginWithMixins>>();
}
