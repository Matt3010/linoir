import {
  AfterViewInit,
  Component,
  ComponentRef,
  input,
  InputSignal,
  QueryList,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import {LoadedPluginComponent, PluginLoaderService} from '../../../plugins/services/plugin-loader.service';
import {BaseMessagePayload, Plugin} from '../../../plugins/models/Plugin';

@Component({
  selector: 'lin-render-preview',
  standalone: true,
  imports: [],
  template: `
    <div class="d-flex flex-wrap">
      @for (plugin of filteredPlugins(pluginLoader.plugins); track plugin) {
        <div class="flex-grow-1">
          <ng-template #pluginContainer></ng-template>
        </div>
      }
    </div>
  `
})
export class RenderKioskComponent implements AfterViewInit {

  public scope: InputSignal<string> = input.required<string>();

  @ViewChildren('pluginContainer', {read: ViewContainerRef})
  containers!: QueryList<ViewContainerRef>;

  constructor(protected readonly pluginLoader: PluginLoaderService) {
  }

  filteredPlugins(plugins: Plugin[]): Plugin[] {
    return plugins.filter((p: Plugin<BaseMessagePayload>): boolean => p.scope === this.scope())
      .filter((p: Plugin<BaseMessagePayload>): boolean => p.configuration.active)
  }

  public ngAfterViewInit(): void {
    (async (): Promise<void> => {
      const filteredPlugins: Plugin[] = this.filteredPlugins(this.pluginLoader.plugins);
      for (let i: number = 0; i < filteredPlugins.length; i++) {
        const plugin: Plugin<BaseMessagePayload> = filteredPlugins[i];
        const res: LoadedPluginComponent = await this.pluginLoader.loadComponent(plugin);
        const container: ViewContainerRef | undefined = this.containers.get(i);

        if (!container) {
          return;
        }

        container.clear();
        const componentRef: ComponentRef<unknown> = container.createComponent(res.component);
        if (componentRef) {
          componentRef.setInput('classInput', res.plugin);
        }
      }
    })();
  }
}
