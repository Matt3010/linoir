import {WebsocketService} from '../../../common/services/websocket.service';
import {Observable, Subject} from 'rxjs';
import {RenderType} from '../../render/enums/render-type';
import {BaseMessagePayload, PluginManifest, PluginVariant} from '../entities';


export abstract class BasePlugin<GenericConfig extends BaseMessagePayload = BaseMessagePayload> {

  private readonly _variants: Map<RenderType, PluginVariant> = new Map<RenderType, PluginVariant>();
  private readonly _configurationChangeEvent$: Subject<void> = new Subject<void>();
  public readonly configurationChangeEvent: Observable<void> = this._configurationChangeEvent$.asObservable();
  public readonly webSocketService: WebsocketService;
  public readonly defaultConfig: GenericConfig = {
    kioskActive: true,
    lastUpdatedAt: new Date(),
    dockActive: false,
  } as GenericConfig;


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
    // setTimeout is used to ensure that the configuration is initialized after the component is created
    setTimeout((): void => {
      this.initOrMergeConfiguration();
    });
    this.webSocketService = webSocketService;
  }

  public addVariant(scope: RenderType, variant: PluginVariant): void {
    this._variants.set(scope, variant);
  }

  public set configuration(configuration: GenericConfig) {
    localStorage.setItem(`${this.key()}`, JSON.stringify(configuration));
    this._configurationChangeEvent$.next();
  }

  public updateConfiguration(configuration: Partial<GenericConfig>): void {
    const nextConfiguration = {
      ...this.configuration,
      ...configuration,
      lastUpdatedAt: new Date(),
    };
    localStorage.setItem(`${this.key()}`, JSON.stringify(nextConfiguration));
  }

  public resetConfiguration(): void {
    this.configuration = this.defaultConfig;
  }

  public get configuration(): GenericConfig {
    const storedMemoryJson: string = localStorage.getItem(`${this.key()}`)!;
    return JSON.parse(storedMemoryJson) as GenericConfig;
  }

  private initOrMergeConfiguration(): void {
    const savedConfigString: string | null = localStorage.getItem(`${this.key()}`);
    if (savedConfigString) {
      const savedConfig: GenericConfig = JSON.parse(savedConfigString);

      this.configuration = {
        ...savedConfig,
        ...this.defaultConfig,
        lastUpdatedAt: new Date(),
      };
    } else {
      this.configuration = this.defaultConfig;
    }
  }

}
