import {PluginManifest, PluginVariant} from '../services/plugin-loader.service';
import {Message, WebsocketService} from '../../../common/services/websocket.service';
import {Observable, Subject} from 'rxjs';

export interface BaseMessagePayload {
  active: boolean;
}

export abstract class Plugin<GenericConfig extends BaseMessagePayload = BaseMessagePayload> {

  private readonly _configurationChangeEvent$: Subject<void> = new Subject<void>();
  public configurationChangeEvent: Observable<void> = this._configurationChangeEvent$.asObservable();

  public get key(): string {
    return this.manifest.key;
  }

  public get scope(): string {
    return this.variant.scope;
  }

  public get componentName(): string {
    return this.variant.componentName;
  }


  protected constructor(
    private readonly manifest: PluginManifest,
    private readonly variant: PluginVariant,
    protected readonly webSocketService: WebsocketService
  ) {
  }

  public set configuration(configuration: GenericConfig) {
    localStorage.setItem(`${this.key}`, JSON.stringify(configuration));
    this._configurationChangeEvent$.next();
  }

  public get configuration(): GenericConfig {
    const storedMemoryJson: string = localStorage.getItem(`${this.key}`)!;
    return JSON.parse(storedMemoryJson) as GenericConfig;
  }

  public listenTopic(): void {
    this.webSocketService.subscribe(this.key).subscribe();
  }

  public abstract sendMessage(message: Message<GenericConfig>): void;

}
