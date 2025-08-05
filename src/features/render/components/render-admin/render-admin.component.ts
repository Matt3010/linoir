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

@Component({
  selector: 'lin-render-admin',
  standalone: true,
  template: `
    @for (_ of this.pluginLoader.plugins; track $index) {
      <ng-template #pluginContainer></ng-template>
      <hr>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RenderAdminComponent implements AfterViewInit {
  @ViewChildren('pluginContainer', {read: ViewContainerRef})
  pluginContainers: QueryList<ViewContainerRef> | undefined = undefined;

  private readonly renderType: RenderType = RenderType.Admin;

  constructor(
    protected readonly pluginLoader: PluginLoaderService,
    private readonly cdr: ChangeDetectorRef
  ) {
  }

  public ngAfterViewInit(): void {
    if (this.pluginContainers !== undefined) {
      const renderCallback: () => Promise<void> = (): Promise<void> => this.pluginLoader.render(this.pluginLoader.plugins, this.pluginContainers as QueryList<ViewContainerRef>, this.renderType
      ).catch(console.error)
        .then((): void => {
            this.cdr.markForCheck();
          }
        );
      this.pluginLoader.initializeConfigurationChangeListeners(renderCallback);
      renderCallback();
    }
  }
}
