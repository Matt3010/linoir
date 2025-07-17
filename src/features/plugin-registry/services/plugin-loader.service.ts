import {Injectable, Type} from '@angular/core';
import {PluginManifest} from '../entities/plugin-manifest';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, filter, Observable} from 'rxjs';
import {Plugin} from '../entities/Plugin';
import {environment} from '../../../environments/environment';

const LOCAL_PLUGIN_MAP: Record<string, () => Promise<Record<string, Type<unknown>>>> = {
  'calendar-admin': () => import('../../plugins/calendar/scopes/admin/admin-calendar/admin-calendar.component'),
  'calendar-kiosk': () => import('../../plugins/calendar/scopes/kiosk/kiosk-calendar/kiosk-calendar.component'),
};

@Injectable()
export class PluginLoaderService {

  private readonly _plugins$: BehaviorSubject<Plugin[]> = new BehaviorSubject<Plugin[]>([]);
  public readonly plugins$: Observable<Plugin[]> = this._plugins$.asObservable();

  constructor(
    private readonly http: HttpClient,
  ) {
    this.loadManifest();
  }

  private loadManifest(): void {
    this.http.get<PluginManifest[]>(environment.plugin_registry_url)
      .pipe(
        filter((res: PluginManifest[]) => !!res)
      )
      .subscribe((plugins: PluginManifest[]) => {
        const mapped: Plugin[] = plugins.map((p: PluginManifest): Plugin => new Plugin(
          {
            key: p.key,
            componentName: p.componentName,
            scope: p.scope
          }));
        this._plugins$.next(mapped);
      });
  }

  public async loadComponent(plugin: Plugin): Promise<Type<unknown>> {
    const loader = LOCAL_PLUGIN_MAP[plugin.conf.key];
    if (!loader) {
      throw new Error(`Plugin ${plugin.conf.key} not found in static map`);
    }

    const module = await loader();
    const component = module[plugin.conf.componentName];

    if (!component) {
      throw new Error(`Component ${plugin.conf.componentName} not found in ${plugin.conf.key}`);
    }

    return component;
  }
}
