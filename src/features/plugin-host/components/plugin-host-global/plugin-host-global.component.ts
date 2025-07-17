import {AfterViewInit, Component, input, InputSignal, QueryList, ViewChildren, ViewContainerRef,} from '@angular/core';
import {PluginLoaderService} from '../../../plugins/services/plugin-loader.service';
import {Plugin} from '../../../plugins/models/Plugin';

@Component({
  selector: 'lin-plugin-host-preview',
  standalone: true,
  imports: [],
  template: `
    @if (this.pluginLoader.plugins.length) {
      @for (_ of this.pluginLoader.plugins; track $index) {
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
      const filteredPlugins: Plugin[] = this.filteredPlugins(this.pluginLoader.plugins);
      for (let i = 0; i < filteredPlugins.length; i++) {
        const plugin = filteredPlugins[i];
        const res = await this.pluginLoader.loadComponent(plugin);
        const container = this.containers.get(i);

        if (!container) {
          return;
        }

        container.clear();
        container.createComponent(res.component);
        const componentRef = container.createComponent(res.component);
        if (componentRef) {
          componentRef.setInput('classInput', res.plugin);
        }
      }
    })();

  }
}
