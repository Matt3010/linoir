import {AfterViewInit, ChangeDetectorRef, Component, QueryList, ViewChildren, ViewContainerRef} from '@angular/core';
import {PluginLoaderService} from '../../../plugins/services/plugin-loader.service';
import {BasePlugin} from '../../../plugins/models/BasePlugin';
import {RenderType} from '../../enums/render-type';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'lin-render-preview',
  standalone: true,
  imports: [],
  template: `
    <div class="d-flex flex-wrap h-100 gap-2 p-2 flip-container">
      @for (plugin of activePlugins; track plugin.configuration) {
        <div class="flex-grow-1 bg-danger rounded target ps-3 py-2 pe-2">
          <ng-template #pluginContainer></ng-template>
        </div>
      }
    </div>
  `
})
export class RenderKioskComponent implements AfterViewInit {
  @ViewChildren('pluginContainer', {read: ViewContainerRef})
  containers!: QueryList<ViewContainerRef>;
  public activePlugins: BasePlugin[] = [];

  private readonly renderType: RenderType = RenderType.Kiosk;

  public constructor(
    protected readonly pluginLoader: PluginLoaderService,
    private readonly cdr: ChangeDetectorRef
  ) {
  }

  private filterAndRender(): void {
    this.activePlugins = this.pluginLoader.plugins.filter((p: BasePlugin): boolean => p.configuration.active);
    if (this.activePlugins.length === 0) {
      const networkPlugin: BasePlugin | undefined =
        this.pluginLoader
          .plugins
          .find((pl) => pl instanceof environment.fallbackAllDeactivated);
      if (networkPlugin) {
        networkPlugin.setActive()
      }
    }
    this.cdr.detectChanges();
    this.pluginLoader.render(this.activePlugins, this.containers, this.renderType).catch(console.error);
  }

  public ngAfterViewInit(): void {
    const renderCallback = (): void => this.filterAndRender();
    this.pluginLoader.initializeConfigurationChangeListeners(renderCallback);
    renderCallback();
  }
}
