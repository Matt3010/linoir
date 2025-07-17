import {Injectable, Type} from '@angular/core';
import {PluginManifest} from '../entities/plugin-manifest';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import _ from 'lodash';

const LOCAL_PLUGIN_MAP: Record<string, () => Promise<Record<string, Type<unknown>>>> = {
  'hello': () => import('../../local-plugins/hello-plugin/hello-plugin'),
  'hello2': () => import('../../local-plugins/hello-plugin-2/hello-plugin'),
};

@Injectable()
export class PluginLoaderService {

  private readonly _plugins$: BehaviorSubject<PluginManifest[]> = new BehaviorSubject<PluginManifest[]>([]);
  public readonly plugins$: Observable<PluginManifest[]> = this._plugins$.asObservable();

  constructor(
    private readonly http: HttpClient
  ) {
    this.loadManifest()
  }

  private loadManifest(): void {
    this.http.get<PluginManifest[]>('plugin-registry.json').subscribe((plugins: PluginManifest[]) => {
      localStorage.setItem('plugin-manifest', JSON.stringify(plugins));
      const storedPlugins: string | null = localStorage.getItem('plugin-manifest');
      if (!storedPlugins) {
        this._plugins$.next(plugins);
        return;
      }
      const parsedPlugins: PluginManifest[] = JSON.parse(storedPlugins);
      if (parsedPlugins.length === 0) {
        this._plugins$.next(plugins);
      }
      const mergedPlugins = _.uniqWith([...plugins, ...parsedPlugins], (a: PluginManifest, b: PluginManifest): boolean => {
        return a.key === b.key && a.scope === b.scope;
      });
      this._plugins$.next(mergedPlugins);
    });
  }

  public reloadManifest(): void {
    this.loadManifest();
  }

  public async loadComponent(manifest: PluginManifest): Promise<Type<unknown>> {
    console.log(`Loading plugin ${manifest.key} with component ${manifest.componentName} (scope: ${manifest.scope})`);
    const loader = LOCAL_PLUGIN_MAP[manifest.key];
    if (!loader) {
      throw new Error(`Plugin ${manifest.key} not found in static map`);
    }

    const module: Record<string, Type<unknown>> = await loader();
    const component: Type<unknown> = module[manifest.componentName];
    if (!component) {
      throw new Error(`Component ${manifest.componentName} not found in ${manifest.key}`);
    }

    return component;
  }

}
