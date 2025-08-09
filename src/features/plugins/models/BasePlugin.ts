import {WebsocketService} from '../../../common/services/websocket.service';
import {RenderType} from '../../render/enums/render-type';
import {BaseMessagePayload, PluginManifest, PluginVariant} from '../entities';


export abstract class BasePlugin<GenericConfig extends BaseMessagePayload = BaseMessagePayload> {

  private readonly _variants: Map<RenderType, PluginVariant> = new Map<RenderType, PluginVariant>();
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
    private readonly _webSocketService: WebsocketService
  ) {
    this.initOrMergeConfiguration();
    this.webSocketService = _webSocketService;
  }

  public addVariant(scope: RenderType, variant: PluginVariant): void {
    this._variants.set(scope, variant);
  }

  public get configuration(): GenericConfig {
    const storedMemoryJson: string = localStorage.getItem(`${this.key()}`)!;
    return JSON.parse(storedMemoryJson) as GenericConfig;
  }

  public resetConfiguration(): void {
    this.updateConfiguration(this.defaultConfig);
  }

  public updateConfiguration(configuration: Partial<GenericConfig>): void {
    const nextConfiguration = {
      ...this.configuration,
      ...configuration,
      lastUpdatedAt: new Date(),
    };
    localStorage.setItem(`${this.key()}`, JSON.stringify(nextConfiguration));
  }

  public initOrMergeConfiguration(): void {
    const savedConfigString: string | null = localStorage.getItem(`${this.key()}`);
    if (savedConfigString) {
      try {
        const savedConfig: Partial<GenericConfig> = JSON.parse(savedConfigString);

        this.updateConfiguration({
          ...this.defaultConfig,
          ...savedConfig,
        });
      } catch (e) {
        console.warn(`Invalid config for plugin ${this.key()}, resetting to default.`, e);
        this.resetConfiguration();
      }
    } else {
      this.resetConfiguration();
    }
  }

}
