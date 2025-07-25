import {Component, input, InputSignal} from '@angular/core';
import {CalendarPlugin} from '../../CalendarPlugin';
import {WithKioskable} from '../../../../models/_index';
import {WithSocketable} from '../../../../models/mixins/Socketable';

@Component({
  selector: 'lin-kiosk-calendar',
  imports: [],
  templateUrl: './kiosk-calendar.component.html',
  styleUrl: './kiosk-calendar.component.css'
})
export class KioskCalendarComponent {

  public classInput: InputSignal<WithKioskable<WithSocketable<CalendarPlugin>>> = input.required<WithKioskable<WithSocketable<CalendarPlugin>>>();

}
