import {Component, input, InputSignal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MixedTelegramPlugin} from '../../../../../entities';

@Component({
  selector: 'lin-admin-telegram',
  imports: [
    FormsModule
  ],
  templateUrl: './admin-telegram.component.html',
  styleUrl: './admin-telegram.component.css'
})
export class AdminTelegramComponent {
  public classInput: InputSignal<MixedTelegramPlugin> = input.required<MixedTelegramPlugin>();
}
