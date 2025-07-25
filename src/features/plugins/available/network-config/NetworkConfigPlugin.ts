import {BaseMessagePayload, BasePlugin} from '../../models/BasePlugin';
import {PluginManifest} from '../../services/plugin-loader.service';
import {WebsocketService} from '../../../../common/services/websocket.service';

interface NetworkMessagePayload extends BaseMessagePayload {
  local_ip: string;
}

export class NetworkConfigPlugin extends BasePlugin<NetworkMessagePayload> {

  constructor(
    manifest: PluginManifest,
    webSocketService: WebsocketService
  ) {
    super(manifest, webSocketService);
    if (!localStorage.getItem(`${this.key()}`)) {
      this.configuration = {
        active: true,
        local_ip: 'ciao',
        lastUpdatedAt: new Date()
      }
    }
  }

}
