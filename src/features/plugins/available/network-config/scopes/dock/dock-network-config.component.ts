import {Component, input, InputSignal} from '@angular/core';
import {NetworkConfigPluginWithMixins} from '../../../../entities';

@Component({
  selector: 'lin-dock-network-config',
  imports: [],
  templateUrl: './dock-network-config.component.html',
  styleUrl: './dock-network-config.component.css'
})
export class DockNetworkConfigComponent {
  public classInput: InputSignal<InstanceType<typeof NetworkConfigPluginWithMixins>> = input.required<InstanceType<typeof NetworkConfigPluginWithMixins>>();
}
