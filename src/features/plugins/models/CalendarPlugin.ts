import {Plugin} from './Plugin';
import {Message, WebsocketService} from '../../../common/services/websocket.service';
import {PluginManifest, PluginVariant} from '../services/plugin-loader.service';

interface CalendarPayload {
  topic: string,
  payload: {
    active: boolean;
  };
}

export class CalendarPlugin extends Plugin<CalendarPayload> {
  constructor(
    manifest: PluginManifest,
    variant: PluginVariant,
    webSocketService: WebsocketService
  ) {
    super(manifest, variant, webSocketService);
  }

  public override sendMessage(message: Message<CalendarPayload>): void {
    this.webSocketService.send<Message<CalendarPayload>>({
      topic: this.key,
      payload: message
    });
  }
}
