import {Component, input, InputSignal} from '@angular/core';
import {WithKioskable} from '../../../../models/mixins/Kioskable';
import {WithDockable} from '../../../../models/mixins/Dockable';
import {WithSocketable} from '../../../../models/mixins/Socketable';
import {NetworkConfigPlugin} from '../../NetworkConfigPlugin';

@Component({
  selector: 'lin-kiosk-network-config',
  imports: [],
  templateUrl: './kiosk-network-config.component.html',
  styleUrl: './kiosk-network-config.component.css'
})
export class KioskNetworkConfigComponent {
  public classInput: InputSignal<WithKioskable<WithDockable<WithSocketable<NetworkConfigPlugin>>>> = input.required<WithKioskable<WithDockable<WithSocketable<NetworkConfigPlugin>>>>();
}
