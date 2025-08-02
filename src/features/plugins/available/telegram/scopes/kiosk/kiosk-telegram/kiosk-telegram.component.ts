import {Component, input, InputSignal} from '@angular/core';
import {TelegramPluginWithMixins} from '../../../../../entities';

@Component({
  selector: 'lin-kiosk-telegram',
  templateUrl: './kiosk-telegram.component.html',
  styleUrl: './kiosk-telegram.component.css'
})
export class KioskTelegramComponent {
  public classInput: InputSignal<InstanceType<typeof TelegramPluginWithMixins>> = input.required<InstanceType<typeof TelegramPluginWithMixins>>();
}
