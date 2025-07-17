import {Component, input, InputSignal} from '@angular/core';
import {CalendarPlugin} from '../../../../models/CalendarPlugin';

@Component({
  selector: 'lin-kiosk-calendar',
  imports: [],
  templateUrl: './kiosk-calendar.component.html',
  styleUrl: './kiosk-calendar.component.css'
})
export class KioskCalendarComponent {

  public classInput: InputSignal<CalendarPlugin> = input.required<CalendarPlugin>();

}
