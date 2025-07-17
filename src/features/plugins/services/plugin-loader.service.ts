import {Injectable, Type} from '@angular/core';
import {Plugin} from '../models/Plugin';
import {WebsocketService} from '../../../common/services/websocket.service';
import {CalendarPlugin} from '../models/CalendarPlugin';

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
        this._plugins.push(
          new manifest.class(manifest, v, this.webSocketService)
        );
      }
    }
  }

  public async loadComponent(plugin: Plugin): Promise<LoadedPluginComponent> {
    const manifest = PLUGINS.find((m) => m.key === plugin.conf.key);
    if (!manifest) {
      throw new Error(`Plugin '${plugin.conf.key}' non trovato`);
    }

    const variant = manifest.variants.find(
      (v) =>
        v.scope === plugin.conf.scope &&
        v.componentName === plugin.conf.componentName
    );
    if (!variant) {
      throw new Error(
        `Variante per scope '${plugin.conf.scope}' e componente '${plugin.conf.componentName}' non trovata`
      );
    }

    const module = await variant.loader();
    const component = module[variant.componentName];
    if (!component) {
      throw new Error(
        `Componente '${variant.componentName}' non trovato nel plugin '${plugin.conf.key}'`
      );
    }

    return {
      component: component,
      plugin: plugin
    };
  }
}
