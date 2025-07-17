import {AfterViewInit, Component, input, InputSignal, QueryList, ViewChildren, ViewContainerRef} from '@angular/core';
import {PluginManifest} from '../../../plugin-registry/entities/plugin-manifest';
import {PluginLoaderService} from '../../../plugin-registry/services/plugin-loader.service';
import {AsyncPipe} from '@angular/common';
import {map} from 'rxjs';

@Component({
  selector: 'lin-plugin-host-preview',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  template: `
    @if (pluginLoader.plugins$ | async) {
      @for (plugin of pluginLoader.plugins$ | async; track $index) {
        <ng-template #pluginContainer></ng-template>
      }
    }
  `
})
export class PluginHostPreviewComponent implements AfterViewInit {

  public scope: InputSignal<string> = input.required<string>();

  @ViewChildren('pluginContainer', {read: ViewContainerRef})
  containers!: QueryList<ViewContainerRef>;

  constructor(protected readonly pluginLoader: PluginLoaderService) {
  }

  public ngAfterViewInit(): void {
    this.pluginLoader.plugins$
      .pipe(map((plugins: PluginManifest[]): PluginManifest[] => {
        const scopeMatch = (plugin: PluginManifest, scope: string) => {
          return plugin.scope === scope;
        }

        if (this.scope()) {
          return plugins.filter((plugin: PluginManifest) => scopeMatch(plugin, this.scope()));
        }
        return plugins;
      }))
      .subscribe((plugins: PluginManifest[]) => {
        (async () => {
          for (let i = 0; i < plugins.length; i++) {
            const manifest = plugins[i];
            const component = await this.pluginLoader.loadComponent(manifest);
            const container = this.containers.get(i);
            container?.clear();
            container?.createComponent(component);
          }
        })();
      });
  }


}
