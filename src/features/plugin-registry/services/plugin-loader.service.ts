import {Injectable, Type} from '@angular/core';
import {PluginManifest} from '../entities/plugin-manifest';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

const LOCAL_PLUGIN_MAP: Record<string, () => Promise<Record<string, Type<unknown>>>> = {
  'hello': () => import('../../local-plugins/hello-plugin/hello-plugin'),
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

  loadManifest(): void {
    this.http.get<PluginManifest[]>('plugin-registry.json').subscribe((plugins: PluginManifest[]) => {
      this._plugins$.next(plugins);
    });
  }

  async loadComponent(manifest: PluginManifest): Promise<Type<unknown>> {
    console.log(`Loading plugin ${manifest.key} with component ${manifest.componentName} (scope: ${manifest.scope})`);
    const loader = LOCAL_PLUGIN_MAP[manifest.key];
    if (!loader) {
      throw new Error(`Plugin ${manifest.key} not found in static map`);
    }

    const module = await loader();
    const component = module[manifest.componentName];
    if (!component) {
      throw new Error(`Component ${manifest.componentName} not found in ${manifest.key}`);
    }

    return component;
  }

}
