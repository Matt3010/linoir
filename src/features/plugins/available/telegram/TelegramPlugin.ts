import {BasePlugin} from '../../models/BasePlugin';
import {BaseMessagePayload, PluginManifest} from '../../entities';
import {WebsocketService} from '../../../../common/services/websocket.service';

interface TelegramMessagePayload extends BaseMessagePayload {
}

export class TelegramPlugin extends BasePlugin<TelegramMessagePayload> {

  constructor(
    manifest: PluginManifest,
    webSocketService: WebsocketService
  ) {
    super(manifest, webSocketService);
    if (!localStorage.getItem(`${this.key()}`)) {
      this.configuration = {
        kioskActive: true,
        lastUpdatedAt: new Date(),
        dockActive: false
      }
    }
  }

}
