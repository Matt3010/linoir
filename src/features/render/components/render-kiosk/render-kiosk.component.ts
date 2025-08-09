import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  QueryList,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {PluginLoaderService} from '../../../plugins/services/plugin-loader.service';
import {RenderType} from '../../enums/render-type';
import {RouterOutlet} from '@angular/router';
import {PossiblePlugins} from '../../../plugins/entities';

@Component({
  selector: 'lin-render-preview',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  template: `
    <div class="d-flex flex-wrap h-100 gap-1 p-1">
      @for (plugin of activePlugins; track plugin.configuration; let last = $last) {
        @if (last) {
          <div class="d-flex flex-column gap-050 flex-grow-1">
            <div class="bg-primary position-relative flex-grow-1 rounded-4 overflow-hidden">
              <ng-template #pluginContainer></ng-template>
            </div>
            <router-outlet></router-outlet>
          </div>
        } @else {
          <div class="flex-grow-1 position-relative bg-primary rounded-4 overflow-hidden">
            <ng-template #pluginContainer></ng-template>
          </div>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RenderKioskComponent implements AfterViewInit {
  @ViewChildren('pluginContainer', {read: ViewContainerRef})
  containers!: QueryList<ViewContainerRef>;
  public activePlugins: PossiblePlugins[] = [];

  private readonly renderType: RenderType = RenderType.Kiosk;

  public constructor(
    protected readonly pluginLoader: PluginLoaderService,
    private readonly cdr: ChangeDetectorRef
  ) {
  }

  private filterAndRender(): void {
    this.activePlugins = this.pluginLoader.plugins.filter((p: PossiblePlugins): boolean => p.configuration.kioskActive);
    this.cdr.detectChanges();
    this.pluginLoader.render(this.activePlugins, this.containers, this.renderType).then()
  }

  public ngAfterViewInit(): void {
    this.pluginLoader.initializeConfigurationChangeListeners(() => this.filterAndRender());
  }
}
