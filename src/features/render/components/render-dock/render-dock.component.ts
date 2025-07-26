import {AfterViewInit, ChangeDetectorRef, Component, QueryList, ViewChildren, ViewContainerRef} from '@angular/core';
import {PluginLoaderService, PossiblePlugin} from '../../../plugins/services/plugin-loader.service';
import {RenderType} from '../../enums/render-type';

@Component({
  selector: 'lin-render-preview',
  standalone: true,
  imports: [],
  template: `
    <div class="bg-danger bottom-0 end-0 dock-container rounded">
      @for (plugin of activePlugins; track plugin.configuration) {
        <ng-template #pluginContainer></ng-template>
      }
    </div>
  `,
  styles: `
    .dock-container {
      width: 100%;
      height: 70px;
    }
  `
})
export class RenderDockComponent implements AfterViewInit {
  @ViewChildren('pluginContainer', {read: ViewContainerRef})
  containers!: QueryList<ViewContainerRef>;
  public activePlugins: PossiblePlugin[] = [];

  private readonly renderType: RenderType = RenderType.Dock;

  public constructor(
    protected readonly pluginLoader: PluginLoaderService,
    private readonly cdr: ChangeDetectorRef
  ) {
  }

  private filterAndRender(): void {
    this.activePlugins = this.pluginLoader.plugins.filter((p: PossiblePlugin): boolean => p.configuration.dockActive);
    this.cdr.detectChanges();
    this.pluginLoader.render(this.activePlugins, this.containers, this.renderType).catch(console.error);
  }

  public ngAfterViewInit(): void {
    const renderCallback = (): void => this.filterAndRender();
    this.pluginLoader.initializeConfigurationChangeListeners(renderCallback);
    renderCallback();
  }
}
