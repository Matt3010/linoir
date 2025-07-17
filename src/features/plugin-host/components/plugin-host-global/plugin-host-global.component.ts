import {AfterViewInit, Component, input, InputSignal, QueryList, ViewChildren, ViewContainerRef,} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {PluginLoaderService} from '../../../plugin-registry/services/plugin-loader.service';
import {Plugin} from '../../../plugin-registry/entities/Plugin';
import {map} from 'rxjs';

@Component({
  selector: 'lin-plugin-host-preview',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    @if (pluginLoader.plugins$ | async) {
      @for (plugin of pluginLoader.plugins$ | async; track $index) {
        <ng-template #pluginContainer></ng-template>
      }
    }
  `
})
export class PluginHostGlobalComponent implements AfterViewInit {

  public scope: InputSignal<string> = input.required<string>();

  @ViewChildren('pluginContainer', {read: ViewContainerRef})
  containers!: QueryList<ViewContainerRef>;

  constructor(protected readonly pluginLoader: PluginLoaderService) {
  }

  public ngAfterViewInit(): void {
    this.pluginLoader.plugins$
      .pipe(
        map((plugins: Plugin[]): Plugin[] => {
          if (this.scope()) {
            return plugins.filter(p => p.conf.scope === this.scope());
          }
          return plugins;
        })
      )
      .subscribe((filteredPlugins: Plugin[]): void => {
        (async () => {
          for (let i = 0; i < filteredPlugins.length; i++) {
            const plugin = filteredPlugins[i];
            const component = await this.pluginLoader.loadComponent(plugin);
            const container = this.containers.get(i);
            container?.clear();
            container?.createComponent(component);
          }
        })();
      });
  }
}
