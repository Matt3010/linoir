import {WebsocketService} from '../../../common/services/websocket.service';
import {Observable, Subject} from 'rxjs';
import {RenderType} from '../../render/enums/render-type';
import {BaseMessagePayload, PluginManifest, PluginVariant} from '../entities/_index';


export abstract class BasePlugin<GenericConfig extends BaseMessagePayload = BaseMessagePayload> {

  private readonly _variants: Map<RenderType, PluginVariant> = new Map<RenderType, PluginVariant>();
  private readonly _configurationChangeEvent$: Subject<void> = new Subject<void>();
  public configurationChangeEvent: Observable<void> = this._configurationChangeEvent$.asObservable();
  public readonly webSocketService: WebsocketService;

  public key(): string {
    return this.manifest.key;
  }

  public scope(scope: RenderType): string {
    return this._variants.get(scope)?.scope ?? '';
  }

  public UIComponentClassName(scope: RenderType): string {
    return this._variants.get(scope)?.UIComponentClassName ?? '';
  }


  protected constructor(
    private readonly manifest: PluginManifest,
    webSocketService: WebsocketService
  ) {
    this.webSocketService = webSocketService;
  }

  public addVariant(scope: RenderType, variant: PluginVariant): void {
    this._variants.set(scope, variant);
  }

  public set configuration(configuration: GenericConfig) {
    localStorage.setItem(`${this.key()}`, JSON.stringify(configuration));
    this._configurationChangeEvent$.next();
  }

  public get configuration(): GenericConfig {
    const storedMemoryJson: string = localStorage.getItem(`${this.key()}`)!;
    return JSON.parse(storedMemoryJson) as GenericConfig;
  }

}
