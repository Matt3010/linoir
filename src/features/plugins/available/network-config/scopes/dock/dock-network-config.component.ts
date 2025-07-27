import {Component, input, InputSignal} from '@angular/core';
import {WithKioskable} from '../../../../models/mixins/Kioskable';
import {WithDockable} from '../../../../models/mixins/Dockable';
import {WithSocketable} from '../../../../models/mixins/Socketable';
import {NetworkConfigPlugin} from '../../NetworkConfigPlugin';

@Component({
  selector: 'lin-dock-network-config',
  imports: [],
  templateUrl: './dock-network-config.component.html',
  styleUrl: './dock-network-config.component.css'
})
export class DockNetworkConfigComponent {
  public classInput: InputSignal<WithKioskable<WithDockable<WithSocketable<NetworkConfigPlugin>>>> = input.required<WithKioskable<WithDockable<WithSocketable<NetworkConfigPlugin>>>>();
}
