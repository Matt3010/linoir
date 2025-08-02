import {BasePlugin} from '../../models/BasePlugin';
import {BaseMessagePayload, PluginManifest} from '../../entities';
import {WebsocketService} from '../../../../common/services/websocket.service';
import {environment} from '../../../../environments/environment';

export interface TelegramMessagePayload extends BaseMessagePayload {
  iconUrl: string;
  backgroundColor: string;
  apiId: number;
  apiHash: string;
  isLogged: boolean;
  stringSession: string | void,
}

export class TelegramPlugin extends BasePlugin<TelegramMessagePayload> {

  public override defaultConfig: TelegramMessagePayload = {
    kioskActive: true,
    lastUpdatedAt: new Date(),
    dockActive: false,
    iconUrl: 'assets/widgets-icons/telegram.icon.svg',
    backgroundColor: '#212121',
    apiHash: environment.TELEGRAM_API_HASH ?? '',
    apiId: environment.TELEGRAM_API_ID ?? '',
    isLogged: false,
    stringSession: '',
  };

  constructor(
    manifest: PluginManifest,
    webSocketService: WebsocketService
  ) {
    super(manifest, webSocketService);
  }

}
