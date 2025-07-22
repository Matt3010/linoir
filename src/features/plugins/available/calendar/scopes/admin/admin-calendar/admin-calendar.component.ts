import {Component, input, InputSignal} from '@angular/core';
import {CalendarPlugin} from '../../../CalendarPlugin';

@Component({
  selector: 'lin-admin-calendar',
  imports: [],
  templateUrl: './admin-calendar.component.html',
  styleUrl: './admin-calendar.component.css'
})
export class AdminCalendarComponent {

  public classInput: InputSignal<CalendarPlugin> = input.required<CalendarPlugin>();

}
