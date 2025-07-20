import {Injectable, Type} from '@angular/core';
import {Plugin} from '../models/Plugin';
import {WebsocketService} from '../../../common/services/websocket.service';
import {CalendarPlugin, NetworkConfigPlugin} from '../models/_index'

export interface PluginVariant {
  scope: string;
  componentName: string;
  loader: () => Promise<Record<string, Type<unknown>>>;
}

export interface PluginManifest {
  key: string;
  class: any;
  variants: PluginVariant[];
}

export interface LoadedPluginComponent {
  component: Type<unknown>;
  plugin: Plugin;
}

const PLUGINS: PluginManifest[] = [
  {
    key: 'calendar',
    class: CalendarPlugin,
    variants: [
      {
        scope: 'admin',
        componentName: 'AdminCalendarComponent',
        loader: () =>
          import(
            '../available/calendar/scopes/admin/admin-calendar/admin-calendar.component'
            ),
      },
      {
        scope: 'kiosk',
        componentName: 'KioskCalendarComponent',
        loader: () =>
          import(
            '../available/calendar/scopes/kiosk/kiosk-calendar/kiosk-calendar.component'
            ),
      },
    ],
  },
  {
    key: 'network-config',
    class: NetworkConfigPlugin,
    variants: [
      {
        scope: 'admin',
        componentName: 'NetworkConfigComponent',
        loader: () =>
          import(
            '../available/network-config/scopes/admin/network-config/network-config.component'
            ),
      },
      {
        scope: 'kiosk',
        componentName: 'NetworkConfigComponent',
        loader: () =>
          import(
            '../available/network-config/scopes/kiosk/network-config/network-config.component'
            ),
      },
    ],
  },
];

@Injectable()
export class PluginLoaderService {
  private readonly _plugins: Plugin[] = [];

  public get plugins(): Plugin[] {
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
          this._plugins.push(
            new manifest.class(manifest, v, this.webSocketService)
          );
        } else {
          throw new Error('Plugin class not defined for ' + manifest.key);
        }
      }
    }
  }


  public async loadComponent(plugin: Plugin): Promise<LoadedPluginComponent> {
    const manifest = PLUGINS.find((m) => m.key === plugin.key);
    if (!manifest) {
      throw new Error(`Plugin '${plugin.key}' non trovato`);
    }

    const variant: PluginVariant | undefined = manifest.variants.find(
      (v) =>
        v.scope === plugin.scope &&
        v.componentName === plugin.componentName
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
}
