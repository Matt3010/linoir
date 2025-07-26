import {Component, input, InputSignal} from '@angular/core';
import {CalendarPlugin} from '../../../calendar/CalendarPlugin';

@Component({
  selector: 'lin-dock-network-config',
  imports: [],
  templateUrl: './dock-network-config.component.html',
  styleUrl: './dock-network-config.component.css'
})
export class DockNetworkConfigComponent {
  public classInput: InputSignal<CalendarPlugin> = input.required<CalendarPlugin>();
}
