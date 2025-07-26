import {ComponentRef, Injectable, QueryList, Type, ViewContainerRef} from '@angular/core';
import {BasePlugin} from '../models/BasePlugin';
import {WebsocketService} from '../../../common/services/websocket.service';
import {CalendarPlugin, NetworkConfigPlugin,} from '../models/_index'
import {RenderType} from '../../render/enums/render-type';
import {PluginVariant} from '../entities/plugin-variant';
import {PluginManifest} from '../entities/plugin-mainfest';

interface LoadedPluginComponent {
  component: Type<unknown>;
  plugin: BasePlugin;
}

const PLUGINS: PluginManifest[] = [
  {
    key: 'calendar',
    class: CalendarPlugin,
    variants: [
      {
        scope: RenderType.Admin,
        componentName: 'AdminCalendarComponent',
        loader: () =>
          import(
            '../available/calendar/scopes/admin/admin-calendar.component'
            ),
      },
      {
        scope: RenderType.Kiosk,
        componentName: 'KioskCalendarComponent',
        loader: () =>
          import(
            '../available/calendar/scopes/kiosk/kiosk-calendar.component'
            ),
      },
    ],
  },
  {
    key: 'network-config',
    class: NetworkConfigPlugin,
    variants: [
      {
        scope: RenderType.Admin,
        componentName: 'NetworkConfigComponent',
        loader: () =>
          import(
            '../available/network-config/scopes/admin/network-config.component'
            ),
      },
      {
        scope: RenderType.Kiosk,
        componentName: 'NetworkConfigComponent',
        loader: () =>
          import(
            '../available/network-config/scopes/kiosk/network-config.component'
            ),
      },
      {
        scope: RenderType.Dock,
        componentName: 'NetworkConfigComponent',
        loader: () =>
          import(
            '../available/network-config/scopes/dock/network-config.component'
            ),
      },
    ],
  },
];

@Injectable()
export class PluginLoaderService {
  private readonly _plugins: BasePlugin[] = [];

  public get plugins(): BasePlugin[] {
    return this._plugins;
  }

  constructor(
    private readonly webSocketService: WebsocketService
  ) {
    this.loadManifest();
  }

  private loadManifest(): void {
    for (const manifest of PLUGINS) {
      for (const v of manifest.variants) {
        if (manifest.class) {
          const found: BasePlugin | undefined = this._plugins.find((p: BasePlugin): boolean => p instanceof manifest.class)
          if (found) {
            found.addVariant(v.scope, v);
          } else {
            const newPlugin = new manifest.class(manifest, this.webSocketService);
            newPlugin.addVariant(v.scope, v);
            this._plugins.push(
              newPlugin
            );
          }
        } else {
          throw new Error('BasePlugin class not defined for ' + manifest.key);
        }
      }
    }
  }


  private async getComponent(plugin: BasePlugin, scope: RenderType): Promise<LoadedPluginComponent> {
    const manifest: PluginManifest | undefined = PLUGINS.find((m: PluginManifest): boolean => m.key === plugin.key());
    if (!manifest) {
      throw new Error(`Plugin '${plugin.key}' non trovato`);
    }

    const variant: PluginVariant | undefined = manifest.variants.find(
      (v: PluginVariant): boolean =>
        v.scope === plugin.scope(scope) &&
        v.componentName === plugin.componentName(scope)
    );
    if (!variant) {
      throw new Error(
        `Variante per scope '${plugin.scope}' e componente '${plugin.componentName}' non trovata`
      );
    }

    const module: Record<string, Type<unknown>> = await variant.loader();
    const component: Type<unknown> = module[variant.componentName];
    if (!component) {
      throw new Error(
        `Componente '${variant.componentName}' non trovato nel plugin '${plugin.key}'`
      );
    }

    return {
      component: component,
      plugin: plugin
    };
  }


  public initializeConfigurationChangeListeners(callback: () => void | Promise<void>): void {
    this.plugins.forEach((plugin: BasePlugin): void => {
      plugin.configurationChangeEvent.subscribe((): void => {
        if (callback) {
          requestAnimationFrame((): void => {
            callback();
          });
        }
      });
    });
  }

  public async render(plugins: BasePlugin[], containers: QueryList<ViewContainerRef>, scope: RenderType): Promise<void> {
    for (let i: number = 0; i < plugins.length; i++) {
      const plugin: BasePlugin = plugins[i];
      const res: LoadedPluginComponent = await this.getComponent(plugin, scope);
      const container: ViewContainerRef | undefined = containers.get(i);

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
