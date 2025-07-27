import {Component, input, InputSignal} from '@angular/core';
import {NetworkConfigPlugin} from '../../NetworkConfigPlugin';
import {WithDockable, WithKioskable} from '../../../../models/_index';
import {WithSocketable} from '../../../../models/mixins/Socketable';

@Component({
  selector: 'lin-admin-network-config',
  imports: [],
  templateUrl: './admin-network-config.component.html',
  styleUrl: './admin-network-config.component.css'
})
export class AdminNetworkConfigComponent {
  public classInput: InputSignal<WithKioskable<WithDockable<WithSocketable<NetworkConfigPlugin>>>> = input.required<WithKioskable<WithDockable<WithSocketable<NetworkConfigPlugin>>>>();

}
