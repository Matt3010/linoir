import {Component, input, InputSignal} from '@angular/core';
import {TelegramPluginWithMixins} from '../../../../../entities';

@Component({
  selector: 'lin-admin-telegram',
  imports: [],
  templateUrl: './admin-telegram.component.html',
  styleUrl: './admin-telegram.component.css'
})
export class AdminTelegramComponent {
  public classInput: InputSignal<TelegramPluginWithMixins> = input.required<TelegramPluginWithMixins>();

}
