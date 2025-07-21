import {AfterViewInit, Component, QueryList, ViewChildren, ViewContainerRef} from '@angular/core';
import {PluginLoaderService} from '../../../plugins/services/plugin-loader.service';
import {RenderType} from '../../enums/render-type';

@Component({
  selector: 'lin-render-admin',
  standalone: true,
  template: `
    @for (plugin of this.pluginLoader.plugins; track $index) {
      <ng-template #pluginContainer></ng-template>
    }
  `
})
export class RenderAdminComponent implements AfterViewInit {
  @ViewChildren('pluginContainer', {read: ViewContainerRef})
  containers!: QueryList<ViewContainerRef>;

  private readonly renderType: RenderType = RenderType.Admin;

  constructor(protected readonly pluginLoader: PluginLoaderService) {
  }

  public ngAfterViewInit(): void {
    const renderCallback: () => Promise<void> = (): Promise<void> => this.pluginLoader.render(this.pluginLoader.plugins, this.containers, this.renderType).catch(console.error);
    this.pluginLoader.initializeConfigurationChangeListeners(renderCallback);
    renderCallback().then();
  }
}
