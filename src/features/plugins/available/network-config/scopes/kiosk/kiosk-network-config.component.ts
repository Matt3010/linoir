import {Component, input, InputSignal} from '@angular/core';
import {CalendarPlugin} from '../../../calendar/CalendarPlugin';

@Component({
  selector: 'lin-kiosk-network-config',
  imports: [],
  templateUrl: './kiosk-network-config.component.html',
  styleUrl: './kiosk-network-config.component.css'
})
export class KioskNetworkConfigComponent {
  public classInput: InputSignal<CalendarPlugin> = input.required<CalendarPlugin>();
}
