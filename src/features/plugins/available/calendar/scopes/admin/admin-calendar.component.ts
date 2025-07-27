import {Component, input, InputSignal} from '@angular/core';
import {CalendarPlugin} from '../../CalendarPlugin';
import {WithKioskable} from '../../../../models/_index';
import {WithSocketable} from '../../../../models/mixins/Socketable';

@Component({
  selector: 'lin-admin-calendar',
  imports: [],
  templateUrl: './admin-calendar.component.html',
  styleUrl: './admin-calendar.component.css'
})
export class AdminCalendarComponent {

  public classInput: InputSignal<WithKioskable<WithSocketable<CalendarPlugin>>> = input.required<WithKioskable<WithSocketable<CalendarPlugin>>>();

}
