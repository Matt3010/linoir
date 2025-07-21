import {AfterViewInit, Component, QueryList, ViewChildren, ViewContainerRef,} from '@angular/core';
import {PluginLoaderService} from '../../../plugins/services/plugin-loader.service';
import {BasePlugin} from '../../../plugins/models/BasePlugin';
import {RenderType} from '../../enums/render-type';

@Component({
  selector: 'lin-render-preview',
  standalone: true,
  imports: [],
  template: `
    <div class="d-flex flex-wrap">
      @for (plugin of filteredPlugins(pluginLoader.plugins); track $index) {
        <div class="flex-grow-1">
          <ng-template #pluginContainer></ng-template>
        </div>
      }
    </div>
  `
})
export class RenderKioskComponent implements AfterViewInit {
  @ViewChildren('pluginContainer', {read: ViewContainerRef})
  containers!: QueryList<ViewContainerRef>;

  private readonly renderType: RenderType = RenderType.Kiosk;

  constructor(protected readonly pluginLoader: PluginLoaderService) {
  }

  filteredPlugins(plugins: BasePlugin[]): BasePlugin[] {
    return plugins
      .filter((p: BasePlugin): boolean => p.configuration.active);
  }

  public ngAfterViewInit(): void {
    const renderCallback: () => Promise<void> = (): Promise<void> => this.pluginLoader.render(this.filteredPlugins(this.pluginLoader.plugins), this.containers, this.renderType);
    this.pluginLoader.initializeConfigurationChangeListeners(renderCallback);
    renderCallback().then();
  }

}
