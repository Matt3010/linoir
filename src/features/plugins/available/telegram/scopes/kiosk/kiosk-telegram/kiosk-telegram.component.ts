import {Component, input, InputSignal} from '@angular/core';
import {TelegramPluginWithMixins} from '../../../../../entities';
import {AuthComponent} from './components/auth/auth.component';

@Component({
  selector: 'lin-kiosk-telegram',
  templateUrl: './kiosk-telegram.component.html',
  imports: [
    AuthComponent
  ],
  styleUrl: './kiosk-telegram.component.css'
})
export class KioskTelegramComponent {
  public classInput: InputSignal<InstanceType<typeof TelegramPluginWithMixins>> = input.required<InstanceType<typeof TelegramPluginWithMixins>>();
}
