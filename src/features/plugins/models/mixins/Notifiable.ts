import {Constructor} from '../../entities';
import {InputSignal} from '@angular/core';
import {distinctUntilChanged} from 'rxjs';

export function Notifiable<
  TBase extends Constructor<
    {
      classInput: InputSignal<any>;
      ngOnInit(): void;
    }
  >
>(Base: TBase) {
  return class extends Base {
    override ngOnInit() {
      super.ngOnInit();
      console.log('Notifiable mixin initialized');

      const plugin = this.classInput();
      if (plugin) {
        plugin.configurationChangeEvent.pipe(
          distinctUntilChanged()
        ).subscribe(() => {
          plugin.updateAllClientsConfig(plugin.configuration);
        });
      }
    }
  };
}
