import {Plugin} from './Plugin';
import {Message, WebsocketService} from '../../../common/services/websocket.service';
import {PluginManifest, PluginVariant} from '../services/plugin-loader.service';

export class CalendarPlugin extends Plugin {
  constructor(
    manifest: PluginManifest,
    variant: PluginVariant,
    webSocketService: WebsocketService
  ) {
    super(manifest, variant, webSocketService);
    this.configuration = {
      active: false
    }
  }

  public override sendMessage(message: Message): void {
    this.webSocketService.send<Message>({
      topic: this.key,
      payload: message
    });
  }
}
