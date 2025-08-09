import {
  AfterViewInit,
  ChangeDetectionStrategy,
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
  ) {
  }

  private render() {
    if (this.pluginContainers !== undefined) {
      this.pluginLoader.render(this.pluginLoader.plugins, this.pluginContainers, this.renderType).then();
    }
  }

  public ngAfterViewInit(): void {
    this.pluginLoader.initializeConfigurationChangeListeners(() => this.render());
  }
}
