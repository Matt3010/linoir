import {Component, input, InputSignal} from '@angular/core';
import {CalendarPlugin} from '../../../../../models/CalendarPlugin';

@Component({
  selector: 'lin-network-config',
  imports: [],
  templateUrl: './network-config.component.html',
  styleUrl: './network-config.component.css'
})
export class NetworkConfigComponent {
  public classInput: InputSignal<CalendarPlugin> = input.required<CalendarPlugin>();

}
