import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {PluginManifest} from '../../../plugin-registry/entities/plugin-manifest';
import {PluginLoaderService} from '../../../plugin-registry/services/plugin-loader.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-plugin-host',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  template: `
    <h2>Plugin Host</h2>
    <div>
      @for (plugin of (pluginLoader.plugins$ | async); track plugin.id) {
        <button (click)="loadPlugin(plugin)">
          Carica {{ plugin.label }}
        </button>
      }
    </div>
    <ng-template #container></ng-template>
  `
})
export class PluginHostComponent {
  @ViewChild('container', {read: ViewContainerRef}) container!: ViewContainerRef;

  constructor(protected readonly pluginLoader: PluginLoaderService) {
  }


  async loadPlugin(manifest: PluginManifest) {
    const component = await this.pluginLoader.loadComponent(manifest);
    this.container.clear();
    this.container.createComponent(component);
  }
}
