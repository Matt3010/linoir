import {Directive, input, InputSignal, OnInit} from '@angular/core';
import {PossiblePlugin} from '../../entities';

// use Directive Decorator to have access to angular component lifecycle hooks without defining a full component
@Directive()
export abstract class ShouldNotify<T extends PossiblePlugin> implements OnInit {
  public classInput: InputSignal<T> = input.required<T>();

  public ngOnInit(): void {
    const plugin: T = this.classInput();
    if (plugin?.configurationChangeEvent) {
      plugin.configurationChangeEvent.pipe(
      ).subscribe((): void => {
        plugin.updateAllClientsConfig(plugin.configuration);
      });
    }
  }
}
