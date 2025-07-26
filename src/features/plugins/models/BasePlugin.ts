import {Message, WebsocketService} from '../../../common/services/websocket.service';
import {Observable, Subject} from 'rxjs';
import {RenderType} from '../../render/enums/render-type';
import {PluginVariant} from '../entities/plugin-variant';
import {PluginManifest} from '../entities/plugin-mainfest';
import {BaseMessagePayload} from '../entities/base-message-payload';


export abstract class BasePlugin<GenericConfig extends BaseMessagePayload = BaseMessagePayload> {

  private readonly _variants: Map<RenderType, PluginVariant> = new Map<RenderType, PluginVariant>();
  private readonly _configurationChangeEvent$: Subject<void> = new Subject<void>();
  public configurationChangeEvent: Observable<void> = this._configurationChangeEvent$.asObservable();

  public key(): string {
    return this.manifest.key;
  }

  public scope(scope: RenderType): string {
    return this._variants.get(scope)?.scope ?? '';
  }

  public componentName(scope: RenderType): string {
    return this._variants.get(scope)?.componentName ?? '';
  }

  protected constructor(
    private readonly manifest: PluginManifest,
    protected readonly webSocketService: WebsocketService
  ) {
    this.listenTopic().subscribe((res: Message<GenericConfig>): void => {
      res.payload.lastUpdatedAt = new Date();
      this.configuration = res.payload;
    });
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

  toggleDock(): void {
    const currentConfig = this.configuration;
    const newConfig = {...currentConfig, dockActive: !currentConfig.dockActive};
    this.sendMessage(newConfig);
  }

  toggleKiosk(): void {
    const currentConfig = this.configuration;
    const newConfig = {...currentConfig, kioskActive: !currentConfig.kioskActive};
    this.sendMessage(newConfig);
  }

  setKioskActive(): void {
    const currentConfig = this.configuration;
    const newConfig = {...currentConfig, kioskActive: true};
    this.sendMessage(newConfig);
  }

  setDockActive(): void {
    const currentConfig = this.configuration;
    const newConfig = {...currentConfig, dockActive: true};
    this.sendMessage(newConfig);
  }

  public listenTopic(): Observable<Message<GenericConfig>> {
    return this.webSocketService.subscribe<GenericConfig>(this.key());
  }

  public sendMessage(message: GenericConfig): void {
    this.webSocketService.send<GenericConfig>({
      topic: this.key(),
      payload: message
    });
  }
}
