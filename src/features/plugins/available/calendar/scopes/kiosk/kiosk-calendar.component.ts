import {Component, input, InputSignal} from '@angular/core';
import {CalendarPlugin} from '../../CalendarPlugin';
import {WithKioskable} from '../../../../models';

@Component({
  selector: 'lin-kiosk-calendar',
  imports: [],
  templateUrl: './kiosk-calendar.component.html',
  styleUrl: './kiosk-calendar.component.css'
})
export class KioskCalendarComponent {

  public classInput: InputSignal<WithKioskable<CalendarPlugin>> = input.required<WithKioskable<CalendarPlugin>>();

}
