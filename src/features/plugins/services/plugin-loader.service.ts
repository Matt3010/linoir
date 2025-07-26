import {ComponentRef, Injectable, QueryList, Type, ViewContainerRef} from '@angular/core';
import {WebsocketService} from '../../../common/services/websocket.service';
import {
  CalendarPlugin,
  DockableMixin,
  KioskableMixin,
  NetworkConfigPlugin,
  WithDockable,
  WithKioskable,
} from '../models'
import {RenderType} from '../../render/enums/render-type';
import {PluginManifest, PluginVariant} from '../entities';

interface LoadedAngularComponentWithPluginClass {
  component: Type<unknown>;
  plugin: PossiblePlugin;
}

export type PossiblePlugin =
  | WithKioskable<CalendarPlugin>
  | WithDockable<WithKioskable<NetworkConfigPlugin>>


const PLUGINS: PluginManifest[] = [
  {
    key: 'calendar',
    class: KioskableMixin(CalendarPlugin),
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
    class: KioskableMixin(DockableMixin(NetworkConfigPlugin)),
    variants: [
      {
        scope: RenderType.Admin,
        componentName: 'AdminNetworkConfigComponent',
        loader: () =>
          import(
            '../available/network-config/scopes/admin/admin-network-config.component'
            ),
      },
      {
        scope: RenderType.Kiosk,
        componentName: 'KioskNetworkConfigComponent',
        loader: () =>
          import(
            '../available/network-config/scopes/kiosk/kiosk-network-config.component'
            ),
      },
      {
        scope: RenderType.Dock,
        componentName: 'DockNetworkConfigComponent',
        loader: () =>
          import(
            '../available/network-config/scopes/dock/dock-network-config.component'
            ),
      },
    ],
  },
];

@Injectable()
export class PluginLoaderService {
  private readonly _plugins: PossiblePlugin[] = [];

  public get plugins(): PossiblePlugin[] {
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
          const found: PossiblePlugin | undefined = this._plugins.find((p: PossiblePlugin): boolean => p instanceof manifest.class)
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
          throw new Error('PossiblePlugin class not defined for ' + manifest.key);
        }
      }
    }
  }


  private async getComponent(plugin: PossiblePlugin, scope: RenderType): Promise<LoadedAngularComponentWithPluginClass> {
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
    this.plugins.forEach((plugin: PossiblePlugin): void => {
      plugin.configurationChangeEvent.subscribe((): void => {
        if (callback) {
          requestAnimationFrame((): void => {
            callback();
          });
        }
      });
    });
  }

  public async render(plugins: PossiblePlugin[], containers: QueryList<ViewContainerRef>, scope: RenderType): Promise<void> {
    for (let i: number = 0; i < plugins.length; i++) {
      const plugin: PossiblePlugin = plugins[i];
      const res: LoadedAngularComponentWithPluginClass = await this.getComponent(plugin, scope);
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
