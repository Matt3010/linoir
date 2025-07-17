import {AfterViewInit, Component, input, InputSignal, QueryList, ViewChildren, ViewContainerRef,} from '@angular/core';
import {PluginLoaderService} from '../../../plugin-registry/services/plugin-loader.service';
import {Plugin} from '../../../plugin-registry/entities/Plugin';

@Component({
  selector: 'lin-plugin-host-preview',
  standalone: true,
  imports: [],
  template: `
    @if (this.pluginLoader.plugins.length) {
      @for (plugin of this.pluginLoader.plugins; track $index) {
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

  filteredPlugins(plugins: Plugin[]): Plugin[] {
    if (this.scope()) {
      return plugins.filter((p) => p.conf.scope === this.scope());
    }
    return plugins;
  }

  public ngAfterViewInit(): void {
    (async () => {
      for (let i = 0; i < this.pluginLoader.plugins.length; i++) {
        const plugin = this.pluginLoader.plugins[i];
        const component = await this.pluginLoader.loadComponent(plugin);
        const container = this.containers.get(i);
        container?.clear();
        container?.createComponent(component);
      }
    })();

  }
}
