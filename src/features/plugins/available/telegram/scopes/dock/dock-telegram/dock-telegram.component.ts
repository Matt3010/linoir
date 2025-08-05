import {ChangeDetectionStrategy, Component, input, InputSignal} from '@angular/core';
import {MixedTelegramPlugin} from '../../../../../entities';

@Component({
  selector: 'lin-dock-telegram',
  imports: [],
  templateUrl: './dock-telegram.component.html',
  styleUrl: './dock-telegram.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DockTelegramComponent {
  public classInput: InputSignal<MixedTelegramPlugin> = input.required<MixedTelegramPlugin>();

}
