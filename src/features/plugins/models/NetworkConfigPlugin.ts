import {BaseMessagePayload, Plugin} from './Plugin';
import {PluginManifest, PluginVariant} from '../services/plugin-loader.service';
import {Message, WebsocketService} from '../../../common/services/websocket.service';

interface NetworkMessagePayload extends BaseMessagePayload {
  local_ip: string;
}

export class NetworkConfigPlugin extends Plugin<NetworkMessagePayload> {

  constructor(
    manifest: PluginManifest,
    variant: PluginVariant,
    webSocketService: WebsocketService
  ) {
    super(manifest, variant, webSocketService);
    this.configuration = {
      active: true,
      local_ip: 'ciao'
    }
  }


  public override sendMessage(message: Message): void {
    this.webSocketService.send<Message>({
      topic: this.key,
      payload: message
    });
  }

}
