import {PluginManifest, PluginVariant} from '../services/plugin-loader.service';
import {Message, WebsocketService} from '../../../common/services/websocket.service';

export abstract class Plugin<TPayload = any> {
  protected constructor(
    private readonly manifest: PluginManifest,
    private readonly variant: PluginVariant,
    protected readonly webSocketService: WebsocketService
  ) {
  }

  public get key(): string {
    return this.manifest.key;
  }

  public get scope(): string {
    return this.variant.scope;
  }

  public get componentName(): string {
    return this.variant.componentName;
  }

  public get conf(): { key: string; scope: string; componentName: string } {
    return {
      key: this.manifest.key,
      scope: this.variant.scope,
      componentName: this.variant.componentName
    };
  }

  public listenTopic() {
    this.webSocketService.subscribe(this.key).subscribe();
  }

  public abstract sendMessage(message: Message<TPayload>): void;
}
