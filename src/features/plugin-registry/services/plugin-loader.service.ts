import {Injectable, Type} from '@angular/core';
import {Plugin} from '../entities/Plugin';

interface PluginManifest {
  key: string;
  componentName: string;
  scope: string;
  loader: () => Promise<Record<string, Type<unknown>>>;
}

const PLUGINS: PluginManifest[] = [
  {
    key: 'calendar-admin',
    componentName: 'AdminCalendarComponent',
    scope: 'admin',
    loader: () => import('../../plugins/calendar/scopes/admin/admin-calendar/admin-calendar.component'),
  },
  {
    key: 'calendar-kiosk',
    componentName: 'KioskCalendarComponent',
    scope: 'kiosk',
    loader: () => import('../../plugins/calendar/scopes/kiosk/kiosk-calendar/kiosk-calendar.component'),
  }
];

@Injectable()
export class PluginLoaderService {

  private readonly _plugins: Plugin[] = [];
  public get plugins(): Plugin[] {
    return this._plugins;
  }

  constructor() {
    this.loadManifest();
  }

  private loadManifest(): void {
    this._plugins.length = 0;
    for (const p of PLUGINS) {
      this._plugins.push(new Plugin({
        key: p.key,
        componentName: p.componentName,
        scope: p.scope
      }));
    }
  }

  public async loadComponent(plugin: Plugin): Promise<Type<unknown>> {
    const pluginManifest = PLUGINS.find(p => p.key === plugin.conf.key);
    if (!pluginManifest) {
      throw new Error(`Plugin ${plugin.conf.key} not found in manifest`);
    }

    const module = await pluginManifest.loader();
    const component = module[plugin.conf.componentName];

    if (!component) {
      throw new Error(`Component ${plugin.conf.componentName} not found in plugin ${plugin.conf.key}`);
    }

    return component;
  }
}
