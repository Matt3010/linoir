import {Component, input, InputSignal} from '@angular/core';
import {TelegramPluginWithMixins} from '../../../../../entities';
import {FormsModule} from '@angular/forms';
import {ShouldNotify} from '../../../../../models/behaviors/ShouldNotify';

@Component({
  selector: 'lin-admin-telegram',
  imports: [
    FormsModule
  ],
  templateUrl: './admin-telegram.component.html',
  styleUrl: './admin-telegram.component.css'
})
export class AdminTelegramComponent extends ShouldNotify<InstanceType<typeof TelegramPluginWithMixins>> {
  public override classInput: InputSignal<InstanceType<typeof TelegramPluginWithMixins>> = input.required<InstanceType<typeof TelegramPluginWithMixins>>();
}
