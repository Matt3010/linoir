import {Component, input, InputSignal} from '@angular/core';
import {TelegramPluginWithMixins} from '../../../../../entities';

@Component({
  selector: 'lin-dock-telegram',
  imports: [],
  templateUrl: './dock-telegram.component.html',
  styleUrl: './dock-telegram.component.css'
})
export class DockTelegramComponent {
  public classInput: InputSignal<TelegramPluginWithMixins> = input.required<TelegramPluginWithMixins>();

}
