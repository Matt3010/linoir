import {Component, input, InputSignal} from '@angular/core';
import {TelegramPluginWithMixins} from '../../../../../entities';

@Component({
  selector: 'lin-kiosk-telegram',
  imports: [],
  templateUrl: './kiosk-telegram.component.html',
  styleUrl: './kiosk-telegram.component.css'
})
export class KioskTelegramComponent {
  public classInput: InputSignal<TelegramPluginWithMixins> = input.required<TelegramPluginWithMixins>();

}
