import {AfterViewInit, ChangeDetectorRef, Component, QueryList, ViewChildren, ViewContainerRef} from '@angular/core';
import {PluginLoaderService, PossiblePlugin} from '../../../plugins/services/plugin-loader.service';
import {RenderType} from '../../enums/render-type';
import {RouterOutlet} from '@angular/router';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'lin-render-preview',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  template: `
    <div class="d-flex flex-wrap h-100 gap-2 p-2">
      @for (plugin of activePlugins; track plugin.configuration; let last = $last) {
        @if (last) {
          <div class="d-flex flex-column gap-1 flex-grow-1">
            <div class="bg-primary flex-grow-1 rounded ps-3 py-2 pe-2">
              <ng-template #pluginContainer></ng-template>
            </div>
            <router-outlet></router-outlet>
          </div>
        } @else {
          <div class="flex-grow-1 bg-primary rounded ps-3 py-2 pe-2">
            <ng-template #pluginContainer></ng-template>
          </div>
        }
      }
    </div>
  `
})
export class RenderKioskComponent implements AfterViewInit {
  @ViewChildren('pluginContainer', {read: ViewContainerRef})
  containers!: QueryList<ViewContainerRef>;
  public activePlugins: PossiblePlugin[] = [];

  private readonly renderType: RenderType = RenderType.Kiosk;

  public constructor(
    protected readonly pluginLoader: PluginLoaderService,
    private readonly cdr: ChangeDetectorRef
  ) {
  }

  private filterAndRender(): void {
    this.activePlugins = this.pluginLoader.plugins.filter((p: PossiblePlugin): boolean => p.configuration.kioskActive);
    if (this.activePlugins.length === 0) {
      const networkPlugin: PossiblePlugin | undefined =
        this.pluginLoader
          .plugins
          .find((pl: PossiblePlugin) => pl instanceof environment.fallbackAllDeactivated);
      if (networkPlugin) {
        networkPlugin.setKioskActive()
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
