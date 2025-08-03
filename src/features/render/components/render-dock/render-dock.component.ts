import {AfterViewInit, ChangeDetectorRef, Component, QueryList, ViewChildren, ViewContainerRef} from '@angular/core';
import {PluginLoaderService} from '../../../plugins/services/plugin-loader.service';
import {RenderType} from '../../enums/render-type';
import {NgClass} from '@angular/common';
import {PossiblePlugins} from '../../../plugins/entities';

@Component({
  selector: 'lin-render-preview',
  standalone: true,
  imports: [
    NgClass
  ],
  template: `
    <div [ngClass]="{
      'small-height': activePlugins.length === 0,
      'normal-height': activePlugins.length > 0
    }" class="ps-3 py-2 pe-2 dock-container rounded-4 bg-primary">
      @for (plugin of activePlugins; track plugin.configuration) {
        <ng-template #pluginContainer></ng-template>
      }
    </div>
  `,
  styles: `
    .dock-container {
      transition: filter 0.3s ease-in-out, height 0.3s ease-in-out;

      &.small-height {
        height: 0;
        filter: grayscale(0.4);
      }

      &.normal-height {
        height: 40px;
      }
    }
  `
})
export class RenderDockComponent implements AfterViewInit {
  @ViewChildren('pluginContainer', {read: ViewContainerRef})
  containers!: QueryList<ViewContainerRef>;
  public activePlugins: PossiblePlugins[] = [];

  private readonly renderType: RenderType = RenderType.Dock;

  public constructor(
    protected readonly pluginLoader: PluginLoaderService,
    private readonly cdr: ChangeDetectorRef
  ) {
  }

  private filterAndRender(): void {
    this.activePlugins = this.pluginLoader.plugins.filter((p: PossiblePlugins): boolean => p.configuration.dockActive);
    this.cdr.detectChanges();
    this.pluginLoader.render(this.activePlugins, this.containers, this.renderType).catch(console.error);
  }

  public ngAfterViewInit(): void {
    const renderCallback = (): void => this.filterAndRender();
    this.pluginLoader.initializeConfigurationChangeListeners(renderCallback);
    renderCallback();
  }
}
