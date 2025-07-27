import {ComponentRef, Injectable, QueryList, Type, ViewContainerRef} from '@angular/core';
import {WebsocketService} from '../../../common/services/websocket.service';
import {RenderType} from '../../render/enums/render-type';
import {PluginManifest, PluginVariant} from '../entities/_index';
import {PLUGINS} from '../utils/plugins.manifest';
import {PossiblePlugin} from '../entities/possible-plugin';

interface LoadedAngularComponentWithPluginClass {
  component: Type<unknown>;
  plugin: PossiblePlugin;
}


@Injectable()
export class PluginLoaderService {
  private readonly _plugins: PossiblePlugin[] = [];

  public get plugins(): PossiblePlugin[] {
    return this._plugins;
  }

  constructor(private readonly webSocketService: WebsocketService) {
    this.loadManifest();
  }

  private loadManifest(): void {
    for (const manifest of PLUGINS) {
      for (const v of manifest.variants) {
        if (manifest.class) {
          // Check if plugin instance already exists
          const found: PossiblePlugin | undefined = this._plugins.find(
            (p: PossiblePlugin): boolean => p instanceof manifest.class
          );
          if (found) {
            found.addVariant(v.scope, v);
          } else {
            // Create a new instance and add variant
            const newPlugin = new manifest.class(manifest, this.webSocketService);
            newPlugin.addVariant(v.scope, v);
            this._plugins.push(newPlugin);
          }
        } else {
          throw new Error('PossiblePlugin class not defined for ' + manifest.key);
        }
      }
    }
  }

  private async getComponent(
    plugin: PossiblePlugin,
    scope: RenderType
  ): Promise<LoadedAngularComponentWithPluginClass> {
    const manifest: PluginManifest | undefined = PLUGINS.find(
      (m: PluginManifest): boolean => m.key === plugin.key()
    );
    if (!manifest) {
      throw new Error(`Plugin '${plugin.key()}' not found`);
    }

    const variant: PluginVariant | undefined = manifest.variants.find(
      (v: PluginVariant): boolean =>
        v.scope === plugin.scope(scope) &&
        v.UIComponentClassName === plugin.UIComponentClassName(scope)
    );
    if (!variant) {
      throw new Error(
        `Variant for scope '${plugin.scope(scope)}' and component '${plugin.UIComponentClassName(scope)}' not found`
      );
    }

    const module: Record<string, Type<unknown>> = await variant.loader();
    const component: Type<unknown> = module[variant.UIComponentClassName];
    if (!component) {
      throw new Error(
        `Component '${variant.UIComponentClassName}' not found in plugin '${plugin.key()}'`
      );
    }

    return {
      component,
      plugin,
    };
  }

  /**
   * Initializes listeners on plugins to handle configuration changes.
   * Calls the provided callback on configuration change.
   */
  public initializeConfigurationChangeListeners(callback: () => void | Promise<void>): void {
    this.plugins.forEach((plugin: PossiblePlugin): void => {
      plugin.configurationChangeEvent.subscribe((): void => {
        if (callback) {
          requestAnimationFrame(() => {
            callback();
          });
        }
      });
    });
  }

  /**
   * Renders the given plugins into the provided Angular view containers according to scope.
   */
  public async render(
    plugins: PossiblePlugin[],
    containers: QueryList<ViewContainerRef>,
    scope: RenderType
  ): Promise<void> {
    for (let i = 0; i < plugins.length; i++) {
      const plugin = plugins[i];
      const res = await this.getComponent(plugin, scope);
      const container = containers.get(i);

      if (!container) {
        console.warn(`No container found for plugin at index ${i}`);
        continue;
      }

      container.clear();
      const componentRef: ComponentRef<unknown> = container.createComponent(res.component);
      componentRef.setInput?.('classInput', res.plugin);
    }
  }
}
