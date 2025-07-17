import {AfterViewInit, Component, input, InputSignal, QueryList, ViewChildren, ViewContainerRef} from '@angular/core';
import {PluginLoaderService} from '../../../plugin-registry/services/plugin-loader.service';
import {Plugin} from '../../../plugin-registry/entities/Plugin';

@Component({
  selector: 'lin-plugin-host-preview',
  standalone: true,
  template: `
    @for (plugin of this.pluginLoader.plugins; track plugin.key + plugin.scope) {
      <ng-template #pluginContainer></ng-template>
    }
  `
})
export class PluginHostPreviewComponent implements AfterViewInit {

  public scope: InputSignal<string> = input.required<string>();

  @ViewChildren('pluginContainer', {read: ViewContainerRef})
  containers!: QueryList<ViewContainerRef>;

  filteredPlugins: Plugin[] = [];

  constructor(protected readonly pluginLoader: PluginLoaderService) {
  }

  ngAfterViewInit(): void {
    this.filteredPlugins = this.scope()
      ? this.pluginLoader.plugins.filter(p => p.conf.scope === this.scope())
      : this.pluginLoader.plugins;

    (async () => {
      for (let i = 0; i < this.filteredPlugins.length; i++) {
        const plugin = this.filteredPlugins[i];
        const component = await this.pluginLoader.loadComponent(plugin);
        const container = this.containers.get(i);
        container?.clear();
        container?.createComponent(component);
      }
    })();
  }
}
