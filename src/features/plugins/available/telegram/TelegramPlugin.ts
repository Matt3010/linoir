import {BasePlugin} from '../../models/BasePlugin';
import {BaseMessagePayload, PluginManifest} from '../../entities';
import {WebsocketService} from '../../../../common/services/websocket.service';

export interface TelegramMessagePayload extends BaseMessagePayload {
  iconUrl: string;
  backgroundColor: string;
}

export class TelegramPlugin extends BasePlugin<TelegramMessagePayload> {

  public override defaultConfig: TelegramMessagePayload = {
    kioskActive: true,
    lastUpdatedAt: new Date(),
    dockActive: false,
    iconUrl: 'assets/widgets-icons/telegram.icon.svg',
    backgroundColor: '#212121',
  };

  constructor(
    manifest: PluginManifest,
    webSocketService: WebsocketService
  ) {
    super(manifest, webSocketService);
  }

}
